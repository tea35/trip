import sqlite3
import os

def create_tables():
    #! バグ防止のために絶対パスを使う
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(BASE_DIR, '../database/triplist.db')
    
    conn = sqlite3.connect(db_path)  # SQLite DB ファイルに接続
    cursor = conn.cursor()

    # SQL スクリプトをまとめる
    sql_script = '''
    CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS triplist (
        user TEXT NOT NULL,
        location_name TEXT NOT NULL,
        location_latitude REAL,
        location_longitude REAL,
        first_date TEXT NOT NULL,
        last_date TEXT NOT NULL,
        trip_id INTEGER PRIMARY KEY AUTOINCREMENT
    );

    CREATE TABLE IF NOT EXISTS checklist (
        checklist_id INTEGER,
        item_name TEXT NOT NULL,
        item_num INTEGER,
        check_bool INTEGER,
        item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        FOREIGN KEY (checklist_id) REFERENCES triplist(trip_id) ON DELETE CASCADE
    );
    '''

    # スクリプトをまとめて実行
    cursor.executescript(sql_script)

    conn.commit()
    conn.close()
