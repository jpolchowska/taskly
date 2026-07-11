from __future__ import annotations

from flask import Blueprint, jsonify

from ..db import get_db

quotes_bp = Blueprint("quotes", __name__, url_prefix="/api/quotes")


@quotes_bp.route("/random", methods=["GET"])
def random_quote():
    db = get_db()
    result = list(db.quotes.aggregate([{"$sample": {"size": 1}}]))
    if not result:
        return jsonify(error="No quotes available."), 404

    quote = result[0]
    quote["id"] = str(quote.pop("_id"))
    return jsonify(quote)
