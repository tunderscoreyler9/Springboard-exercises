"""Feedback Flask app."""

from flask import Flask, render_template, redirect, session, flash, url_for
from flask_debugtoolbar import DebugToolbarExtension
from werkzeug.exceptions import Unauthorized

from models import connect_db, db, User, Feedback
from forms import RegisterForm, LoginForm, FeedbackForm, DeleteForm
from services import UserService, FeedbackService

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql:///my-flask-feedback"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "shhhhh"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.app_context().push()

toolbar = DebugToolbarExtension(app)

connect_db(app)


@app.route("/")
def homepage():
    """Homepage of site; redirect to register."""

    return redirect("/register")


@app.route('/register', methods=['GET', 'POST'])
def register():
    """Register a user."""
    if "username" in session:
        return redirect(url_for("show_user", username=session["username"]))

    form = RegisterForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        first_name = form.first_name.data
        last_name = form.last_name.data
        email = form.email.data

        try:
            UserService.register_user(username, password, first_name, last_name, email)
            flash('Registration successful. Please log in.', "success")
            return redirect(url_for("login"))
        except ValueError as e:
            flash(str(e), "danger")

    return render_template("users/register.html", form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Log in a user."""
    if "username" in session:
        return redirect(url_for("show_user", username=session["username"]))

    form = LoginForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = UserService.authenticate_user(username, password)
        if user:
            session['username'] = user.username
            flash(f"Welcome back, {user.username}!", "success")
            return redirect(url_for("show_user", username=user.username))
        else:
            flash("Invalid username or password.", "danger")

    return render_template("users/login.html", form=form)



@app.route("/logout")
def logout():
    """Logout route."""
    if "username" not in session:
        return redirect("/login")
    else:
        session.pop("username")


@app.route("/users/<username>")
def show_user(username):
    """Example page for logged-in-users."""
    if "username" not in session or username != session['username']:
        raise Unauthorized()

    user = UserService.get_user(username)
    form = DeleteForm()

    return render_template("users/show.html", user=user, form=form)


@app.route("/users/<username>/delete", methods=["POST"])
def remove_user(username):
    """Remove user and redirect to login."""
    if "username" not in session or username != session['username']:
        raise Unauthorized()

    UserService.delete_user(username)
    session.pop("username")

    return redirect(url_for("login"))


@app.route("/users/<username>/feedback/new", methods=["GET", "POST"])
def new_feedback(username):
    """Show add-feedback form and process it."""
    if "username" not in session or username != session['username']:
        raise Unauthorized()

    form = FeedbackForm()

    if form.validate_on_submit():
        title = form.title.data
        content = form.content.data

        FeedbackService.create_feedback(title, content, username)

        return redirect(url_for("show_user", username=username))

    return render_template("feedback/new.html", form=form)


@app.route("/feedback/<int:feedback_id>/update", methods=["GET", "POST"])
def update_feedback(feedback_id):
    """Show update-feedback form and process it."""
    feedback = FeedbackService.get_feedback(feedback_id)

    if "username" not in session or feedback.username != session['username']:
        raise Unauthorized()

    form = FeedbackForm(obj=feedback)

    if form.validate_on_submit():
        FeedbackService.update_feedback(feedback_id, form.title.data, form.content.data)

        return redirect(url_for("show_user", username=feedback.username))

    return render_template("/feedback/edit.html", form=form, feedback=feedback)


@app.route("/feedback/<int:feedback_id>/delete", methods=["POST"])
def delete_feedback(feedback_id):
    """Delete feedback."""
    feedback = FeedbackService.get_feedback(feedback_id)

    if "username" not in session or feedback.username != session['username']:
        raise Unauthorized()

    FeedbackService.delete_feedback(feedback_id)

    return redirect(url_for("show_user", username=feedback.username))
