"""Blizzard wow api."""

import os
import requests
import json
import pickle
from wowapi import WowApi

from datetime import datetime, timedelta

from settings import *

BASE_URL = f'https://{REGION}.api.blizzard.com/'
QUERY_PARAMS = f'?namespace=dynamic-{REGION}&locale=en_GB'
LOCALE = '&locale=en_GB'

class CustomApi(WowApi):
    def __init__(self, *args):
        super().__init__(*args)
    
    def handle_realm(self, realm_name, cr_id, queue):
        resource = f'data/wow/connected-realm/{cr_id}/auctions' + QUERY_PARAMS
        response = self.get_resource(resource, REGION)

        auctions = response.get('auctions', [])
        filtered_auctions = []
        for auc in auctions:
            item_id = auc.get('item', {}).get('id', None)
            if ITEMS_DICT.get(str(item_id), None):
                filtered_auctions.append(auc)

        # Pickle data to be retrieved later
        with open(os.path.join(DATA_PATH, f'{cr_id}.pickle'), 'wb') as file:
            pickle.dump(filtered_auctions, file)

        # Put realm name and cr_id in finished queue
        print(realm_name + '... done')
        queue.put((realm_name, cr_id))

    def get_last_modified(self, realm_name, cr_id):
        response = self.test_request_response(cr_id)
        headers = response.headers
        last_mod = headers.get('Last-Modified', None)
        return last_mod

    def test_request_response(self, cr_id, *args, **filters):
        region = REGION
        resource = f'data/wow/connected-realm/{cr_id}/auctions' + QUERY_PARAMS
        resource = resource.format(*args)

        # fetch access token on first run for region
        if region not in self._access_tokens:
            # logger.info('Fetching access token..')
            self._get_client_credentials(region)
        else:
            now = self._utcnow()
            # refresh access token if expiring in the next 30 seconds.
            # this protects against the rare occurrence of hitting
            # the API right as your token expires, causing errors.
            if now >= self._access_tokens[region]['expiration'] - timedelta(seconds=30):
                # logger.info('Access token expired. Fetching new token..')
                self._get_client_credentials(region)

        filters['access_token'] = self._access_tokens[region]['token']
        url = self._format_base_url(resource, region)
        # logger.info('Requesting resource: {0} with parameters: {1}'.format(url, filters))
        return self._handle_request_modified(url, params=filters)

    def _handle_request_modified(self, url, **kwargs):
        try:
            response = self._session.get(url, **kwargs)
        except RequestException as exc:
            # logger.exception(str(exc))
            raise WowApiException(str(exc))

        if not response.ok:
            msg = 'Invalid response - {0} - {1}'.format(url, response.status_code)
            # logger.warning(msg)
            raise WowApiException(msg)

        try:
            return response
        except Exception:
            msg = 'Invalid Json: {0} for {1}'.format(response.content, url)
            # logger.exception(msg)
            raise WowApiException(msg)

    def get_connected_realm_ids(self):
        resource = resource = 'data/wow/connected-realm/index' + QUERY_PARAMS
        response = self.get_resource(resource, REGION)
        
        cr_ids = {}
        for cr in response.get('connected_realms', []):
            url = cr['href'].replace(BASE_URL, '')
            response = self.get_resource(url + LOCALE, REGION)
            cr_id = response['id']
            realm_names = [x['name'] for x in response['realms']]
            for name in realm_names:
                cr_ids[name] = cr_id

        # dump as json 
        with open(CR_IDS_PATH, 'w') as file:
            json.dump(cr_ids, file, indent=4)

        return cr_ids


def create_api_instance():
    api = CustomApi(CLIENT_ID, CLIENT_SECRET)
    # Looks like WowApi handles getting credentials on .get_resource()
    # api._get_client_credentials(REGION)
    return api


if __name__ == '__main__':
    pass

