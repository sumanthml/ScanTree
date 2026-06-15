import logging
import firebase_admin
from firebase_admin import auth
from fastapi import HTTPException, Request

logger = logging.getLogger(__name__)


def verify_firebase_token(request: Request):

    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(
            status_code=401,
            detail="Missing Authorization header"
        )

    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authorization header must start with 'Bearer '"
        )

    token = auth_header[7:].strip()  # Remove "Bearer " prefix

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Token is empty"
        )

    try:
        decoded_token = auth.verify_id_token(
            token,
            check_revoked=False,   # Don't check revocation — faster + avoids network call
            clock_skew_seconds=10  # Allow 10s clock skew to handle minor time sync issues
        )
        return decoded_token

    except auth.ExpiredIdTokenError as e:
        logger.warning(f"Firebase token expired: {e}")
        raise HTTPException(
            status_code=401,
            detail="Firebase token has expired. Please log in again."
        )

    except auth.RevokedIdTokenError as e:
        logger.warning(f"Firebase token revoked: {e}")
        raise HTTPException(
            status_code=401,
            detail="Firebase token has been revoked. Please log in again."
        )

    except auth.InvalidIdTokenError as e:
        logger.warning(f"Firebase token invalid: {e}")
        raise HTTPException(
            status_code=401,
            detail=f"Invalid Firebase token: {str(e)}"
        )

    except Exception as e:
        # Log the real error so we can debug
        logger.error(f"Firebase verify_id_token unexpected error: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=401,
            detail=f"Token verification failed: {type(e).__name__}"
        )