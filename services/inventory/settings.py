import os
import json


dirname = os.path.dirname(__file__)
config_folder = os.path.join(dirname, '..', '..', 'config')
db_folder = os.path.join(dirname, '..', '..', 'db')

# Load config file.
with open(os.path.join(config_folder, 'config.json')) as file:
    config = json.load(file)

root_path = config.get('WOW_FOLDERS_ROOT_PATH', None)
wow_folders = config.get('WOW_FOLDER_NAMES', None)
account_folders = config.get('ACCOUNT_FOLDER_NAMES', None)

SAVED_VARIABLES_PATHS = [f'{root_path}\\{wow_folders[i]}\\_retail_\\WTF\\Account\\{account_folders[i]}\\SavedVariables\\'
        for i in range(0, len(wow_folders))]

LUA_FILE = config.get('LUA_FILE', None)
LUA_FILE_REMOVE_STRING = config.get('LUA_FILE_REMOVE_STRING', None)

OUTPUT_PATH = os.path.join(db_folder, 'inventory.json')