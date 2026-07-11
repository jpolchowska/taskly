from flask import Flask
from flask_cors import CORS

from .config import Config
from .db import init_db
from .routes.quotes import quotes_bp
from .routes.tasks import tasks_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={"/api/*": {"origins": "*"}})

    init_db(app)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(quotes_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        return {"status": "ok"}

    return app
