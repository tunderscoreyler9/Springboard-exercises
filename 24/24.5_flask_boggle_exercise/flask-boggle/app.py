from boggle import Boggle
from flask import Flask, request, render_template, redirect, flash, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension
from random import randint, choice, sample

app = Flask(__name__)

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




if __name__ == '__main__':
    app.run(debug=True)