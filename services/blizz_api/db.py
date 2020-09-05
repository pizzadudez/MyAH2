import sqlite3

from settings import AUCTIONS_DB_PATH

conn = sqlite3.connect(AUCTIONS_DB_PATH)
cur = conn.cursor()

def update_auctions_db(parsed_auctions):
    # Create or truncate table
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
    # Commit
    conn.commit()