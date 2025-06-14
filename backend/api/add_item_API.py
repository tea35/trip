from flask import Blueprint, request, jsonify
import sqlite3
import os

#* 最終的に統合するのでブループリントで作る
add_item_bp = Blueprint('add_item', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../database/triplist.db')

@add_item_bp.route('/item', methods=['POST'])
def add_item():
    data = request.get_json()
    checklist_id = data.get('checklist_id' ) #* triplistのtrip_idを入れる
    item_name = data.get('item_name')
    item_num = data.get('item_num')
    check_bool = data.get('check_bool')

   # 各フィールドの存在をチェック
    if (checklist_id is None or
        item_name is None or
        item_num is None or
        check_bool is None):
        return jsonify({'error': 'Missing required fields'}), 400
        
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute('''
        INSERT INTO checklist (checklist_id, item_name, item_num, check_bool)
        VALUES (?, ?, ?, ?)
    ''', (checklist_id, item_name, item_num, check_bool))

    conn.commit()
    conn.close()
    
    return jsonify({'message': 'success'}), 201
