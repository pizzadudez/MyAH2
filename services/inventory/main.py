
import os
import json

from settings import OUTPUT_PATH, SAVED_VARIABLES_PATHS, LUA_FILE, LUA_FILE_REMOVE_STRING
from utils import table_to_dict

data = {}

for path in SAVED_VARIABLES_PATHS:
    acc_data = table_to_dict(path + LUA_FILE, LUA_FILE_REMOVE_STRING)
    realm_data = acc_data.get('realmData', {})

    for realm_name, realm_data in realm_data.items():
        data[realm_name] = data.get(realm_name, {
            'inventory': {},
            'auctions': {},
            'auction_ids': [],
        })

        inventory_data = realm_data.get('inventoryData', {})
        for char_inventory in inventory_data.values():
            for item_id, quantity in char_inventory.items():
                inventory = data[realm_name]['inventory']
                inventory[item_id] = inventory.get(item_id, 0) + quantity
                
        auction_data = realm_data.get('auctionData', {})
        for char_auctions in auction_data.values():
            for item_id, quantity in char_auctions.items():
                auctions = data[realm_name]['auctions']
                auctions[item_id] = auctions.get(item_id, 0) + quantity
    
        auc_id_data = realm_data.get('auctionIds', {})
        for char_auc_ids in auc_id_data.values():
            auction_ids = data[realm_name]['auction_ids']
            auction_ids.extend(char_auc_ids)

with open(OUTPUT_PATH, 'w') as file:
    json.dump(data, file, indent=4)
