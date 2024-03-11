"""Models for Cupcake app."""
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

DEFAULT_IMAGE = "https://tinyurl.com/demo-cupcake"
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


class Cupcake(db.Model):
    """Cupcake model"""
    
    __tablename__ = "cupcakes"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.Text, nullable=False)
    size = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    image = db.Column(db.Text)

    def serialize(self):
        """Returns a python dict representation of cupcake which we can turn into JSON"""
        return {
            'id': self.id,
            'flavor': self.flavor,
            'size': self.size,
            'rating': self.rating,
            'image': self.image
        }
    
    def image_url(self):
        """Return a cupcake's image, or a default image for cupcakes w/ no photo"""
        return self.image or DEFAULT_IMAGE

    def __repr__(self):
        return f"<Cupcake {self.id} flavor{self.flavor} size{self.size} rating{self.rating} image{self.image}>"