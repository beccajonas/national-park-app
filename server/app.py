from flask import Flask, make_response, jsonify, request, session, render_template, json
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import datetime
from models import db, Park, User, Comment, Post
from flask_cors import CORS
from dotenv import dotenv_values
from flask_bcrypt import Bcrypt
import boto3
from botocore.exceptions import NoCredentialsError


config = dotenv_values(".env")

app = Flask(__name__)
app.secret_key = config['FLASK_SECRET_KEY']
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config['FLASKS3_BUCKET_NAME'] = config['FLASKS3_BUCKET_NAME']
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

db.init_app(app)

AWS_ACCESS_KEY = config['AWS_ACCESS_KEY_ID']
AWS_REGION = config['AWS_REGION']
AWS_SECRET_KEY = config['AWS_SECRET_KEY']
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

@app.get("/")
def index():
    return "national parks backend"

# Check session
@app.get('/check_session')
def check_session():
    user = db.session.get(User, session.get('user_id'))
    print(f'check session {session.get("user_id")}')
    if user:
        return user.to_dict(rules=['-password']), 200
    else:
        return {"message": "No user logged in"}, 401
    
# Login
@app.post('/login')
def login():
    data = request.json

    user = User.query.filter(User.username == data.get('username')).first()

    if user and bcrypt.check_password_hash(user.password, data.get('password')):
        session["user_id"] = user.id
        print("success")
        return user.to_dict(), 200
    else:
        return { "error": "Invalid username or password" }, 401
    
# Logout
@app.delete('/logout')
def logout():
    session.pop('user_id')
    return { "message": "Logged out"}, 200

@app.post('/upload')
def upload_photo():
    if 'file' not in request.files:
        return "No file"
    
    file = request.files['file']
    json_data = request.form.get('json_data')
    print(json_data)

    if file.filename == '' or not json_data:
        return "Missing file or JSON data"
    
    try:
        data = json.loads(json_data)
        print(data)
        # Upload file to S3
        s3 = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY, region_name=AWS_REGION)
        bucket = s3.Bucket(app.config['FLASKS3_BUCKET_NAME'])
        bucket.upload_fileobj(file, file.filename)

        new_post = Post(
            caption=data.get('caption'),
            likes=0,
            photo_url=f"https://{app.config['FLASKS3_BUCKET_NAME']}.s3.{AWS_REGION}.amazonaws.com/{file.filename}",
            user_id=data.get('user_id'),
            park_id=data.get('park_id' )
        )

        db.session.add(new_post)
        db.session.commit()

        return new_post.to_dict(rules=['-user', '-park' ])
    
    except NoCredentialsError:
        return "Credentials not available"

    

# Post user
@app.post('/users')
def post_new_user():
    try:
        data = request.json

        hashed_password = bcrypt.generate_password_hash(data.get("password"))


        new_user = User(
            username=data.get("username"),
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            password=hashed_password,
            bio=data.get("bio")
        )

        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict(rules=['-password']), 201
    
    except Exception as e:
        return {"Error": str(e)}, 400

# Post posts
@app.post('/posts')
def post_photo():

    try:
        data = request.json

        new_post = Post(
            caption=data.get("caption"),
            user_id=data.get("user_id"),
            park_id=data.get("park_id")
        )

        db.session.add(new_post)
        db.session.commit()
        
        return new_post.to_dict(), 201

    except Exception as e:
        return {"Error": str(e)}, 400 

# Post comments
@app.post('/comments')
def post_comments():
    try:
        data = request.json

        new_comment = Comment(
            comment_text=data.get("comment_text"),
            user_id=data.get("user_id"),
            post_id=data.get("post_id")
        )

        db.session.add(new_comment)
        db.session.commit()
        
        return new_comment.to_dict(rules=['-post', '-user']), 201
    
    except Exception as e:
        return {"Error": str(e)}, 400 

# Get requests
@app.get("/users")
def get_users():
    users = User.query.all()
    return [u.to_dict(rules=['-password', 
        '-followers.bio',
        '-followers.first_name',
        '-followers.last_name',
        '-followers.username',
        '-posts.comments', 
        '-posts.description', 
        '-posts.id', 
        '-posts.name', 
        '-posts.park', 
        '-posts.user_id']) for u in users]

@app.get("/posts")
def get_posts():
    posts = Post.query.all()
    return [p.to_dict(rules=['-park', '-user']) for p in posts]

@app.get("/parks")
def get_parks():
    parks = Park.query.all()
    return [p.to_dict(rules=['-posts.comments', '-posts.user']) for p in parks]

# Get by ID
@app.get("/users/<int:id>")
def get_users_by_id(id):
    user = db.session.get(User, id)
    return user.to_dict(rules=['-password',
        '-followers.bio',
        '-followers.first_name',
        '-followers.last_name',
        '-followers.username',
        '-posts.park'])

@app.get("/parks/<int:id>")
def get_parks_by_id(id):
    park = db.session.get(Park, id)
    return park.to_dict(rules=['-posts.user', '-posts.comments'])

@app.get("/posts/<int:id>")
def get_posts_by_id(id):
    post = db.session.get(Post, id)
    return post.to_dict(rules=['-park', '-user'])

# Patch requests
@app.patch("/posts/<int:id>")
def patch_post_likes(id):
    data = request.json
    post = db.session.get(Post, id)

    for key in data:
        setattr(post, key, data[key])
    
    db.session.add(post)
    db.session.commit()

    return post.to_dict(rules=['-user']), 201 

if __name__ == '__main__':
    app.run(port=5555, debug=True)


