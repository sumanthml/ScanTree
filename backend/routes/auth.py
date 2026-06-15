from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from firebase_admin import auth as firebase_auth

from db.client import get_db
from core.firebase_auth import verify_firebase_token

from models.user import User
from models.profile import Profile
from utils.email import send_password_reset_email

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


# =====================================================
# REGISTER (server-side — avoids browser DNS issues)
# =====================================================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

@router.post("/register")
def register_user(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):
    """
    Create Firebase user via Admin SDK (server-side) then sync to DB.
    Returns a Firebase custom token the frontend can exchange for an ID token.
    This avoids ERR_NAME_NOT_RESOLVED when browsers call identitytoolkit.googleapis.com directly.
    """
    name = payload.name.strip()
    email = payload.email.strip().lower()
    password = payload.password

    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    # ── 1. Check if the email already exists in Firebase ──────────────────────
    try:
        firebase_auth.get_user_by_email(email)
        raise HTTPException(status_code=409, detail="EMAIL_EXISTS")
    except firebase_auth.UserNotFoundError:
        pass  # Good — user doesn't exist yet
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firebase lookup error: {str(e)}")

    # ── 2. Create Firebase user via Admin SDK ──────────────────────────────────
    try:
        firebase_user = firebase_auth.create_user(
            email=email,
            password=password,
            display_name=name,
            email_verified=False,
        )
        firebase_uid = firebase_user.uid
    except Exception as e:
        msg = str(e)
        if "WEAK_PASSWORD" in msg:
            raise HTTPException(status_code=400, detail="WEAK_PASSWORD")
        raise HTTPException(status_code=500, detail=f"Firebase create user error: {msg}")

    # ── 3. Sync to DB ──────────────────────────────────────────────────────────
    try:
        db_user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

        if not db_user:
            db_user = User(
                firebase_uid=firebase_uid,
                name=name,
                email=email,
                is_email_verified=False,
            )
            db.add(db_user)
            db.flush()

        profile = db.query(Profile).filter(Profile.user_id == db_user.id).first()

        if not profile:
            profile = Profile(
                user_id=db_user.id,
                firebase_uid=firebase_uid,
                full_name=name,
                relationship_type="Self",
            )
            db.add(profile)
            db.flush()

        if not db_user.active_profile_id:
            db_user.active_profile_id = profile.id

        db.commit()
        db.refresh(db_user)
        db.refresh(profile)

    except Exception as e:
        db.rollback()
        # Clean up Firebase user so a retry doesn't hit EMAIL_EXISTS
        try:
            firebase_auth.delete_user(firebase_uid)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"DB sync error: {str(e)}")

    # ── 4. Generate a custom token for the frontend to sign in with ────────────
    try:
        custom_token: bytes = firebase_auth.create_custom_token(firebase_uid)
        custom_token_str = custom_token.decode("utf-8") if isinstance(custom_token, bytes) else custom_token
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token generation error: {str(e)}")

    return {
        "success": True,
        "message": "Account created successfully.",
        "custom_token": custom_token_str,
        "user_id": str(db_user.id),
        "profile_id": str(profile.id),
        "name": db_user.name,
        "email": db_user.email,
    }


# =====================================================
# CURRENT USER
# =====================================================

@router.get("/me")
def me(
    db: Session = Depends(get_db),
    user=Depends(verify_firebase_token)
):

    firebase_uid = user["uid"]
    email = user.get("email")

    db_user = (
        db.query(User)
        .filter(User.firebase_uid == firebase_uid)
        .first()
    )

    profile = None

    if db_user and db_user.active_profile_id:

        profile = (
            db.query(Profile)
            .filter(Profile.id == db_user.active_profile_id)
            .first()
        )

    return {
        "success": True,
        "data": {
            "id": str(db_user.id) if db_user else None,
            "user_id": str(db_user.id) if db_user else None,
            "firebase_uid": firebase_uid,
            "name": db_user.name if db_user else None,
            "email": email,
            "registered": db_user is not None,
            "active_profile_id": str(db_user.active_profile_id) if db_user and db_user.active_profile_id else None,
            "has_profile": profile is not None,
            "profile_id": str(profile.id) if profile else None
        }
    }


# =====================================================
# SYNC USER (FIRST LOGIN)
# =====================================================

@router.post("/sync")
def sync_user(
    db: Session = Depends(get_db),
    user=Depends(verify_firebase_token)
):

    firebase_uid = user["uid"]
    email = user.get("email")

    name = user.get("name") or email.split("@")[0]

    try:

        db_user = (
            db.query(User)
            .filter(User.firebase_uid == firebase_uid)
            .first()
        )

        # If not found by firebase_uid, fallback to email to prevent unique constraint violation
        if not db_user and email:
            db_user = (
                db.query(User)
                .filter(User.email.ilike(email))
                .first()
            )
            if db_user:
                db_user.firebase_uid = firebase_uid
                # Also sync firebase_uid on their profiles
                for p in db_user.profiles:
                    p.firebase_uid = firebase_uid

        # CREATE USER
        if not db_user:

            db_user = User(
                firebase_uid=firebase_uid,
                name=name,
                email=email,
                is_email_verified=True
            )

            db.add(db_user)
            db.flush()

        else:
            db_user.email = email
            db_user.name = name

        # CREATE DEFAULT PROFILE
        profile = (
            db.query(Profile)
            .filter(Profile.user_id == db_user.id)
            .first()
        )

        profile_created = False

        if not profile:

            profile = Profile(
                user_id=db_user.id,
                firebase_uid=firebase_uid,
                full_name=name,
                relationship_type="Self"
            )

            db.add(profile)
            db.flush()

            profile_created = True

        # 🔥 CRITICAL FIX: SET ACTIVE PROFILE
        if not db_user.active_profile_id:
            db_user.active_profile_id = profile.id

        db.commit()
        db.refresh(db_user)
        db.refresh(profile)

        return {
            "success": True,
            "message": "User synced successfully",
            "user_id": str(db_user.id),
            "name": db_user.name,
            "email": db_user.email,
            "profile_id": str(profile.id),
            "profile_created": profile_created
        }

    except Exception:
        db.rollback()
        raise


class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    email = payload.email.strip().lower()
    
    try:
        user_record = firebase_auth.get_user_by_email(email)
    except firebase_auth.UserNotFoundError:
        return {
            "success": True,
            "message": "If the account exists, a password reset link has been sent."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Firebase error: {str(e)}"
        )
        
    try:
        reset_link = firebase_auth.generate_password_reset_link(email)
        success = send_password_reset_email(email, reset_link)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send password reset email via SMTP."
            )
            
        return {
            "success": True,
            "message": "Password reset link sent successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating reset link: {str(e)}"
        )