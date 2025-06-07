import sqlite3
from random import uniform, randint
from datetime import datetime, timedelta

def create_dummy_data():
    conn = sqlite3.connect('./backend/database/triplist.db')
    cur = conn.cursor()

    # membersのダミーデータ10件
    members = [
        (f'user{i}@example.com', f'pass{i}') for i in range(1, 11)
    ]
    cur.executemany('INSERT OR IGNORE INTO members (email, password) VALUES (?, ?)', members)

    # triplistのダミーデータ10件（userは重複あり）
    users_for_trips = ['user1@example.com', 'user2@example.com', 'user3@example.com', 'user4@example.com', 'user5@example.com']

    base_date = datetime(2025, 7, 1)
    triplist = []
    for i in range(10):
        user = users_for_trips[i % 5]
        location_name = f'Location_{i+1}'
        location_latitude = round(uniform(-90, 90), 6)
        location_longitude = round(uniform(-180, 180), 6)
        first_date = base_date + timedelta(days=i * 3)
        last_date = first_date + timedelta(days=randint(1, 7))
        triplist.append((
            user,
            location_name,
            location_latitude,
            location_longitude,
            first_date.strftime('%Y-%m-%d'),
            last_date.strftime('%Y-%m-%d')
        ))

    cur.executemany('''
        INSERT INTO triplist (user, location_name, location_latitude, location_longitude, first_date, last_date)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', triplist)

    # checklistのダミーデータ10件
    # checklist_idを1〜3のどれかにして、各旅行に複数アイテムが属している想定
    checklist = []
    for i in range(10):
        checklist_id = randint(1, 3)  # 1〜3のどれか
        item_name = f'Item_{i+1}'
        item_num = randint(1, 5)
        check_bool = randint(0, 1)
        checklist.append((
            checklist_id,
            item_name,
            item_num,
            check_bool
        ))

    cur.executemany('''
        INSERT INTO checklist (checklist_id, item_name, item_num, check_bool)
        VALUES (?, ?, ?, ?)
    ''', checklist)

    conn.commit()
    conn.close()
    print("ダミーデータを追加しました。")

# テーブル作成も別途用意されている想定
if __name__ == "__main__":
    create_dummy_data()

