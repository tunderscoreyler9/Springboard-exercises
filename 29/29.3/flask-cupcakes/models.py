"""Models for Cupcake app."""
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

db = SQLAlchemy()

def connect_db(app):
    """
    Connects the provided Flask application to the database.

    This function establishes a connection to the database using the provided Flask application. It creates the necessary tables defined in the SQLAlchemy models and initializes the database extension. The app_context ensures that the database operations occur within the application context.
    """
    with app.app_context():
        db.app = app
        db.init_app(app)
        db.create_all()

