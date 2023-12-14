from flask import Flask

app = Flask(__name__)

@app.route('/welcome')
def welcome_guest():
    return 'welcome'

@app.route('/welcome/home')
def welcome_home_guest():
    return 'welcome home'

@app.route('/welcome/back')
def welcome_back_guest():
    return 'welcome back'
