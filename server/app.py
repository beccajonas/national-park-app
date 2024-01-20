from flask import Flask, make_response, jsonify, request, session, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import datetime
from models import db, Park, User, Comment, Post
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

@app.get("/users")
def get_users():
    users = User.query.all()
    return [u.to_dict(rules=['-password', '-posts.comments', '-posts.description', '-posts.id', '-posts.name']) for u in users]


@app.get("/comments")
def get_comments():
    comments = Comment.query.all()
    return [c.to_dict() for c in comments]

@app.get("/posts")
def get_posts():
    posts = Post.query.all()
    return [p.to_dict() for p in posts]

@app.get("/parks")
def get_parks():
    parks = Park.query.all()
    return [p.to_dict(rules=['-posts.comments']) for p in parks]

if __name__ == '__main__':
    app.run(port=5555, debug=True)