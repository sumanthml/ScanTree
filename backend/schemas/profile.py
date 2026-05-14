from datetime import date
from uuid import UUID

from pydantic import BaseModel
from pydantic import ConfigDict


# =====================================================
# CREATE PROFILE
# =====================================================

class CreateProfileRequest(
    BaseModel
):

    full_name: str

    gender: str | None = None

    date_of_birth: date | None = None

    blood_group: str | None = None

    relationship_type: str = "Family"

    photo_path: str | None = None


# =====================================================
# UPDATE PROFILE
# =====================================================

class UpdateProfileRequest(
    BaseModel
):

    full_name: str | None = None

    gender: str | None = None

    date_of_birth: date | None = None

    blood_group: str | None = None

    relationship_type: str | None = None

    photo_path: str | None = None


# =====================================================
# PROFILE RESPONSE
# =====================================================

class ProfileResponse(
    BaseModel
):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    full_name: str

    gender: str | None

    date_of_birth: date | None

    blood_group: str | None

    relationship_type: str

    photo_path: str | None