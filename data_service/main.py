"""Rewriten parser"""

import os
import json
import pickle

from multiprocessing import Process, Queue

from settings import REALMS_DICT, CR_IDS_PATH, DATA_PATH
from api import parse_auctions, get_connected_realm_ids

class DataService:
    def __init__(self):
        # Get connected_real_ids hash map
        if not os.path.exists(CR_IDS_PATH):
            self.cr_ids = get_connected_realm_ids()
        else:
            with open(CR_IDS_PATH, 'r') as file:
                self.cr_ids = json.load(file)
        self.realms = list(REALMS_DICT.keys())

    def update_all_realms(self):
        processes = []
        queue= Queue()

        for realm_name in self.realms:
            cr_id = self.cr_ids[realm_name]
            process = Process(target=parse_auctions, 
                    args=(realm_name, cr_id, queue))
            processes.append(process)
            process.start()
        for process in processes:
            process.join()

        auctions = []
        while not queue.empty():
            realm_name, cr_id = queue.get()
            with open(f'{DATA_PATH}/{cr_id}.pickle', 'rb') as file:
                realm_auctions = pickle.load(file)
            auctions.extend(realm_auctions)


    def update_realm(self):
        pass



if __name__ == '__main__':
    ds = DataService()
    ds.update_all_realms()
