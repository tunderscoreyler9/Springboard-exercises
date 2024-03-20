# services.py

from models import db, User, Feedback

class UserService:
    @staticmethod
    def register_user(username, password, first_name, last_name, email):
        """Register a user."""
        user = User.register(username, password, first_name, last_name, email)
        db.session.commit()
        return user

    @staticmethod
    def authenticate_user(username, password):
        """Authenticate a user."""
        return User.authenticate(username, password)

    @staticmethod
    def get_user(username):
        """Get a user by username."""
        return User.query.get(username)

    @staticmethod
    def delete_user(username):
        """Delete a user by username."""
        user = User.query.get(username)
        if user:
            db.session.delete(user)
            db.session.commit()

class FeedbackService:
    @staticmethod
    def create_feedback(title, content, username):
        """Create a new feedback."""
        feedback = Feedback(title=title, content=content, username=username)
        db.session.add(feedback)
        db.session.commit()

    @staticmethod
    def get_feedback(feedback_id):
        """Get feedback by ID."""
        return Feedback.query.get(feedback_id)

    @staticmethod
    def update_feedback(feedback_id, title, content):
        """Update existing feedback."""
        feedback = Feedback.query.get(feedback_id)
        if feedback:
            feedback.title = title
            feedback.content = content
            db.session.commit()

    @staticmethod
    def delete_feedback(feedback_id):
        """Delete feedback by ID."""
        feedback = Feedback.query.get(feedback_id)
        if feedback:
            db.session.delete(feedback)
            db.session.commit()