from flask import Blueprint, request, jsonify
import sqlite3
import os

update_items_bp = Blueprint('update_items', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../database/triplist.db')

@update_items_bp.route('/item', methods=['PUT'])
def update_items():
    data = request.get_json()

    checklist_id = data.get('checklist_id')
    items = data.get('items')  # [{item_id, item_num, check_bool}, {...}]

    if not checklist_id or not items:
        return jsonify({'error': 'Missing parameters'}), 400

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    for item in items:
        item_name = item.get('item_name')
        item_num = item.get('item_num')
        check_bool = item.get('check_bool')
        item_id = item.get('item_id')

        if item_id is None or item_num is None or check_bool is None or item_name is None:
            continue  # 不完全なデータはスキップ

        cur.execute(
            '''
            UPDATE checklist
            SET  item_name = ?, item_num = ?, check_bool = ?
            WHERE checklist_id = ? AND item_id = ?;
            ''',
            (item_name, item_num, check_bool, checklist_id, item_id)
        )

    conn.commit()
    conn.close()

    return jsonify({'message': f'Checklist ID {checklist_id} items updated successfully'}), 200
