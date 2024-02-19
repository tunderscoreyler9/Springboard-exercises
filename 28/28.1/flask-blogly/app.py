from flask import Flask, request, render_template, redirect, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, text, User, Post, Tag, PostTag

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
    
    @app.route('/')
    def root():
        """Show recent list of posts, most-recent first."""

        posts = Post.query.order_by(Post.created_at.desc()).limit(5).all()
        return render_template("posts/homepage.html", posts=posts)


    @app.errorhandler(404)
    def page_not_found(e):
        """Show 404 NOT FOUND page."""

        return render_template('404.html'), 404


    ##############################################################################
    # User route

    @app.route('/users')
    def users_index():
        """Show a page with info on all users"""

        users = User.query.order_by(User.first_name, User.last_name).all()
        return render_template('users/index.html', users=users)


    @app.route('/users/new', methods=["GET"])
    def users_new_form():
        """Show a form to create a new user"""

        return render_template('users/new.html')


    @app.route("/users/new", methods=["POST"])
    def users_new():
        """Handle form submission for creating a new user"""

        new_user = User(
            first_name=request.form['first_name'],
            last_name=request.form['last_name'],
            image_url=request.form['image_url'] or None)

        db.session.add(new_user)
        db.session.commit()
        flash(f"User {new_user.full_name} added.")

        return redirect("/users")


    @app.route('/users/<int:user_id>')
    def users_show(user_id):
        """Show a page with info on a specific user"""

        user = User.query.get_or_404(user_id)
        return render_template('users/show.html', user=user)


    @app.route('/users/<int:user_id>/edit')
    def users_edit(user_id):
        """Show a form to edit an existing user"""

        user = User.query.get_or_404(user_id)
        return render_template('users/edit.html', user=user)


    @app.route('/users/<int:user_id>/edit', methods=["POST"])
    def users_update(user_id):
        """Handle form submission for updating an existing user"""

        user = User.query.get_or_404(user_id)
        user.first_name = request.form['first_name']
        user.last_name = request.form['last_name']
        user.image_url = request.form['image_url']

        db.session.add(user)
        db.session.commit()
        flash(f"User {user.full_name} edited.")

        return redirect("/users")


    @app.route('/users/<int:user_id>/delete', methods=["POST"])
    def users_destroy(user_id):
        """Handle form submission for deleting an existing user"""

        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        flash(f"User {user.full_name} deleted.")

        return redirect("/users")


    ##############################################################################
    # Posts route


    @app.route('/users/<int:user_id>/posts/new')
    def posts_new_form(user_id):
        """Show a form to create a new post for a specific user"""

        user = User.query.get_or_404(user_id)
        return render_template('posts/new.html', user=user)


    @app.route('/users/<int:user_id>/posts/new', methods=["POST"])
    def posts_new(user_id):
        """Handle form submission for creating a new post for a specific user"""

        user = User.query.get_or_404(user_id)
        new_post = Post(title=request.form['title'],
                        content=request.form['content'],
                        user=user)

        db.session.add(new_post)
        db.session.commit()
        flash(f"Post '{new_post.title}' added.")

        return redirect(f"/users/{user_id}")


    @app.route('/posts/<int:post_id>')
    def posts_show(post_id):
        """Show a page with info on a specific post"""

        post = Post.query.get_or_404(post_id)
        return render_template('posts/show.html', post=post)


    @app.route('/posts/<int:post_id>/edit')
    def posts_edit(post_id):
        """Show a form to edit an existing post"""

        post = Post.query.get_or_404(post_id)
        return render_template('posts/edit.html', post=post)


    @app.route('/posts/<int:post_id>/edit', methods=["POST"])
    def posts_update(post_id):
        """Handle form submission for updating an existing post"""

        post = Post.query.get_or_404(post_id)
        post.title = request.form['title']
        post.content = request.form['content']

        db.session.add(post)
        db.session.commit()
        flash(f"Post '{post.title}' edited.")

        return redirect(f"/users/{post.user_id}")


    @app.route('/posts/<int:post_id>/delete', methods=["POST"])
    def posts_destroy(post_id):
        """Handle form submission for deleting an existing post"""

        post = Post.query.get_or_404(post_id)

        db.session.delete(post)
        db.session.commit()
        flash(f"Post '{post.title} deleted.")

        return redirect(f"/users/{post.user_id}")
    
    
    
    ##############################################################################
    # Tags route
    @app.route('/tags')
    def tags_index():
        """Show a page with all created tags and info"""
        tags = Tag.query.all()
        return render_template('tags/index.html', tags=tags)
    
    @app.route('/tags/<int:tag_id>')
    def tags_show(tag_id):
        """Renders a page to show info about a specific tag, based on its ID"""
        tag = Tag.query.get_or_404(tag_id)
        return render_template('tags/show.html', tag=tag)

    
    
    return app


if __name__ == '__main__':
    app = create_app('user_blog_db')
    connect_db(app)
    app.run(debug=True)