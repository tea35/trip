from flask import Blueprint, request, jsonify
import sqlite3
import os

delete_triplist_bp = Blueprint('delete_triplist', __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../triplist.db')

@delete_triplist_bp.route('/triplist/<int:trip_id>', methods=['DELETE'])
def delete_triplist(trip_id):
    print(db_path)
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON")
    cur = conn.cursor()

    cur.execute(
        '''
        DELETE FROM triplist WHERE trip_id = ?;
        ''', (trip_id,)
    )

    conn.commit()

    if cur.rowcount == 0:
        conn.close()
        return jsonify({'error': 'No triplist found with that trip_id'}), 404

    conn.close()
    
    return jsonify({'message': 'Triplist deleted successfully'}), 200

'''
curl -X DELETE http://127.0.0.1:5000/triplist/3
'''
