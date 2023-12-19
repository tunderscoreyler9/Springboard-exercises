from flask import Flask, render_template, request
from flask_debugtoolbar import DebugToolbarExtension
from stories import story

app = Flask(__name__)
app.config['SECRET_KEY'] = "secret"

debug = DebugToolbarExtension(app)

@app.route('/', methods=['GET', 'POST'])
def ask_questions():
    """Generate the form to ask Madlibs questions"""
        
    prompts = story.prompts
        
    return render_template("questions.html", prompts=prompts)
        

@app.route("/story")
def show_story():
    """Show the Madlibs story"""
    
    text = story.generate(request.args)
    return render_template("story.html", text=text)









if __name__ == '__main__':
    app.run(debug=True)