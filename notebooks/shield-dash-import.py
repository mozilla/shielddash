import datetime
from operator import itemgetter

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
            out[k] = datetime.datetime.utcfromtimestamp(
                int(p['payload'][k]) // 1e3)
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

# TODO: Replace with direct push to postgresql.
with open('output/shield-dash.json', 'w') as _file:
    ujson.dump(states.collect(), _file)
