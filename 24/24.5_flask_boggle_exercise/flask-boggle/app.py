from flask import Flask, request, render_template, jsonify, session
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension

class BoggleApp:
    def __init__(self):
        self.app = Flask(__name__, static_url_path='/static')
        self.app.config['SECRET_KEY'] = 'your_secret_key_here'
        self.boggle_game = Boggle()
        self.toolbar = DebugToolbarExtension(self.app)

        self.app.add_url_rule('/', 'index', self.index, methods=['GET'])
        self.app.add_url_rule('/check_guess', 'check_guess', self.check_guess, methods=['POST'])
        self.app.add_url_rule('/update_statistics', 'update_statistics', self.update_statistics, methods=['POST'])
        self.app.add_url_rule('/get_statistics', 'get_statistics', self.get_statistics, methods=['GET'])

    def index(self):
        board = self.boggle_game.make_board()
        session['board'] = board
        return render_template('index.html', highest_score=session.get('highest_score', 0), games_played=session.get('games_played', 0), board=board)

    def check_guess(self):
        guess = request.json.get('guess')

        if guess is None:
            return jsonify({'result': 'not-word'})
        
        result = self.boggle_game.check_valid_word(session['board'], guess)
        
        if result == 'ok':
            response = {'result': 'ok'}
        elif result == 'not-on-board':
            response = {'result': 'not-on-board'}
        else:
            response = {'result': 'not-a-word'}
        
        return jsonify(response)

    def update_statistics(self):
        score = request.json.get('score')
        if score is not None:
            session['games_played'] = session.get('games_played', 0) + 1
            session['highest_score'] = max(score, session.get('highest_score', 0))
            return jsonify({'message': 'Statistics updated successfully.'})
        return jsonify({'message': 'Invalid request.'}), 400

    def get_statistics(self):
        """Get game statistics (highest score and games played)."""
        return jsonify({
            'highestScore': session.get('highest_score', 0),
            'gamesPlayed': session.get('games_played', 0)
        })

boggle_app = BoggleApp()
app = boggle_app.app

if __name__ == '__main__':
    app.run(debug=True)
