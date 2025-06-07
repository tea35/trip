from flask import Blueprint, request, jsonify
import sqlite3
import os

#* 最終的に統合するのでブループリントで作る
register_bp = Blueprint('register', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../triplist.db')

@register_bp.route('/register', methods=['POST'])
def register():
    '''
    登録機能のAPI
    ・JSONデータを受け取ることを想定している
    ・"email"と"password"の二つのtext型データをとる
    '''

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'email and password are required'}), 400

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute('''
            INSERT INTO members (email, password)
            VALUES (?, ?)
        ''', (email, password))
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.OperationalError as e:
        return jsonify({"message":str(e)}),500
    finally:
        conn.commit()
        conn.close()
    