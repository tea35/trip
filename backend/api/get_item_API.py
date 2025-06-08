from flask import Blueprint, request, jsonify
import sqlite3
import os

#* 最終的に統合するのでブループリントで作る
get_item_bp = Blueprint('get_item', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../database/triplist.db')

@get_item_bp.route('/item', methods=['GET'])
def get_item():
    checklist_id = request.args.get('checklist_id')

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

    conn.close()
    # データが取得できなかった場合の処理
    if not rows:
        return jsonify({'error': 'No data found'}), 404

    # データを辞書に変換
    items = [dict(zip([col[0] for col in cur.description], row)) for row in rows]

    if not items:
        return jsonify({'error': 'No data found'}), 404

    return jsonify(items), 200