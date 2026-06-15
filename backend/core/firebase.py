import json
import firebase_admin
from firebase_admin import credentials

from settings import settings


def initialize_firebase():
    """Initialize Firebase Admin SDK using credentials from settings."""
    if firebase_admin._apps:
        return  # Already initialized

    cred_json = settings.FIREBASE_CREDENTIALS_JSON

    if not cred_json:
        raise ValueError(
            "FIREBASE_CREDENTIALS_JSON is not set in .env"
        )

    try:
        cred_dict = json.loads(cred_json)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"FIREBASE_CREDENTIALS_JSON is not valid JSON: {e}"
        )

    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)