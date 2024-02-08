import sys
sys.path.append('/Users/tylerskidmore/springboard-code/Springboard-code/28/28.1/flask-blogly')

from unittest import TestCase
from app import create_app
from models import db, User, connect_db

app = create_app("sqla_user_test", testing=True)
connect_db(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///sqla_user_test'
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
profile_pic = "https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"


class UserViewsTestCase(TestCase):
    """Tests for views of users"""

    def setUp(self):
        """Add sample users to the database"""
        User.query.delete()

        users_data = [
            {"first_name": "John", "last_name": "Doe", "image_url": profile_pic},
            {"first_name": "Jane", "last_name": "Doe", "image_url": None},
            {"first_name": "Johnny", "last_name": "Appleseed"},
            {"first_name": "Janey", "last_name": "Appleseed", "image_url": profile_pic},
        ]

        self.users = []
        for user_data in users_data:
            user = User(**user_data)
            db.session.add(user)
            self.users.append(user)

        db.session.commit()

    def tearDown(self):
        """Rollback the current session to clean up transactions"""
        db.session.rollback()

    def test_show_users(self):
        """Test that all users show up"""
        with app.test_client() as client:
            resp = client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            for user in self.users:
                self.assertIn(user.first_name, html)
                self.assertIn(user.last_name, html)

    def test_show_user_details(self):
        """Test that the user details page displays a user's information"""
        with app.test_client() as client:
            resp = client.get(f"/{self.users[0].id}")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('John', html)
            self.assertIn(self.users[0].last_name, html)
            self.assertIn(self.users[0].image_url, html)
    
    def test_user_without_image_url(self):
        """Test crating a user without an image"""
        with app.test_client() as client:
            resp = client.get(f"/{self.users[1].id}")
            html = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn('Jane Doe', html)
            self.assertIn('Default Image', html)
    
    def test_non_existent_user_details(self):
        """Test creating a user without an image"""
        with app.test_client() as client:
            non_existent_user_id = 999
            
            resp = client.get(f"/{non_existent_user_id}")
            html = resp.get_data(as_text=True)
            
            print(html)
            self.assertEqual(resp.status_code, 404)
            self.assertIn('Not Found', html)
            
    def test_edit_user_details(self):
        """Test updating a current user's data in the database"""
        with app.test_client() as client:
            updated_first_name = 'UpdatedJohn'
            updated_last_name = 'UpdatedDoe'
            updated_image_url = 'https://wallpapers.com/images/hd/funny-profile-picture-1l2l3tmmbobjqd53.jpg'
            
            resp = client.post(f'/{self.users[0].id}/edit', data={
                'first_name': updated_first_name,
                'last_name': updated_last_name,
                'image_url': updated_image_url
            })
            
            self.assertEqual(resp.status_code, 302)
            edited_user = User.query.get(self.users[0].id)
            
            self.assertEqual(edited_user.first_name, updated_first_name)
            self.assertEqual(edited_user.last_name, updated_last_name)
            self.assertEqual(edited_user.image_url, updated_image_url)
    
    def test_delete_suer(self):
        """Test deleting a user"""
        with app.test_client() as client:
            resp = client.post(f"{self.users[3].id}/delete")
            
            self.assertEqual(resp.status_code, 302)
            deleted_user = User.query.get(self.users[3].id)
            self.assertIsNone(deleted_user)