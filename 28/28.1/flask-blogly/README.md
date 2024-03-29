# Flask User Blog

Flask User Blog is a simple web application built with Flask, a lightweight web framework for Python. The application allows users to view a list of users and add new users to the database.

## Features

- **Display a list of users** with their first name, last name, and image URL.
- **Add new users** with the ability to input first name, last name, and image URL.
- **User Details**: Click on a user to view their details.
- **Edit Users**: Modify user information as needed.
- **Delete Users**: Remove users from the system with the click of a button.

## Technologies Used

- Flask: Web framework for Python.
- Flask-SQLAlchemy: Extension for Flask that adds support for SQLAlchemy, a SQL toolkit and Object-Relational Mapping (ORM) library.
- PostgreSQL: Database system for storing user data.
- JQuery: a fast, small, and feature-rich JavaScript library for HTML document traversal and manipulation.

## Getting Started

1. Clone the repository.
2. Install the required dependencies using `pip install -r requirements.txt`.
3. Set up a PostgreSQL database and update the `SQLALCHEMY_DATABASE_URI` in `app.py` with your database connection details.
4. Run the application using `python3 -m app`.
5. Access the application in your web browser at `http://localhost:5000`.

## Contributing

Contributions are welcome! If you find any issues or have suggestions, please open an issue or create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

