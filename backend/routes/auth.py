from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from fastapi.security import (
    OAuth2PasswordRequestForm
)

from sqlalchemy.orm import Session

from db.client import get_db

from schemas.auth import (
    RegisterRequest,
    LoginRequest,
    VerifyEmailOTPRequest,
    ForgotPasswordRequest,
    VerifyResetOTPRequest,
    ResetPasswordRequest,
    RefreshTokenRequest
)

from services.auth_service import (
    AuthService
)

from utils.jwt import (
    verify_refresh_token,
    create_access_token
)


router = APIRouter(

    prefix="/auth",

    tags=["Authentication"]
)


# =====================================================
# REGISTER
# =====================================================

@router.post("/register")
async def register(

    payload: RegisterRequest,

    db: Session = Depends(get_db)
):

    try:

        result = await AuthService.register_user(

            db,

            payload
        )

        return {

            "success": True,

            "message": (
                "Registration successful. "
                "Please verify your email."
            ),

            "data": result
        }

    except ValueError as e:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail=str(e)
        )


# =====================================================
# LOGIN
# =====================================================

@router.post("/login")
def login(

    form_data: OAuth2PasswordRequestForm = Depends(),

    db: Session = Depends(get_db)
):

    try:

        payload = LoginRequest(

            email=form_data.username,

            password=form_data.password
        )

        result = AuthService.login_user(

            db,

            payload
        )

        return {

            "success": True,

            "message":
                "Login successful",

            "data": {

                "access_token":
                    result["access_token"],

                "token_type":
                    "bearer",

                "user": {

                    "id": str(
                        result["user"].id
                    ),

                    "name":
                        result["user"].name,

                    "email":
                        result["user"].email
                }
            }
        }

    except ValueError as e:

        message = str(e)

        status_code = (
            status.HTTP_401_UNAUTHORIZED
        )

        if (
            "not registered"
            in message.lower()
        ):

            status_code = (
                status.HTTP_404_NOT_FOUND
            )

        raise HTTPException(

            status_code=status_code,

            detail=message
        )


# =====================================================
# VERIFY EMAIL
# =====================================================

@router.post("/verify-email")
def verify_email(

    payload: VerifyEmailOTPRequest,

    db: Session = Depends(get_db)
):

    try:

        AuthService.verify_email_otp(

            db=db,

            email=payload.email,

            otp_code=payload.otp_code
        )

        return {

            "success": True,

            "message":
                "Email verified successfully"
        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)
        )


# =====================================================
# RESEND VERIFICATION OTP
# =====================================================

@router.post("/resend-verification-otp")
async def resend_verification_otp(

    email: str,

    db: Session = Depends(get_db)
):

    try:

        await AuthService.resend_verification_otp(

            db=db,

            email=email
        )

        return {

            "success": True,

            "message":
                "Verification OTP resent"
        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)
        )


# =====================================================
# FORGOT PASSWORD
# =====================================================

@router.post("/forgot-password")
async def forgot_password(

    payload: ForgotPasswordRequest,

    db: Session = Depends(get_db)
):

    try:

        await AuthService.send_password_reset_otp(

            db=db,

            email=payload.email
        )

        return {

            "success": True,

            "message":
                "Password reset OTP sent"
        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)
        )


# =====================================================
# VERIFY RESET OTP
# =====================================================

@router.post("/verify-reset-otp")
def verify_reset_otp(

    payload: VerifyResetOTPRequest,

    db: Session = Depends(get_db)
):

    try:

        AuthService.verify_reset_otp(

            db=db,

            email=payload.email,

            otp_code=payload.otp_code
        )

        return {

            "success": True,

            "message":
                "OTP verified successfully"
        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)
        )


# =====================================================
# RESET PASSWORD
# =====================================================

@router.post("/reset-password")
def reset_password(

    payload: ResetPasswordRequest,

    db: Session = Depends(get_db)
):

    try:

        AuthService.reset_password(

            db=db,

            email=payload.email,

            new_password=payload.new_password
        )

        return {

            "success": True,

            "message":
                "Password reset successful"
        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)
        )


# =====================================================
# REFRESH ACCESS TOKEN
# =====================================================

@router.post("/refresh")
def refresh_access_token(

    payload: RefreshTokenRequest
):

    decoded = verify_refresh_token(

        payload.refresh_token
    )

    if not decoded:

        raise HTTPException(

            status_code=401,

            detail="Invalid refresh token"
        )

    new_access_token = create_access_token({

        "sub":
            decoded["sub"],

        "email":
            decoded["email"]
    })

    return {

        "success": True,

        "access_token":
            new_access_token,

        "token_type":
            "bearer"
    }