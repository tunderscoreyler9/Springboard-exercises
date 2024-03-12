"""Flask app for Cupcakes"""
from flask import Flask, request, jsonify, render_template
from models import db, connect_db, Cupcake, DEFAULT_IMAGE

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "oh-so-secret"
app.app_context().push()

connect_db(app)

###########################
# RESTFUL CUPCAKES JSON API
###########################
@app.route('/api/cupcakes', methods=["GET"])
def list_cupcakes():
    """Returns JSON w/ all cupcakes"""
    all_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=all_cupcakes)

@app.route('/api/cupcakes/<int:id>', methods=["GET"])
def get_cupcake(id):
    """Returns JSON for one cupcake in particular"""
    cupcake = Cupcake.query.get_or_404(id)
    return jsonify(cupcake=cupcake.serialize())

@app.route('/api/cupcakes', methods=["POST"])
def create_cupcake():
    """Creates a new cupcake and returns JSON of that created cupcake"""
    new_cupcake = Cupcake(
        flavor=request.json["flavor"],
        size=request.json["size"],
        rating=request.json["rating"],
        image=request.json.get("image", DEFAULT_IMAGE)
    )
    
    db.session.add(new_cupcake)
    db.session.commit()
    
    response_json = jsonify(cupcake=new_cupcake.serialize())
    # Return a tuple
    return (response_json, 201)