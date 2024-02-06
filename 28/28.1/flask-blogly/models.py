from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
db = SQLAlchemy()

def connect_db(app):
    with app.app_context():
        db.app = app
        db.init_app(app)
        db.create_all()

class User(db.Model):
    __tablename__ = 'users'
    def __repr__(self):
        user = self
        return f"<User id={user.id} first_name={user.first_name} last_name={user.last_name} image_url={user.image_url}>"
    
    id = db.Column(db.Integer,
                   primary_key= True,
                   autoincrement= True)
    
    first_name = db.Column(db.String(15),
                           nullable= False,
                           unique= False)
    
    last_name = db.Column(db.String(15),
                           nullable= False,
                           unique= False)
    
    image_url = db.Column(db.String(2083), 
                          nullable=True, 
                          unique=False)