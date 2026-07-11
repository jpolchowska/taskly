from __future__ import annotations

from flask import current_app
from pymongo import MongoClient
from pymongo.database import Database


def init_db(app) -> None:
    """Create the single MongoClient for this process. MongoClient already
    manages its own connection pool, so one instance per process is enough."""
    app.extensions["mongo_client"] = MongoClient(app.config["MONGO_URI"])


def get_db() -> Database:
    return current_app.extensions["mongo_client"].get_default_database()
