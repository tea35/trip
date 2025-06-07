from flask import Flask
from create_db import create_tables
from api.register_API import register_bp
from api.login_API import login_bp
from api.add_triplist_API import add_triplist_bp
from api.add_item_API import add_item_bp
from api.get_triplist_API import get_triplist_bp
from api.get_item_API import get_item_bp
from api.delete_triplist_API import delete_triplist_bp
from api.delete_item_API import delete_item_bp

app = Flask(__name__)

# Blueprintを登録
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(add_triplist_bp)
app.register_blueprint(add_item_bp)
app.register_blueprint(get_triplist_bp)
app.register_blueprint(get_item_bp)
app.register_blueprint(delete_triplist_bp)
app.register_blueprint(delete_item_bp)

if __name__ == '__main__':
    with app.app_context():
        print(app.url_map)
    create_tables()
    app.run(debug=True, port=5000)
