"""Blizzard wow api."""

import requests
import json
import pickle
from wowapi import WowApi

from settings import *

BASE_URL = f'https://{REGION}.api.blizzard.com/'
QUERY_PARAMS = f'?namespace=dynamic-{REGION}&locale=en_GB'
LOCALE = '&locale=en_GB'

Api = WowApi(CLIENT_ID, CLIENT_SECRET, retry_conn_failures=True)
Api._get_client_credentials(REGION)


def parse_auctions(realm_name, cr_id, queue):
    resource = f'data/wow/connected-realm/{cr_id}/auctions' + QUERY_PARAMS
    response = Api.get_resource(resource, REGION)
    
    auctions = response.get('auctions', [])
    filtered_auctions = []
    for auc in auctions:
        item_id = auc.get('item', {}).get('id', None)
        if ITEMS_DICT.get(str(item_id), None):
            filtered_auctions.append(auc)

    # Pickle data to be retrieved later
    with open(f'{DATA_PATH}/{cr_id}.pickle', 'wb') as file:
        pickle.dump(filtered_auctions, file)

    # Put realm name and cr_id in finished queue
    print(realm_name + '... done')
    queue.put((realm_name, cr_id)) 

def get_connected_realm_ids():
    resource = resource = 'data/wow/connected-realm/index' + QUERY_PARAMS
    response = Api.get_resource(resource, REGION)
    
    cr_ids = {}
    for cr in response.get('connected_realms', []):
        url = cr['href'].replace(BASE_URL, '')
        response = Api.get_resource(url + LOCALE, REGION)
        cr_id = response['id']
        realm_names = [x['name'] for x in response['realms']]
        for name in realm_names:
            cr_ids[name] = cr_id

    # dump as json 
    with open(CR_IDS_PATH, 'w') as file:
        json.dump(cr_ids, file, indent=4)

    return cr_ids



if __name__ == '__main__':
    get_connected_realm_ids()

