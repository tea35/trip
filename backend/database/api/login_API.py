from flask import Blueprint, request, jsonify, current_app
import sqlite3
import os

#* 最終的に統合するのでブループリントで作る
login_bp = Blueprint('login', __name__)

#! バグ防止のために絶対パスを使う
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, '../triplist.db')

@login_bp.route('/login', methods=['POST'])
def login():
    '''
    ログイン機能のAPI
    ・JSONデータを受け取ることを想定している
    ・"email"と"password"の二つのtextで判断する
    '''
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'email and password are required'}), 400

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute('SELECT * FROM members WHERE email = ? AND password = ?', (email, password))
    user = cur.fetchone()
    conn.close()

    if user:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
