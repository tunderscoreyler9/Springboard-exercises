from flask import Flask, request, render_template, redirect, flash, session
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, text, User

def create_app(user_blog_db, testing=True):
    app = Flask(__name__)
    app.testing = testing
    app.app_context().push()
    app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql:///{user_blog_db}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True
    app.config['SECRET_KEY'] = "dont_tell_the_code"
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
    debug = DebugToolbarExtension(app)
    # db.init_app(app)
    
    @app.route('/', methods=["GET"])
    def show_users():
        """Lists all users and shows Add User form"""
        users = User.query.all()
        return render_template('users.html', users=users)
    
    
    return app


if __name__ == '__main__':
    app = create_app('user_blog_db')
    connect_db(app)
    app.run(debug=True)
