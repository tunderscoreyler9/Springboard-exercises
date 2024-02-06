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
    
    @app.route('/', methods=["POST"])
    def create_user():
        first_name = request.form["first-name"].capitalize()
        last_name = request.form["last-name"].capitalize()
        image_url = request.form["image-url"]
        
        new_user = User(first_name=first_name, 
                        last_name=last_name, 
                        image_url=image_url)
        db.session.add(new_user)
        db.session.commit()
        return redirect("/")
    
    @app.route('/<int:user_id>')
    def show_user(user_id):
        """Shows details about a single user"""
        user = User.query.get_or_404(user_id)
        return render_template('details.html', user=user)
    
    
    return app


if __name__ == '__main__':
    app = create_app('user_blog_db')
    connect_db(app)
    app.run(debug=True)