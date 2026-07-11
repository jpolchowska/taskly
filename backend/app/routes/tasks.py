from __future__ import annotations

from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from flask import Blueprint, jsonify, request
from pymongo import ReturnDocument

from ..db import get_db
from ..validation import ValidationError, validate_task_payload

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


def _serialize(task: dict) -> dict:
    task["id"] = str(task.pop("_id"))
    task["created_at"] = task["created_at"].isoformat()
    task["updated_at"] = task["updated_at"].isoformat()
    return task


def _parse_object_id(task_id: str) -> ObjectId | None:
    try:
        return ObjectId(task_id)
    except InvalidId:
        return None


def _next_order(status: str) -> float:
    """Fractional-indexing scheme: new tasks are appended after the current
    highest order in their column, so a single move only ever touches the
    one task being reordered instead of re-indexing the whole column."""
    db = get_db()
    last = db.tasks.find_one({"status": status}, sort=[("order", -1)])
    return (last["order"] + 1) if last else 0.0


@tasks_bp.route("", methods=["GET"])
def list_tasks():
    db = get_db()
    tasks = db.tasks.find().sort([("status", 1), ("order", 1)])
    return jsonify([_serialize(task) for task in tasks])


@tasks_bp.route("", methods=["POST"])
def create_task():
    try:
        data = validate_task_payload(request.get_json(silent=True) or {}, partial=False)
    except ValidationError as error:
        return jsonify(error=str(error)), 400

    data["order"] = _next_order(data["status"])
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now

    db = get_db()
    result = db.tasks.insert_one(data)
    task = db.tasks.find_one({"_id": result.inserted_id})
    return jsonify(_serialize(task)), 201


@tasks_bp.route("/<task_id>", methods=["PATCH"])
def update_task(task_id: str):
    object_id = _parse_object_id(task_id)
    if object_id is None:
        return jsonify(error="Task not found."), 404

    try:
        updates = validate_task_payload(request.get_json(silent=True) or {}, partial=True)
    except ValidationError as error:
        return jsonify(error=str(error)), 400

    updates["updated_at"] = datetime.now(timezone.utc)

    db = get_db()
    task = db.tasks.find_one_and_update(
        {"_id": object_id},
        {"$set": updates},
        return_document=ReturnDocument.AFTER,
    )
    if task is None:
        return jsonify(error="Task not found."), 404

    return jsonify(_serialize(task))


@tasks_bp.route("/<task_id>", methods=["DELETE"])
def delete_task(task_id: str):
    object_id = _parse_object_id(task_id)
    if object_id is None:
        return jsonify(error="Task not found."), 404

    db = get_db()
    result = db.tasks.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        return jsonify(error="Task not found."), 404

    return "", 204
