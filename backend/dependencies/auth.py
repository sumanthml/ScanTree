import logging
import firebase_admin
from firebase_admin import auth

from fastapi import HTTPException, Request, status, Depends
from sqlalchemy.orm import Session

from db.client import get_db
from models.user import User
from models.profile import Profile

logger = logging.getLogger(__name__)


# =====================================================
# CURRENT USER — Firebase token → DB User (auto-sync)
# =====================================================
def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:

    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header"
        )

    # =====================================================
    # VERIFY FIREBASE TOKEN
    # =====================================================
    try:
        token = auth_header[7:].strip()  # Remove "Bearer " safely
        decoded = auth.verify_id_token(
            token,
            check_revoked=False,
            clock_skew_seconds=10  # Tolerate up to 10s clock drift
        )

        firebase_uid = decoded.get("uid")
        email = decoded.get("email", "")
        name = decoded.get("name") or (email.split("@")[0] if email else "User")

        if not firebase_uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Firebase token: missing uid"
            )

    except HTTPException:
        raise
    except auth.ExpiredIdTokenError as e:
        logger.warning(f"Expired Firebase token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase token has expired. Please log in again."
        )
    except Exception as e:
        logger.error(f"Firebase token verification failed: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {type(e).__name__}: {str(e)[:200]}"
        )

    # =====================================================
    # UPSERT USER (auto-sync on every request)
    # =====================================================
    user = db.query(User).filter(
        User.firebase_uid == firebase_uid
    ).first()

    # If not found by firebase_uid, fallback to email to prevent unique constraint violation
    if not user and email:
        user = (
            db.query(User)
            .filter(User.email.ilike(email))
            .first()
        )
        if user:
            user.firebase_uid = firebase_uid
            # Also sync firebase_uid on their profiles
            for p in user.profiles:
                p.firebase_uid = firebase_uid

    need_commit = False

    # CREATE USER
    if not user:
        user = User(
            firebase_uid=firebase_uid,
            email=email,
            name=name,
            is_email_verified=True,
            password_hash=""
        )
        db.add(user)
        db.flush()
        need_commit = True
    else:
        if email and user.email != email:
            user.email = email
            need_commit = True
        if name and not user.name:
            user.name = name
            need_commit = True

    # CREATE DEFAULT PROFILE
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == user.id)
        .first()
    )

    if not profile:
        profile = Profile(
            user_id=user.id,
            firebase_uid=firebase_uid,
            full_name=name,
            relationship_type="Self"
        )
        db.add(profile)
        db.flush()
        need_commit = True

    # SET ACTIVE PROFILE
    if not user.active_profile_id:
        user.active_profile_id = profile.id
        need_commit = True

    if need_commit:
        db.commit()
        db.refresh(user)

    return user