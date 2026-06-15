from uuid import UUID

from sqlalchemy.orm import Session

from models.user import User
from models.profile import Profile

from schemas.profile import (
    CreateProfileRequest,
    UpdateProfileRequest
)


class ProfileService:

    # =====================================================
    # CREATE DEFAULT PROFILE
    # =====================================================
    @staticmethod
    def create_default_profile(
        db: Session,
        user: User
    ) -> Profile:

        existing = (
            db.query(Profile)
            .filter(
                Profile.user_id == user.id,
                Profile.relationship_type == "Self"
            )
            .first()
        )

        if existing:
            return existing

        profile = Profile(
            user_id=user.id,
            firebase_uid=user.firebase_uid,
            full_name=user.name,
            relationship_type="Self"
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)

        if not user.active_profile_id:
            user.active_profile_id = profile.id
            db.commit()

        return profile

    # =====================================================
    # GET DEFAULT PROFILE
    # =====================================================
    @staticmethod
    def get_default_profile(
        db: Session,
        user: User
    ) -> Profile | None:

        return (
            db.query(Profile)
            .filter(
                Profile.user_id == user.id,
                Profile.relationship_type == "Self"
            )
            .first()
        )

    # =====================================================
    # GET ACTIVE PROFILE
    # =====================================================
    @staticmethod
    def get_active_profile(
        db: Session,
        user: User
    ) -> Profile | None:

        if not user.active_profile_id:
            return ProfileService.get_default_profile(
                db,
                user
            )

        return (
            db.query(Profile)
            .filter(
                Profile.id == user.active_profile_id,
                Profile.user_id == user.id
            )
            .first()
        )

    # =====================================================
    # SET ACTIVE PROFILE
    # =====================================================
    @staticmethod
    def set_active_profile(
        db: Session,
        profile_id: UUID,
        user: User
    ) -> Profile:

        profile = (
            db.query(Profile)
            .filter(
                Profile.id == profile_id,
                Profile.user_id == user.id
            )
            .first()
        )

        if not profile:
            raise ValueError("Profile not found")

        user.active_profile_id = profile.id

        db.add(user)
        db.commit()
        db.refresh(user)

        return profile

    # =====================================================
    # GET ALL PROFILES
    # =====================================================
    @staticmethod
    def get_profiles(
        db: Session,
        user: User
    ) -> list[dict]:
        from models.shared_access import SharedAccess

        # Fetch own profiles
        own_profiles = (
            db.query(Profile)
            .filter(
                Profile.user_id == user.id
            )
            .order_by(Profile.created_at.asc())
            .all()
        )
        
        results = []
        for p in own_profiles:
            results.append({
                "id": str(p.id),
                "full_name": p.full_name,
                "gender": p.gender,
                "date_of_birth": p.date_of_birth.isoformat() if p.date_of_birth else None,
                "blood_group": p.blood_group,
                "relationship_type": p.relationship_type,
                "photo_path": p.photo_path,
                "is_shared": False
            })

        # Fetch accepted shared profiles where current user is the recipient
        shared_accesses = (
            db.query(SharedAccess)
            .filter(
                SharedAccess.shared_user_email.ilike(user.email),
                SharedAccess.status == "accepted"
            )
            .all()
        )

        for sa in shared_accesses:
            owner_profiles = (
                db.query(Profile)
                .filter(Profile.user_id == sa.owner_user_id)
                .all()
            )
            
            owner_user = db.query(User).filter(User.id == sa.owner_user_id).first()
            owner_name = owner_user.name if owner_user else "Family Member"
            
            for p in owner_profiles:
                results.append({
                    "id": str(p.id),
                    "full_name": p.full_name,
                    "gender": p.gender,
                    "date_of_birth": p.date_of_birth.isoformat() if p.date_of_birth else None,
                    "blood_group": p.blood_group,
                    "relationship_type": f"Shared (by {owner_name})",
                    "photo_path": p.photo_path,
                    "is_shared": True
                })

        return results

    # =====================================================
    # GET PROFILE BY ID
    # =====================================================
    @staticmethod
    def get_profile_by_id(
        db: Session,
        profile_id: UUID,
        user: User
    ) -> Profile | None:
        # 1. Check if it's the user's own profile
        profile = (
            db.query(Profile)
            .filter(
                Profile.id == profile_id,
                Profile.user_id == user.id
            )
            .first()
        )
        if profile:
            return profile

        # 2. Check if it's a shared profile that the user has accepted access to
        profile = db.query(Profile).filter(Profile.id == profile_id).first()
        if not profile:
            return None

        from models.shared_access import SharedAccess
        shared = (
            db.query(SharedAccess)
            .filter(
                SharedAccess.owner_user_id == profile.user_id,
                SharedAccess.shared_user_email.ilike(user.email),
                SharedAccess.status == "accepted"
            )
            .first()
        )
        if shared:
            return profile

        return None

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
            firebase_uid=user.firebase_uid,
            full_name=payload.full_name,
            gender=payload.gender,
            date_of_birth=payload.date_of_birth,
            blood_group=payload.blood_group,
            relationship_type=payload.relationship_type,
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

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(profile, field, value)

        db.add(profile)
        db.commit()
        db.refresh(profile)

        return profile

    # =====================================================
    # DELETE PROFILE
    # =====================================================
    @staticmethod
    def delete_profile(
        db: Session,
        profile: Profile,
        user: User
    ) -> bool:

        if profile.relationship_type == "Self":
            raise ValueError(
                "Default profile cannot be deleted"
            )

        if user.active_profile_id == profile.id:
            default_profile = (
                ProfileService.get_default_profile(
                    db,
                    user
                )
            )

            if default_profile:
                user.active_profile_id = default_profile.id

        db.delete(profile)
        db.commit()

        return True