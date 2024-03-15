"""Forms for cupcake app."""

from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField, TextAreaField, BooleanField
from wtforms.validators import InputRequired, Length, NumberRange, URL, Optional

class SearchCupcakesForm(FlaskForm):
    """Form for searching cupcakes based on flavor"""
    flavor = StringField(
        "Cupcake flavor",
        validators=[InputRequired()]
    )
    
    
class AddCupcakeForm(FlaskForm):
    """Form for adding cupcakes"""
    # flavor, size, rating, image URL, button-to-add-cupcake
    flavor = StringField(
        "Cupcake flavor",
        validators=[InputRequired()]
    )
    size = StringField(
        "Cupcake size",
        validators=[InputRequired()]
    )
    rating = IntegerField(
        "Cupcake rating",
        validators=[InputRequired(), NumberRange(min=0, max=10)]
    )
    photo_url = StringField(
        "Cupcake photo",
        validators=[Optional(), URL()]
    )