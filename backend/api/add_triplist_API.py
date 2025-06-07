from flask import Blueprint, request, jsonify
import sqlite3
import os

#* 最終的に統合するのでブループリントで作る
add_triplist_bp = Blueprint('add_triplist', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../database/triplist.db')

@add_triplist_bp.route('/triplist', methods=['POST'])
def add_triplist():
    data = request.get_json()
    user = data.get('user' ) #*membersのemailと合わせる
    location_name = data.get('location_name')
    location_latitude = data.get('location_latitude')
    location_longitude = data.get('location_longitude')
    first_date = data.get('first_date')
    last_date = data.get('last_date')


    if not user or not location_name or not location_latitude or not location_longitude:
        return jsonify({'error': 'email and password are required'}), 400

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute('''
        INSERT INTO triplist (user, location_name, location_latitude, location_longitude, first_date, last_date)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user, location_name, location_latitude, location_longitude, first_date, last_date,))

    conn.commit()
    conn.close()
    
    return jsonify({'message': 'User registered successfully'}), 201

