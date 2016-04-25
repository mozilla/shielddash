mapping = {
    'crashping': {
        'properties': {
            'clientId': {'type': 'string'},
            'appVersion': {'type': 'string'},
            'creationDate': {'type': 'date'},
            'geoCountry': {'type': 'string'},
        }
    }
}


def create_index(es):
    es.indices.create('crashes', body={
        'mappings': mapping,
        'settings': {'number_of_replicas': 0,
                     'number_of_shards': 5}})
