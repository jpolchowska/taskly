from __future__ import annotations

ALLOWED_STATUSES = {"todo", "in_progress", "done"}


class ValidationError(Exception):
    """Raised when incoming request data fails validation."""


def validate_task_payload(data: dict, *, partial: bool) -> dict:
    """Validate a task payload and return only the recognized, cleaned fields.

    partial=False is used for creation, where title/category/status are all
    required. partial=True is used for PATCH, where any subset of fields
    (including order) may be present, but at least one is required.
    """
    if not isinstance(data, dict):
        raise ValidationError("Request body must be a JSON object.")

    cleaned: dict = {}

    if "title" in data or not partial:
        title = data.get("title")
        if not isinstance(title, str) or not title.strip():
            raise ValidationError("'title' is required and must be a non-empty string.")
        cleaned["title"] = title.strip()

    if "category" in data or not partial:
        category = data.get("category")
        if not isinstance(category, str) or not category.strip():
            raise ValidationError("'category' is required and must be a non-empty string.")
        cleaned["category"] = category.strip()

    if "status" in data or not partial:
        status = data.get("status")
        if status not in ALLOWED_STATUSES:
            raise ValidationError(f"'status' must be one of {sorted(ALLOWED_STATUSES)}.")
        cleaned["status"] = status

    if partial and "order" in data:
        order = data.get("order")
        if not isinstance(order, (int, float)) or isinstance(order, bool):
            raise ValidationError("'order' must be a number.")
        cleaned["order"] = float(order)

    if partial and not cleaned:
        raise ValidationError("At least one field must be provided.")

    return cleaned
