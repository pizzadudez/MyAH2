import os
from slpp import slpp as lua

def table_to_dict(path, string_to_remove):
    """Decodes lua SavedVariables table as dict."""
    if not os.path.exists(path):
        return {}
    data = {}
    with open(path, encoding="utf-8") as file:
        if file:
            data = lua.decode(
                file.read().replace(string_to_remove, ''))
            return data