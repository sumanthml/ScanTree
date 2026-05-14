from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field
)


# =====================================================
# REGISTER
# =====================================================

class RegisterRequest(
    BaseModel
):

    name: str = Field(

        min_length=2,

        max_length=120
    )

    email: EmailStr

    password: str = Field(

        min_length=8,

        max_length=128
    )


# =====================================================
# LOGIN
# =====================================================

class LoginRequest(
    BaseModel
):

    email: EmailStr

    password: str


# =====================================================
# VERIFY EMAIL OTP
# =====================================================

class VerifyEmailOTPRequest(
    BaseModel
):

    email: EmailStr

    otp_code: str = Field(

        min_length=6,

        max_length=6
    )


# =====================================================
# FORGOT PASSWORD
# =====================================================

class ForgotPasswordRequest(
    BaseModel
):

    email: EmailStr


# =====================================================
# VERIFY RESET OTP
# =====================================================

class VerifyResetOTPRequest(
    BaseModel
):

    email: EmailStr

    otp_code: str = Field(

        min_length=6,

        max_length=6
    )


# =====================================================
# RESET PASSWORD
# =====================================================

class ResetPasswordRequest(
    BaseModel
):

    email: EmailStr

    new_password: str = Field(

        min_length=8,

        max_length=128
    )


# =====================================================
# AUTH RESPONSE
# =====================================================

class AuthResponse(
    BaseModel
):

    access_token: str

    token_type: str = "bearer"

class RefreshTokenRequest(
    BaseModel
):

    refresh_token: str    


# =====================================================
# USER RESPONSE
# =====================================================

class UserResponse(
    BaseModel
):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    name: str

    email: EmailStr

    avatar_url: str | None

    is_email_verified: bool