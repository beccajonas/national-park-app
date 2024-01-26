import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import string, datetime
from dotenv import load_dotenv
import requests

load_dotenv()

# api_key = os.getenv("API_KEY")
# endpoint = 'https://developer.nps.gov/api/v1/parks'

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

follower_relationship = db.Table(
    'follower_relationship', metadata,
    db.Column('follower_id', db.Integer, db.ForeignKey('user_table.id'), primary_key=True),
    db.Column('followed_id', db.Integer, db.ForeignKey('user_table.id'), primary_key=True),
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'user_table'

    serialize_rules = ['-comments', '-followers.posts', '-followers.followers','-followers.password', '-posts.comments', '-posts.user']

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    password = db.Column(db.String, nullable=False)
    bio = db.Column(db.String)

    posts = db.relationship('Post', back_populates='user')
    comments = db.relationship('Comment', back_populates='user')

    followers = db.relationship('User', 
                                secondary = follower_relationship, 
                                primaryjoin = (follower_relationship.c.followed_id == id),
                                secondaryjoin = (follower_relationship.c.follower_id == id),
                                )

    @validates("password")
    def validate_name(self, key, password):
        if not password:
            raise ValueError("Password cannot be none.")
        return password

class Post(db.Model, SerializerMixin):
    __tablename__ = 'post_table'

    serialize_rules=['-user.posts','-park.posts', '-comments.post', '-comments.user']

    id = db.Column(db.Integer, primary_key=True)
    caption = db.Column(db.String(255), nullable=False)
    likes = db.Column(db.Integer, default=0)
    photo_url = db.Column(db.Integer, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user_table.id'), nullable=False)
    park_id = db.Column(db.Integer, db.ForeignKey('park_table.id'), nullable=False)

    user = db.relationship('User', back_populates='posts')
    park = db.relationship('Park', back_populates='posts')

    comments = db.relationship('Comment', back_populates='post')

class Park(db.Model, SerializerMixin):
    __tablename__ = 'park_table'

    serialize_rules=['-posts.park']

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))

    posts = db.relationship('Post', back_populates='park')

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comment_table'

    serialize_rules=['-user.comments', '-post.comments', '-user.posts']

    id = db.Column(db.Integer, primary_key=True)
    comment_text = db.Column(db.String(255), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user_table.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post_table.id'))

    user = db.relationship('User', back_populates='comments')
    post = db.relationship('Post', back_populates='comments')


