from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from fastapi.security import (
    OAuth2PasswordRequestForm
)

from sqlalchemy.orm import Session

from db.client import get_db

from dependencies.auth import (
    get_current_user
)

from models.user import User

from schemas.auth import (
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    UserResponse
)

from services.auth_service import (
    AuthService
)

router = APIRouter(

    prefix="/auth",

    tags=["Authentication"]
)

# =====================================================
# REGISTER
# =====================================================

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
async def register(

    payload: RegisterRequest,

    db: Session = Depends(
        get_db
    )
):

    try:

        result = (
            await AuthService.register_user(
                db,
                payload
            )
        )

        return {

            "success": True,

            "message": (
                "User registered successfully"
            ),

            "data": {

                "user": (
                    UserResponse.model_validate(
                        result["user"]
                    )
                ),

                "auth": AuthResponse(

                    access_token=(
                        result["access_token"]
                    ),

                    refresh_token=(
                        result["refresh_token"]
                    ),

                    token_type="bearer"
                ),

                "email_verification_required":
                    True
            }
        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)
        )

# =====================================================
# LOGIN
# =====================================================

@router.post("/login")
def login(

    form_data: OAuth2PasswordRequestForm = Depends(),

    db: Session = Depends(
        get_db
    )
):

    try:

        payload = LoginRequest(

            email=form_data.username,

            password=form_data.password
        )

        result = (
            AuthService.login_user(
                db,
                payload
            )
        )

        return {

            "success": True,

            "message":
                "Login successful",

            "data": {

                "access_token": (
                    result["access_token"]
                ),

                "refresh_token": (
                    result["refresh_token"]
                ),

                "token_type": "bearer",

                "user": {

                    "id": str(
                        result["user"].id
                    ),

                    "name": (
                        result["user"].name
                    ),

                    "email": (
                        result["user"].email
                    )
                }
            }
        }

    except ValueError as e:

        message = str(e)

        if (
            message ==
            "User not registered"
        ):

            raise HTTPException(

                status_code=404,

                detail=message
            )

        elif (
            message ==
            "Incorrect password"
        ):

            raise HTTPException(

                status_code=401,

                detail=message
            )

        elif (
            message ==
            "Please verify your email"
        ):

            raise HTTPException(

                status_code=403,

                detail=message
            )

        raise HTTPException(

            status_code=400,

            detail=message
        )

# =====================================================
# CURRENT USER
# =====================================================

@router.get("/me")
def get_me(

    current_user: User = Depends(
        get_current_user
    )
):

    return {

        "success": True,

        "data": {

            "id": str(
                current_user.id
            ),

            "name": (
                current_user.name
            ),

            "email": (
                current_user.email
            )
        }
    }