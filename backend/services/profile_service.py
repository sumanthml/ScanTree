from uuid import UUID

from sqlalchemy.orm import Session

from models.profile import Profile
from models.user import User

from schemas.profile import (
    CreateProfileRequest,
    UpdateProfileRequest
)


class ProfileService:

    # =====================================================
    # CREATE DEFAULT SELF PROFILE
    # =====================================================

    @staticmethod
    def create_default_profile(
        db: Session,
        user: User
    ) -> Profile:

        profile = Profile(

            user_id=user.id,

            full_name=user.name,

            relationship_type="Self"
        )

        db.add(profile)

        db.commit()

        db.refresh(profile)

        return profile

    # =====================================================
    # GET DEFAULT PROFILE
    # =====================================================

    @staticmethod
    def get_default_profile(
        user: User
    ) -> Profile | None:

        if not user.profiles:
            return None

        return user.profiles[0]

    # =====================================================
    # GET ALL USER PROFILES
    # =====================================================

    @staticmethod
    def get_profiles(
        db: Session,
        user: User
    ) -> list[Profile]:

        return (

            db.query(Profile)

            .filter(
                Profile.user_id == user.id
            )

            .order_by(
                Profile.created_at.asc()
            )

            .all()
        )

    # =====================================================
    # GET PROFILE BY ID
    # =====================================================

    @staticmethod
    def get_profile_by_id(
        db: Session,
        profile_id: UUID,
        user: User
    ) -> Profile | None:

        return (

            db.query(Profile)

            .filter(
                Profile.id == profile_id,
                Profile.user_id == user.id
            )

            .first()
        )

    # =====================================================
    # CREATE PROFILE
    # =====================================================

    @staticmethod
    def create_profile(
        db: Session,
        payload: CreateProfileRequest,
        user: User
    ) -> Profile:

        profile = Profile(

            user_id=user.id,

            full_name=payload.full_name,

            gender=payload.gender,

            date_of_birth=payload.date_of_birth,

            blood_group=payload.blood_group,

            relationship_type=(
                payload.relationship_type
            ),

            photo_path=payload.photo_path
        )

        db.add(profile)

        db.commit()

        db.refresh(profile)

        return profile

    # =====================================================
    # UPDATE PROFILE
    # =====================================================

    @staticmethod
    def update_profile(
        db: Session,
        profile: Profile,
        payload: UpdateProfileRequest
    ) -> Profile:

        update_data = (
            payload.model_dump(
                exclude_unset=True
            )
        )

        for field, value in update_data.items():

            setattr(
                profile,
                field,
                value
            )

        db.commit()

        db.refresh(profile)

        return profile

    # =====================================================
    # DELETE PROFILE
    # =====================================================

    @staticmethod
    def delete_profile(
        db: Session,
        profile: Profile
    ):

        db.delete(profile)

        db.commit()