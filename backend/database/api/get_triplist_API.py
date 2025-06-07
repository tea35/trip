from flask import Blueprint, request, jsonify
import sqlite3
import os

#* 最終的に統合するのでブループリントで作る
get_triplist_bp = Blueprint('get_triplist', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../triplist.db')

@get_triplist_bp.route('/triplist', methods=['GET'])
def get_triplist():
    print(db_path)
    data = request.get_json()
    user = data.get('user') #*membersのemailと合わせる

    if not user:
        return jsonify({'error': 'Not user'}), 400

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute(
    '''
        SELECT triplist.*
        FROM triplist
        INNER JOIN members ON members.email = triplist.user
        WHERE members.email = ?;
    ''', (user,))

    rows = cur.fetchall()

    # 取得結果をターミナルに表示
    for row in rows:
        print(row)

    conn.close()
    conn.close()
    
    return jsonify({'message': 'get triplist'}), 201

'''
curl -X POST http://127.0.0.1:5000/get_triplist \
    -H "Content-Type: application/json" \
    -d '{"user": "alice@example.com"}'
'''
