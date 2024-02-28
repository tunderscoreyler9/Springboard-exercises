"""Seed file to make sample data for db"""
from app import create_app
from models import Pet, text, db, connect_db

app = create_app('adopt_db', testing=True)

with app.app_context():
    db.init_app(app)
    db.drop_all()
    db.create_all()

    pet1 = Pet(name="Rufous hornero", species="bird", photo_url="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Rufous_Hornero_%28Furnarius_rufus%29.jpg/2558px-Rufous_Hornero_%28Furnarius_rufus%29.jpg", age="3", notes="It occurs in eastern South America and is the national bird of Argentina", available=True)
    pet2 = Pet(name="Rufus", species="artificially intelligent being", photo_url="https://media.shellypalmer.com/wp-content/images/2024/02/amazon-rufus.jpg", age="1", notes="Amazon shopping assistant", available=False)
    pet3 = Pet(name="Steve", species="dog", photo_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThaIKkefRrvwx9pNu9GiRDfQuWW54N-i8CxA&usqp=CAU", age="6", notes="Is a good boy", available=True)

    db.session.add_all([pet1, pet2, pet3])
    db.session.commit()