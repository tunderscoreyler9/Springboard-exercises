from flask import Flask, request, render_template, redirect, flash, session, url_for, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, text, Pet
from forms import AddPetForm, EditPetForm

def create_app(adopt_db, testing=True):
    app = Flask(__name__)
    app.testing = testing
    app.app_context().push()
    app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql:///{adopt_db}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True
    app.config['SECRET_KEY'] = "secret_lil_code"
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
    debug = DebugToolbarExtension(app)

    
    @app.route("/", methods=["GET"])
    def list_pets():
        """List all pets."""

        pets = Pet.query.all()
        return render_template("pet_list.html", pets=pets)
    
    @app.route("/add", methods=["GET", "POST"])
    def add_pet():
        """Add a pet."""

        form = AddPetForm()

        if form.validate_on_submit():
            data = {k: v for k, v in form.data.items() if k != "csrf_token"}
            new_pet = Pet(**data)
            # new_pet = Pet(name=form.name.data, age=form.age.data, ...)
            db.session.add(new_pet)
            db.session.commit()
            flash(f"{new_pet.name} added.")
            return redirect(url_for('list_pets'))

        else:
            return render_template("pet_add_form.html", form=form)


    @app.route("/<int:pet_id>", methods=["GET", "POST"])
    def edit_pet(pet_id):
        """Edit pet."""

        pet = Pet.query.get_or_404(pet_id)
        form = EditPetForm(obj=pet)

        if form.validate_on_submit():
            pet.notes = form.notes.data
            pet.available = form.available.data
            pet.photo_url = form.photo_url.data
            db.session.commit()
            flash(f"{pet.name} updated.")
            return redirect(url_for('list_pets'))

        else:
            return render_template("pet_edit_form.html", form=form, pet=pet)


    @app.route("/api/pets/<int:pet_id>", methods=['GET'])
    def api_get_pet(pet_id):
        """Return basic info about pet in JSON."""

        pet = Pet.query.get_or_404(pet_id)
        info = {"name": pet.name, "age": pet.age}

        return jsonify(info)
    
    @app.route("/<int:pet_id>/delete", methods=["POST"])
    def delete_pet(pet_id):
        """Handle form submission to delete a Pet"""
        pet = Pet.query.get_or_404(pet_id)
        db.session.delete(pet)
        db.session.commit()
        
        flash(f"Pet '{pet.name} deleted.")
        return redirect("/")
    
    
    
    return app

if __name__ == '__main__':
    app = create_app('adopt_db')
    connect_db(app)
    # app.run(debug=True)
