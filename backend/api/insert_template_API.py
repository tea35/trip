from flask import Blueprint,request, jsonify
import sqlite3
import os
from datetime import datetime

insert_template_bp = Blueprint('insert_template', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../database/triplist.db')

@insert_template_bp.route('/insert_template', methods=['POST'])
def insert_template():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    data = request.get_json()
    user = data.get('user') #*membersのemailと合わせる

    # 1️⃣ triplistテーブルから最大のtrip_idを取得
    cur.execute('''
    SELECT trip_id, first_date, last_date
    FROM triplist
    WHERE user = ?
    ORDER BY trip_id DESC
    LIMIT 1;
    ''',(user,))

    result = cur.fetchone()
    if result:
        max_trip_id, first_date, last_date = result
    else:
        max_trip_id, first_date, last_date = None, None, None

    first_date = datetime.strptime(first_date, "%Y-%m-%d")
    last_date = datetime.strptime(last_date, "%Y-%m-%d")
    date_diff = (last_date - first_date).days

    if not max_trip_id:
        conn.close()
        return jsonify({'error': 'triplistテーブルにデータがありません。'}), 400

    # 2️⃣ テンプレートのアイテムを定義
    template_items = [
        {'item_name': 'パスポート', 'item_num': 1, 'check_bool': 0},
        {'item_name': '財布・現金', 'item_num': 1, 'check_bool': 0},
        {'item_name': 'スマートフォン', 'item_num': 1, 'check_bool': 0},
        {'item_name': '充電器', 'item_num': 1, 'check_bool': 0},
        {'item_name': '服', 'item_num': date_diff, 'check_bool': 0},
        {'item_name': '下着・靴下', 'item_num': date_diff, 'check_bool': 0},
        {'item_name': '歯ブラシ', 'item_num': 1, 'check_bool': 0},
        {'item_name': 'タオル', 'item_num': date_diff, 'check_bool': 0},
        {'item_name': '化粧品・スキンケア', 'item_num': 1, 'check_bool': 0},
        {'item_name': '折りたたみ傘', 'item_num': 1, 'check_bool': 0}
    ]

    # 3️⃣ checklistテーブルに一括INSERT
    for item in template_items:
        cur.execute(
            '''
            INSERT INTO checklist (checklist_id, item_name, item_num, check_bool)
            VALUES (?, ?, ?, ?);
            ''',
            (max_trip_id, item['item_name'], item['item_num'], item['check_bool'])
        )

    conn.commit()
    conn.close()

    return jsonify({
        'message': 'テンプレートアイテムを追加しました。',
        'trip_id': max_trip_id
    }), 201

