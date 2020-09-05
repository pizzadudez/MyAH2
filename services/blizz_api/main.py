"""Rewriten parser"""

import os
import json
import time
import pickle

from multiprocessing import Process, Queue

from settings import REALMS_DICT, CR_IDS_PATH, DATA_PATH
from api import create_api_instance
from db import update_auctions_db

class DataService:
    def __init__(self):
        # Extended wowApi instance
        self.api = create_api_instance()
        # Get connected_real_ids hash map
        if not os.path.exists(CR_IDS_PATH):
            self.cr_ids = self.api.get_connected_realm_ids()
        else:
            with open(CR_IDS_PATH, 'r') as file:
                self.cr_ids = json.load(file)
        self.realms = list(REALMS_DICT.keys())

    def update_all_realms(self):
        queue= Queue()

        # Chunk realm list to throttle subprocesses
        chunk_size = 30
        realm_chunks = [self.realms[x:x + chunk_size] 
                for x in range(0, len(self.realms), chunk_size)]

        # Multiprocessing workers
        for chunk in realm_chunks:
            processes = []
            for realm_name in chunk:
                cr_id = self.cr_ids[realm_name]
                process = Process(target=self.api.handle_realm, 
                        args=(realm_name, cr_id, queue))
                processes.append(process)
                process.start()
                time.sleep(1)
            for process in processes:
                process.join()
        print('> Requests finished...')
        
        # Parse worker data
        parsed_auctions = []
        while not queue.empty():
            # Retrieve data from worker
            realm_name, cr_id = queue.get()
            with open(f'{DATA_PATH}/{cr_id}.pickle', 'rb') as file:
                realm_auctions = pickle.load(file)
            # Parse worker data
            for auc in realm_auctions:
                parsed_auc = (
                    None,
                    auc['id'],
                    realm_name,
                    auc['item']['id'],
                    auc['quantity'],
                    auc['unit_price'],
                    auc['time_left']
                )
                parsed_auctions.append(parsed_auc)
        
        # Db insert
        update_auctions_db(parsed_auctions)


    def update_realm(self):
        pass



if __name__ == '__main__':
    ds = DataService()
    ds.update_all_realms()
