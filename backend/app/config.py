import os

from dotenv import find_dotenv, load_dotenv

# usecwd=True starts the search from the current working directory instead
# of relying on call-stack introspection, which is more predictable under
# WSGI servers, test runners, and other non-standard entry points.
load_dotenv(find_dotenv(usecwd=True))


class Config:
    MONGO_URI: str = os.environ.get("MONGO_URI", "mongodb://localhost:27017/taskly")
