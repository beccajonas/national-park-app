from flask import Flask, make_response, jsonify, request, session, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import datetime
from models import db, Park, User
from flask_cors import CORS
from dotenv import dotenv_values
from flask_bcrypt import Bcrypt
config = dotenv_values(".env")

app = Flask(__name__)
app.secret_key = config['FLASK_SECRET_KEY']
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

db.init_app(app)


@app.get("/")
def index():
    return "national parks backend"

#! Causing recursion
# @app.get("/users")
# def get_users():
#     users = User.query.all()
#     return [u.to_dict(rules=['-posts.user', '-comments.user', '-follower_list.follower', '-following_list.following']) for u in users]

if __name__ == '__main__':
    app.run(port=5555, debug=True)