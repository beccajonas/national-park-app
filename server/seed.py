from app import app
from models import db, User, Post, Park, Comment
import json
from flask_bcrypt import Bcrypt

if __name__ == "__main__":
    with app.app_context():
        bcrypt = Bcrypt(app)
        data = {}
        with open("db.json") as f:
            data = json.load(f)
        print("clearing data...")
        User.query.delete()
        Post.query.delete()
        Park.query.delete()
        Comment.query.delete()

        # Seed data
        print("seeding data...")
        user_data_list = []
        for user_data in data["user_table"]:
            u = User(
                username=user_data.get("username"),
                first_name=user_data.get('first_name'),
                last_name=user_data.get('last_name'),
                password=bcrypt.generate_password_hash(user_data.get('password')),
                bio=user_data.get('bio')
            )
            user_data_list.append(u)
        db.session.add_all(user_data_list)

        for park_data in data["park_table"]:
            db.session.add(Park(**park_data))

        for post_data in data["post_table"]:
            db.session.add(Post(**post_data))

        for comment_data in data["comment_table"]:
            db.session.add(Comment(**comment_data))

        db.session.commit()
        print("seeding complete!")

