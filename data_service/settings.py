import os
import json


dirname = os.path.dirname(__file__)
config_path = os.path.join(dirname, '..', 'config')

# Load config file.
with open(os.path.join(config_path, 'config.json')) as file:
    config = json.load(file)
# Load items file.
with open(os.path.join(config_path, 'items.json')) as file:
    items_config = json.load(file)
# Load realms file.
with open(os.path.join(config_path, 'realms.json')) as file:
    realms_config = json.load(file)


# Blizz API
CLIENT_ID = config.get('CLIENT_ID', None)
CLIENT_SECRET = config.get('CLIENT_SECRET', None)
REGION = config.get('REGION', None)

ITEMS_DICT = items_config
REALMS_DICT = realms_config

CR_IDS_PATH = os.path.join(dirname, 'cache', 'cr_ids.json')
DATA_PATH = os.path.join(dirname, 'data')
