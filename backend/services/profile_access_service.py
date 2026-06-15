from sqlalchemy.orm import Session

from models.profile import Profile



class ProfileAccessService:

    @staticmethod
    def validate_profile_access(
        db: Session,
        profile_id: str,
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