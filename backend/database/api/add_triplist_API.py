from flask import Blueprint, request, jsonify
import sqlite3
import os

#* 最終的に統合するのでブループリントで作る
add_triplist_bp = Blueprint('add_triplist', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../triplist.db')

@add_triplist_bp.route('/triplist', methods=['POST'])
def add_triplist():
    '''
    登録機能のAPI
    ・triplistに旅行の情報を追加するAPI
    ・JSONデータを受け取ることを想定している
    受け取るデータの内容
    ・user:TEXT型でmembersテーブルのemailと結ぶ
    ・location_name:TEXT型で旅行先の名前
    ・location_latitude:REAL型の緯度
    ・location_longitude:REAL型の経度
    ・date:TEXT型の日付
    '''

    data = request.get_json()
    user = data.get('user' ) #*membersのemailと合わせる
    location_name = data.get('location_name')
    location_latitude = data.get('location_latitude')
    location_longitude = data.get('location_longitude')
    date = data.get('date')


    if not user or not location_name or not location_latitude or not location_longitude:
        return jsonify({'error': 'email and password are required'}), 400

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute('''
        INSERT INTO triplist (user, location_name, location_latitude, location_longitude, date)
        VALUES (?, ?, ?, ?, ?)
    ''', (user, location_name, location_latitude, location_longitude, date))

    conn.commit()
    conn.close()
    
    return jsonify({'message': 'User registered successfully'}), 201

"""
curl -X POST http://127.0.0.1:5000/add_triplist \
    -H "Content-Type: application/json" \
    -d '{"user":"test@example.com", "location_name":"東京", "location_latitude":35.6895, "location_longitude":139.6917, "date":"2025-12-24"}'
"""

