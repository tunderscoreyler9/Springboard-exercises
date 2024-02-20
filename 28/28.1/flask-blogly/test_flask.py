from unittest import TestCase
from app import create_app, db
from models import db, connect_db, User, Post, PostTag, Tag, DEFAULT_IMAGE_URL
app = create_app("sqla_blogly_test", testing=True)
connect_db(app)

# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///sqla_blogly_test'
app.config['SQLALCHEMY_ECHO'] = False
app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class BloglyAppTestCase(TestCase):
    """Tests for Blogly posts, users, and tags."""
    
    def setUp(self):
        """Set up test data and resources for each test case."""
        User.query.delete()

        sample_user = User(first_name="John", last_name="Doe", image_url=DEFAULT_IMAGE_URL)
        db.session.add(sample_user)
        db.session.commit()
        self.sample_user_id = sample_user.id
        self.sample_user = sample_user
        
        sample_post = Post(title='Sample Post', content="This is a test post.", user_id=sample_user.id)
        db.session.add(sample_post)
        db.session.commit()
        
        tag1 = Tag(name="Tag1")
        tag2 = Tag(name="Tag2")
        db.session.add_all([tag1, tag2])
        db.session.commit()
        
        post_tag1 = PostTag(post_id=sample_post.id, tag_id=tag1.id)
        post_tag2 = PostTag(post_id=sample_post.id, tag_id=tag2.id)
        db.session.add_all([post_tag1, post_tag2])
        db.session.commit()

    def tearDown(self):
        """Clean up any fouled transaction."""
        db.session.rollback()
        db.drop_all()
        db.create_all()
    
    
    def test_homepage(self):
        with app.test_client() as client:
            resp = client.get("/")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('Recent Posts', html)
    
    def test_users_index(self):
        """
        Test if the users index page is accessible and contains the expected content.

        Expected Behavior:
        - Status code should be 200 (OK).
        - Response body should contain the text "Users".
        - Response body should contain the full name of at least one user.
        """
        with app.test_client() as client:
            resp = client.get("/users")
            html = resp.get_data(as_text=True)
            user = User.query.first()
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn('Users', html)
            self.assertIn(user.full_name, html)
    
    def test_users_show(self):
        """
        Test if the user show page is accessible and contains the expected content.

        Expected Behavior:
        - Status code should be 200 (OK).
        - Response body should contain the full name of the user.
        - Response body should contain the text "Posts".
        - Response body should contain the text "Edit".
        """
        with app.test_client() as client:
            resp = client.get("/users/1")
            html = resp.get_data(as_text=True)
            user = User.query.first()
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn(user.full_name, html)
            self.assertIn('Posts', html)
            self.assertIn('Edit', html)
    
    def test_posts_show(self):
        """
        Test if the post show page is accessible and contains the expected content.

        Expected Behavior:
        - Status code should be 200 (OK).
        - Response body should contain the title and content of the post.
        - Response body should contain the author's full name.
        """
        with app.test_client() as client:
            resp = client.get("/posts/1")
            html =  resp.get_data(as_text=True)
            post = Post.query.first()
            user = User.query.first()
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn(post.title, html)
            self.assertIn(post.content, html)
            self.assertIn(f"By {user.full_name}", html)
    
    def test_tags_show(self):
        """
        Test if the tag show page is accessible and contains the expected content.

        Expected Behavior:
        - Status code should be 200 (OK).
        - Response body should contain the name of the tag.
        - Response body should contain the title of at least one post associated with the tag.
        - Response body should contain the text "Delete".
        """
        with app.test_client() as client:
            resp = client.get("/tags/1")
            html = resp.get_data(as_text=True)
            tag = Tag.query.first()
            post = Post.query.first()
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn(tag.name, html)
            self.assertIn(post.title, html)
            self.assertIn('Delete', html)
    
    def test_delete_user(self):
        """Test if a user can be successfully deleted."""
        with app.test_client() as client:
            user = User(first_name="Test", last_name="User", image_url=DEFAULT_IMAGE_URL)
            db.session.add(user)
            db.session.commit()

            user_id = user.id
            
            resp_before_deletion = client.get(f"/users/{user_id}")
            self.assertEqual(resp_before_deletion.status_code, 200)
            
            resp_delete = client.post(f"/users/{user_id}/delete", follow_redirects=True)
            self.assertEqual(resp_delete.status_code, 200)
            
            resp_after_deletion = client.get(f"/users/{user_id}")
            self.assertEqual(resp_after_deletion.status_code, 404)
            self.assertNotIn(user.full_name, resp_after_deletion.get_data(as_text=True))
    
    def test_post_tag_relationship(self):
        """
        Test the relationship between Post, Tag, and PostTag models.

        Expected Behavior:
        - Create a sample user, post, and tag.
        - Associate the tag with the post through the PostTag model.
        - Verify that the association is correctly reflected in the database.
        """
        with app.test_client() as client:
            user = User.query.first()
            post = Post.query.first()
            tag = Tag.query.first()
            post_tag = PostTag.query.first()
            
            post_tags = post.tags
            tag_posts = tag.posts
            
            self.assertIn(tag, post_tags)
            self.assertIn(post, tag_posts)
            
