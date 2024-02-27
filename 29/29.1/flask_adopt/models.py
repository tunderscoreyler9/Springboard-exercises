"""Models for adoption app"""
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

DEFAULT_IMAGE = "https://i0.wp.com/sanantoniopetvet.com/wp-content/uploads/2021/07/Rod-Pet-logo-only-paint.jpeg?fit=1038%2C899&ssl=1"
db = SQLAlchemy()

def connect_db(app):
    with app.app_context():
        db.app = app
        db.init_app(app)
        db.create_all()

class Pet(db.Model):
    """Adoptable pet."""
    __tablename__ = "pets"
    
    def __repr__(self):
        pet = self
        return f"<Pet id= {pet.id} name= {pet.name} species= {pet.species}>"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    species = db.Column(db.Text, nullable=False)
    photo_url = db.Column(db.Text)
    age = db.Column(db.Integer)
    notes = db.Column(db.Text)
    available = db.Column(db.Boolean, nullable=False, default=True)
    
    def image_url(self):
        """Return pet's image, or a default image for pets w/ no photo"""

        return self.photo_url or DEFAULT_IMAGE
    
    # def connect_db(app):
    #     """Connect this database to provided Flask app. You should call this in your Flask app."""

    #     db.app = app
    #     db.init_app(app)