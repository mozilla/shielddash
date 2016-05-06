import datetime
from operator import itemgetter

import boto3
import psycopg2
import ujson
from moztelemetry import get_pings


PING_NAME = 'x-shield-studies'
HEARTBEAT_NAME = 'x-shield-study-performance-1'
STUDY_NAME = 'screen Performance X1'
STUDY_START = '20160325'
TODAY = datetime.date.today().strftime('%Y%m%d')


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
            firstrun = p['payload'].get(k)
            if firstrun is None:
                out[k] = out['creation_date']
            else:
                out[k] = datetime.datetime.utcfromtimestamp(
                    int(firstrun) // 1e3)
        else:
            out[k] = p['payload'][k]
    return out


kwargs = {
    'doc_type': 'OTHER',
    'submission_date': (STUDY_START, TODAY),
    'app': 'Firefox',
}


channels = ['release', 'aurora', 'beta', 'nightly']
pings = sc.union([get_pings(sc, channel=channel, **kwargs)  # flake8: noqa
                  for channel in channels])
pings = pings.filter(lambda p: p['meta']['docType'] == PING_NAME)
pings = pings.filter(lambda p: p['payload']['name'] == STUDY_NAME)
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


states = (pings.keyBy(itemgetter('client_id'))
               .aggregateByKey(summaryProto, aggUV, aggUU)).values()
statesdata = states.collect()

s3 = boto3.resource("s3")
metasrcs = ujson.load(s3.Object("net-mozaws-prod-us-west-2-pipeline-metadata",
                               "sources.json").get()["Body"])
creds = ujson.load(s3.Object("net-mozaws-prod-us-west-2-pipeline-metadata",
                  metasrcs["shielddash-db"]["metadata_prefix"] +
                  "/write/credentials.json").get()["Body"])

conn = psycopg2.connect(dbname=creds["db_name"], host=creds["host"], port=creds["port"],
                        user=creds["username"], password=creds["password"])

c = conn.cursor()
c.execute("""
INSERT INTO studies_study (name, description, start_time)
       SELECT %s, %s, %s
       WHERE NOT EXISTS (SELECT 1 FROM studies_study WHERE name = %s);""", (STUDY_NAME, STUDY_NAME, STUDY_START, STUDY_NAME))

for st in statesdata:
    c.execute("""INSERT INTO studies_state (created, study_id, channel, variation, completed, ineligible, installed, left_study, seen1, seen2, seen3, seen7)
SELECT NOW(), studies_study.id, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s from studies_study where name = %s""",
         (st['channel'], st['variation'], st['completed'], st['ineligible'], st['installed'], st['left_study'], st['seen1'], st['seen2'], st['seen3'], st['seen7'], STUDY_NAME))
