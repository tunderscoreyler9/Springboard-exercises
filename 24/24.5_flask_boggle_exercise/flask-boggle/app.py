from flask_debugtoolbar import DebugToolbarExtension

from flask import Flask, request, render_template, jsonify, session
from boggle import Boggle

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = 'your_secret_key_here'
boggle_game = Boggle()

@app.route('/')
def index():
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('index.html', highest_score=session.get('highest_score', 0), games_played=session.get('games_played', 0), board=board)

@app.route('/check_guess', methods=['POST'])
def check_guess():
    guess = request.json.get('guess')

    if guess is None:
        return jsonify({'result': 'not-word'})
    
    result = boggle_game.check_valid_word(session['board'], guess)
    
    if result == 'ok':
        response = {'result': 'ok'}
    elif result == 'not-on-board':
        response = {'result': 'not-on-board'}
    else:
        response = {'result': 'not-a-word'}
    
    return jsonify(response)

@app.route('/update_statistics', methods=['POST'])
def update_statistics():
    score = request.json.get('score')
    if score is not None:
        session['games_played'] = session.get('games_played', 0) + 1
        session['highest_score'] = max(score, session.get('highest_score', 0))
        return jsonify({'message': 'Statistics updated successfully.'})
    return jsonify({'message': 'Invalid request.'}), 400

@app.route('/get_statistics', methods=['GET'])
def get_statistics():
    return jsonify({'highestScore': session.get('highest_score', 0), 'gamesPlayed': session.get('games_played', 0)})

if __name__ == '__main__':
    app.run(debug=True)