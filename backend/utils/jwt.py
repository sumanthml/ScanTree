from datetime import datetime
from datetime import timedelta
from datetime import timezone

from jose import jwt
from jose import JWTError

from settings import settings


# =====================================================
# JWT CONFIG
# =====================================================

SECRET_KEY = settings.JWT_SECRET_KEY

REFRESH_SECRET_KEY = (
    settings.JWT_REFRESH_SECRET_KEY
)

ALGORITHM = settings.JWT_ALGORITHM

ACCESS_TOKEN_EXPIRE_MINUTES = (
    settings.ACCESS_TOKEN_EXPIRE_MINUTES
)

REFRESH_TOKEN_EXPIRE_DAYS = (
    settings.REFRESH_TOKEN_EXPIRE_DAYS
)


# =====================================================
# CREATE ACCESS TOKEN
# =====================================================

def create_access_token(
    data: dict
):

    payload = data.copy()

    expire = (

        datetime.now(timezone.utc)

        +

        timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload.update({

        "exp": expire,

        "type": "access"
    })

    return jwt.encode(

        payload,

        SECRET_KEY,

        algorithm=ALGORITHM
    )


# =====================================================
# CREATE REFRESH TOKEN
# =====================================================

def create_refresh_token(
    data: dict
):

    payload = data.copy()

    expire = (

        datetime.now(timezone.utc)

        +

        timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        )
    )

    payload.update({

        "exp": expire,

        "type": "refresh"
    })

    return jwt.encode(

        payload,

        REFRESH_SECRET_KEY,

        algorithm=ALGORITHM
    )


# =====================================================
# VERIFY ACCESS TOKEN
# =====================================================

def verify_access_token(
    token: str
):

    try:

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]
        )

        if payload.get("type") != "access":

            return None

        return payload

    except JWTError:

        return None


# =====================================================
# VERIFY REFRESH TOKEN
# =====================================================

def verify_refresh_token(
    token: str
):

    try:

        payload = jwt.decode(

            token,

            REFRESH_SECRET_KEY,

            algorithms=[ALGORITHM]
        )

        if payload.get("type") != "refresh":

            return None

        return payload

    except JWTError:

        return None