from flask import Flask
from flask_cors import CORS

from .config import Config
from .db import init_db


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={"/api/*": {"origins": "*"}})

    init_db(app)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app
