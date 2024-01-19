import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import string, datetime
from dotenv import load_dotenvgit
import requests

load_dotenv()

api_key = os.getenv("API_KEY")
endpoint = 'https://developer.nps.gov/api/v1/parks'

metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)
db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    __tablename__ = 'user_table'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    password = db.Column(db.String, nullable=False)
    bio = db.Column(db.String)
    # profile_pic = #!

    # Serialize rules
    serialize_rules = ['-posts.user', '-comments.user', '-follower_list.follower', '-following_list.following']

    #Relationships
    posts = db.relationship('Post', back_populates='user')
    comments = db.relationship('Comment', back_populates='user')

    follower_list = db.relationship('Follow', back_populates='follower', foreign_keys='Follow.follower_id')
    following_list = db.relationship('Follow', back_populates='following', foreign_keys='Follow.following_id')

    # Association proxy
    parks = association_proxy('posts','park')


class Post(db.Model, SerializerMixin):
    __tablename__ = 'post_table'

    id = db.Column(db.Integer, primary_key=True)
    caption = db.Column(db.String(255), nullable=False)
    likes = db.Column(db.Integer, default=0)
    # image = #!

    # Serialize rules
    serialize_rules = ['-user.posts', '-park.posts', '-comment.post']

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('user_table.id'))
    park_id = db.Column(db.Integer, db.ForeignKey('park_table.id'))

    # Relationships
    user = db.relationship('User', back_populates='posts')
    park = db.relationship('Park', back_populates='posts')
    comments = db.relationship('Comment', back_populates='post')

class Park(db.Model, SerializerMixin):
    __tablename__ = 'park_table'

    # Serialize rules
    serialize_rules = ['-posts.park']

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))

    # Relationships
    posts = db.relationship('Post', back_populates='park')

    # Association proxy
    users = association_proxy('posts', 'user')

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comment_table'

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(255), nullable=False)

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('user_table.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post_table.id'), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='comments')
    post = db.relationship('Post', back_populates='comments')

class Follow(db.Model, SerializerMixin):
    __tablename__ = 'follower_table'

    id = db.Column(db.Integer, primary_key=True)

    # Foreign keys
    follower_id = db.Column(db.Integer, db.ForeignKey('user_table.id'), nullable=False)
    following_id = db.Column(db.Integer, db.ForeignKey('user_table.id'), nullable=False)

    # Relationships
    follower = db.relationship('User', back_populates='follower_list', foreign_keys=[follower_id])
    following = db.relationship('User', back_populates='following_list', foreign_keys=[following_id])