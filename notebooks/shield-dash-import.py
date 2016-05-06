import datetime
from operator import itemgetter

import boto3
import psycopg2
import ujson
from moztelemetry import get_pings


PING_NAME = 'x-shield-studies'
HEARTBEAT_NAME = 'x-shield-study-performance-1'


# Set up database connection to shielddash.
s3 = boto3.resource('s3')
metasrcs = ujson.load(
    s3.Object('net-mozaws-prod-us-west-2-pipeline-metadata',
              'sources.json').get()['Body'])
creds = ujson.load(
    s3.Object('net-mozaws-prod-us-west-2-pipeline-metadata',
              '%s/write/credentials.json' % (
                  metasrcs['shielddash-db']['metadata_prefix'],
              )).get()['Body'])

conn = psycopg2.connect(host=creds['host'], port=creds['port'],
                        user=creds['username'], password=creds['password'],
                        dbname=creds['db_name'])
cur = conn.cursor()


# Get the studies we need to gather data for.
cur.execute('SELECT id, name, start_time, end_time FROM studies_study')
studies = cur.fetchall()


def getShieldProps(p):
    out = {
        'client_id': p.get('clientId'),
        'channel': p['application']['channel'],
        'creation_date': datetime.datetime.utcfromtimestamp(
            long(p['meta']['creationTimestamp']) // 1e9),
        'doc_type': p['meta']['docType']
    }
    for k in ['firstrun', 'msg', 'name', 'variation']:
        if k == 'firstrun':
            out[k] = datetime.datetime.utcfromtimestamp(
                int(p['payload'][k]) // 1e3)
        else:
            out[k] = p['payload'][k]
    return out


def aggUV(agg, item):
    for k in ('channel', 'variation'):
        agg[k] = item[k]

    days = (item['creation_date'] - item['firstrun']).days
    if days in (1, 2, 3, 7):
        agg['seen%d' % days] = True

    msg = item['msg']
    if msg == 'user-ended-study':
        agg['left_study'] = True
    elif msg == 'install':
        agg['installed'] = True
    elif msg == 'end-of-study':
        agg['completed'] = True
    elif msg == 'ineligible':
        agg['ineligible'] = True

    return agg


def aggUU(agg1, agg2):
    for k, v in agg2.iteritems():
        if v:
            agg1[k] = v
    return agg1


# Iterate over studies and gather data.
for study in studies:
    study_id, study_name, study_start, study_end = study

    # Clear study states.
    cur.execute('DELETE FROM studies_state WHERE study_id=%s', [study_id])

    kwargs = {
        'doc_type': 'OTHER',
        'submission_date': (study_start.strftime('%Y%m%d'),
                            study_end.strftime('%Y%m%d')),
        'app': 'Firefox',
    }

    channels = ['release', 'aurora', 'beta', 'nightly']
    pings = sc.union([get_pings(sc, channel=channel, **kwargs)  # flake8: noqa
                      for channel in channels])
    pings = pings.filter(lambda p: p['meta']['docType'] == PING_NAME)
    pings = pings.filter(lambda p: p['payload']['name'] == study_name)
    pings = pings.map(getShieldProps).filter(itemgetter('client_id'))

    summaryProto = {
        'channel': None,
        'completed': False,
        'ineligible': False,
        'installed': False,
        'left_study': False,
        'seen1': False,
        'seen2': False,
        'seen3': False,
        'seen7': False,
        'variation': None,
    }

    states = (pings.keyBy(itemgetter('client_id'))
                   .aggregateByKey(summaryProto, aggUV, aggUU)).values().collect()

    fields = None
    for row in states:
        if not fields:
            fields = sorted(row.keys())

        sql = """
            INSERT INTO studies_state (created, study_id, {fields})
            VALUES (NOW(), %s, {placeholders})
        """.format(fields=', '.join(fields),
                   placeholders=', '.join(['%s'] * len(fields)))
        cur.execute(sql, [study_id] + [row[k] for k in fields])
    conn.commit()


# Close DB connection.
cur.close()
conn.close()
