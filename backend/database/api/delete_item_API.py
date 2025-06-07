from flask import Blueprint, request, jsonify
import sqlite3
import os

#* 最終的に統合するのでブループリントで作る
delete_item_bp = Blueprint('delete_item', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../triplist.db')

@delete_item_bp.route('/item/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    if not item_id:
        return jsonify({'error': 'Not user'}), 400

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute(
    '''
        DELETE FROM checklist WHERE item_id = ?;
    ''', (item_id,))

    conn.commit()

    if cur.rowcount == 0:
        conn.close()
        return jsonify({'error': 'No triplist found with that trip_id'}), 404

    conn.close()
    
    return jsonify({'message': 'Triplist deleted successfully'}), 200