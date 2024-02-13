from app import create_app
from models import db, User, Post, connect_db, db

app = create_app('user_blog_db', testing=True)

with app.app_context():
    db.drop_all()
    db.create_all()

    user1 = User(first_name='John', last_name='Doe')
    user2 = User(first_name='Jane', last_name='Doe')

    db.session.add_all([user1, user2])
    db.session.commit()
