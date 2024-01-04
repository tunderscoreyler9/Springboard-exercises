from boggle import Boggle
from flask import Flask, request, render_template, redirect, flash, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension
from random import randint, choice, sample

app = Flask(__name__, static_url_path='/static')

app.config['SECRET_KEY'] = "oh-so-secret"
app.debug = True
toolbar = DebugToolbarExtension(app)
boggle_game = Boggle()

@app.route('/')
def index():
    boggle_game = Boggle()
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('index.html', board=board)

@app.route('/check_guess', methods=['POST'])
def check_guess():
    # guess = request.form.get('guess')
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




if __name__ == '__main__':
    app.run(debug=True)