from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class FlaskTests(TestCase):
    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True
    
    def test_homepage(self):
        """Checking Session storage && HTML render"""
        
        with self.client:
            response = self.client.get('/')
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('games_played'))
            self.assertIsNone(session.get('games_played'))
            self.assertIn(b'Score:', response.data)
    
    def test_valid_word(self):
        """Test if word is valid by modifying the board in the session"""
        
        with self.client as client: 
            with client.session_transaction() as sess:
                sess['board'] = [['B', 'A', 'R', 'N', 'N'], 
                                 ['B', 'A', 'R', 'N', 'N'],
                                 ['B', 'A', 'R', 'N', 'N'],
                                 ['B', 'A', 'R', 'N', 'N'],
                                 ['B', 'A', 'R', 'N', 'N']]
        response = self.client.post('/check_guess', json={'guess': 'barn'})
        self.assertEqual(response.json['result'], 'ok')
    
    def test_invalid_word(self):
        """Test if word is not in the dictionary"""
        
        self.client.get('/')
        response = self.client.post('/check_guess', json={'guess': 'suub'})
        self.assertEqual(response.json['result'], 'not-a-word')
    
    def test_word_on_board(self):
        """Test if a word is not on the board"""
        
        self.client.get('/')
        response = self.client.post('/check_guess', json={'guess': 'femoral'})
        self.assertEqual(response.json['result'], 'not-on-board')

    

