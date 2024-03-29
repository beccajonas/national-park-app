from flask import Flask, make_response, jsonify, request, session, render_template, json, abort
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
@app.get('/api/check_session')
def check_session():
    user = db.session.get(User, session.get('user_id'))
    print(f'check session: {user}')
    if user:
        return user.to_dict(rules=['-password']), 200
    else:
        return {"message": "No user logged in"}, 401
    
# Login
@app.post('/api/login')
def login():
    data = request.json

    user = User.query.filter(User.username == data.get('username')).first()

    if user and bcrypt.check_password_hash(user.password, data.get('password')):
        session["user_id"] = user.id
        print(f'success {user.to_dict()}')
        return user.to_dict(rules=['-password']), 200
    else:
        return { "error": "Invalid username or password" }, 401
    
# Logout
@app.delete('/api/logout')
def logout():
    session.pop('user_id', None) 
    return { "message": "Logged out"}, 200

# Post photo + post
@app.post('/api/upload')
def upload_photo():
    if 'file' not in request.files:
        abort(400, "Bad Request: No file")
    
    file = request.files['file']
    json_data = request.form.get('json_data')
    print(json_data)

    if file.filename == '' or not json_data:
        abort(400, "Bad Request: Missing file or JSON data")
    
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
        abort(500, "Internal Server Error: Credentials not available")

    
# Post user
@app.post('/api/users')
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

# Post comments
@app.post('/api/comments')
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
    
@app.get("/api/comments/post/<int:post_id>")
def get_comments_by_post_id(post_id):
    comments = Comment.query.filter_by(post_id=post_id).all()
    if comments:
        # Serialize the comments using the rules defined in your model
        return jsonify([comment.to_dict() for comment in comments]), 200
    else:
        return jsonify({"message": "No comments found for this post"}), 404

# Get users
@app.get("/api/users")
def get_users():
    users = User.query.all()
    return [u.to_dict(rules=['-password', 
        '-followers.bio',
        '-followers.first_name',
        '-followers.last_name',
        '-posts.comments', 
        '-posts.description', 
        '-posts.id', 
        '-posts.name', 
        '-posts.park', 
        '-posts.user_id']) for u in users]

# Get posts
@app.get("/api/posts")
def get_posts():
    posts = Post.query.all()
    return [p.to_dict(rules=['-park', '-user']) for p in posts]

# Get parks
@app.get("/api/parks")
def get_parks():
    parks = Park.query.all()
    return [p.to_dict(rules=['-posts.comments', '-posts.user']) for p in parks]

# Get parks posts by ID
@app.get("/api/posts/park/<int:park_id>")
def get_posts_by_park_id(park_id):
    posts = Post.query.filter_by(park_id=park_id).all()
    if not posts:
        return jsonify({"message": "No posts found for this park"}), 404
    return jsonify([post.to_dict() for post in posts]), 200

# Get user by ID
@app.get("/api/users/<int:id>")
def get_users_by_id(id):
    user = db.session.get(User, id)
    return user.to_dict(rules=['-password',
        '-followers.bio',
        '-followers.first_name',
        '-followers.last_name',
        '-followers.username',
        '-posts.park'])

# Get park by ID
@app.get("/api/parks/<int:id>")
def get_parks_by_id(id):
    park = db.session.get(Park, id)
    return park.to_dict(rules=['-posts.user', '-posts.comments'])

# Get posts by ID
@app.get("/api/posts/<int:id>")
def get_posts_by_id(id):
    post = db.session.get(Post, id)
    return post.to_dict(rules=['-user'])

# Patch a post
@app.patch("/api/posts/<int:id>")
def patch_post_likes(id):
    data = request.json
    post = db.session.get(Post, id)

    for key in data:
        setattr(post, key, data[key])
    
    db.session.add(post)
    db.session.commit()

    return post.to_dict(rules=['-user']), 201 

# Patch a post
@app.patch("/api/users/<int:id>")
def patch_user(id):
    data = request.json
    user = db.session.get(User, id)

    for key in data:
        setattr(user, key, data[key])
    
    db.session.add(user)
    db.session.commit()

    return user.to_dict(rules=['-password',
        '-followers.bio',
        '-followers.first_name',
        '-followers.last_name',
        '-followers.username',
        '-posts.park']), 201 

# Delete post
@app.delete("/api/posts/<int:id>")
def delete_post(id):
    post = db.session.get(Post, id)
    if not post:
        return {"error": "post not found"}, 404
    db.session.delete(post)
    db.session.commit()
    return {}

# Delete comment
@app.delete("/api/comments/<int:id>")
def delete_comment_by_id(id):
    comment = db.session.get(Comment, id)
    if not comment:
        {"error": "comment not found"}, 404
    db.session.delete(comment)
    db.session.commit()
    return {}


if __name__ == '__main__':
    app.run(port=5555, debug=True)