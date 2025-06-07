from flask import Blueprint, request, jsonify
import sqlite3
import os

#* 最終的に統合するのでブループリントで作る
get_item_bp = Blueprint('get_item', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../triplist.db')

@get_item_bp.route('/item', methods=['GET'])
def get_item():
    data = request.get_json()
    checklist_id = data.get('checklist_id') #* triplistのtrip_idを入れる

    if not checklist_id:
        return jsonify({'error': 'Not id'}), 400

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute(
    '''
        SELECT checklist.*
        FROM checklist
        INNER JOIN triplist ON checklist.checklist_id = triplist.trip_id
        WHERE checklist_id = ?;
    ''', (checklist_id,))

    rows = cur.fetchall()

    # 取得結果をターミナルに表示
    for row in rows:
        print(row)

    conn.close()
    conn.close()
    
    return jsonify({'message': 'id'}), 201
