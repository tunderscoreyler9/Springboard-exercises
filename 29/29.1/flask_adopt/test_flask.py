from unittest import TestCase
from app import create_app, db
from models import db, connect_db, Pet, DEFAULT_IMAGE
app = create_app("adopt_sqla_test", testing=True)
connect_db(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///adopt_sqla_test'
app.config['SQLALCHEMY_ECHO'] = False
app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
app.config['WTF_CSRF_ENABLED'] = False

class AdoptAppTestCase(TestCase):
    """Tests for adding, showing, editing, and deleting pets"""
    
    def setUp(self):
        """Set up test data and resources for each test case."""
        Pet.query.delete()
        
        sample_pet = Pet(name="Toto", species="dog", photo_url="https://abc3340.com/resources/media/742401c2-6bb3-4090-8a80-05cb02b3c61a-large3x4_2f5f7ac71833b101c8fedeed67269158large.jpeg?1630002477925", age="1", notes="is a very good boy!", available=True)
        db.session.add(sample_pet)
        db.session.commit()
        
        self.sample_pet_id = sample_pet.id
        self.sample_pet = sample_pet
    
    def tearDown(self):
        """Clean up any fouled transaction"""
        db.session.rollback()
        db.drop_all()
        db.create_all()
    
    
    def test_list_pets(self):
        with app.test_client() as client:
            resp = client.get("/")
            html = resp.get_data(as_text=True)
            pet = Pet.query.first()

            self.assertEqual(resp.status_code, 200)
            self.assertIn('Our Pets', html)
            self.assertIn(pet.name, html)
            self.assertNotIn(pet.notes, html)
    
    def test_add_pet(self):
        """Test to """
        with app.test_client() as client:
            pet_to_add = {"name": "TestPet2", "species": "Cat", "age": 390, "notes": "this pet is so old", "available": True}
            
            resp = client.post("/add", data=pet_to_add, follow_redirects=True)
            html = resp.get_data(as_text=True)
            print(html)
            
            # pet = Pet.query.filter(Pet.name == "TestPet2").first()
            # print(pet)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn("TestPet2", html)
            self.assertIn("Cat", html)
            # self.assertEqual(pet.age, 390)
            # if pet is not None:
            #     self.assertEqual(pet.age, 390)
            # else:
            #     self.fail(f"No pet found with name 'TestPet2'")
            self.assertIn("Add a Pet", html)
            self.assertIn("390", html)
    
    def test_edit_pet(self):
        """Test editing an existing pet."""
        with app.test_client() as client:
            # Define data for editing the pet
            # edited_data = {"notes": "Updated notes", "available": False}
            edited_data = {"photo_url": "https://tinyjpg.com/images/social/website.jpg", "notes": "this is an update", "available": False}

            # Make a POST request to edit the pet
            resp = client.post(f"/{self.sample_pet_id}", data=edited_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            print(resp.status_code)
            print(html)


            # Retrieve the pet from the database after editing
            # edited_pet = Pet.query.get(self.sample_pet_id)
            edited_pet = Pet.query.get(self.sample_pet_id)
            print("573y8r3y483ur38ur399j !1!!1i11  !! !! !! !!")
            print(edited_pet)
            print(edited_data)
            print(edited_pet.name)

            # Assertions
            self.assertEqual(resp.status_code, 200)
            # self.assertIn("Updated notes", html)
            self.assertFalse(edited_pet.available)
