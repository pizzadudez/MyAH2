import sqlite3
import time
import datetime

from settings import AUCTIONS_DB_PATH

conn = sqlite3.connect(AUCTIONS_DB_PATH)
cur = conn.cursor()

def update_auctions_db(parsed_auctions, last_modified_string):
    # Create or truncate auctions table
    cur.execute("""CREATE TABLE IF NOT EXISTS auctions (
            id INTEGER NOT NULL PRIMARY KEY,
            auc_id INTEGER,
            realm TEXT,
            item_id INTEGER,
            quantity INTEGER,
            price INTEGER,
            time_left TEXT)""")
    cur.execute("DELETE FROM auctions")
    # Bulk insert
    cur.executemany("""INSERT INTO auctions
            VALUES(?, ?, ?, ?, ?, ?, ?)""", parsed_auctions)

    # Info table
    cur.execute("""CREATE TABLE IF NOT EXISTS info (
            name TEXT NOT NULL UNIQUE,
            value TEXT NOT NULL)""")
    # Our update
    cur.execute("REPLACE INTO info (name, value) VALUES (?, ?)", ('last_update', time.time()))
    # Blizz API auctions - last modified
    last_modified = datetime.datetime.strptime(last_modified_string, '%a, %d %b %Y %H:%M:%S %Z').replace(tzinfo=datetime.timezone.utc)
    cur.execute("REPLACE INTO info (name, value) VALUES (?, ?)", ('last_modified', last_modified.timestamp()))

    # Commit
    conn.commit()