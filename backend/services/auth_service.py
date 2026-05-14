from sqlalchemy.orm import Session

from models.user import User

from schemas.auth import (
    RegisterRequest,
    LoginRequest
)

from services.profile_service import (
    ProfileService
)

from services.otp_service import (
    OTPService
)

from utils.hashing import (
    hash_password,
    verify_password
)

from utils.jwt import (
    create_access_token,
    create_refresh_token
)

from utils.password_validator import (
    PasswordValidator
)


class AuthService:

    # =====================================================
    # NORMALIZE EMAIL
    # =====================================================

    @staticmethod
    def normalize_email(
        email: str
    ) -> str:

        return (
            email
            .strip()
            .lower()
        )

    # =====================================================
    # GET USER BY EMAIL
    # =====================================================

    @staticmethod
    def get_user_by_email(

        db: Session,

        email: str
    ) -> User | None:

        normalized_email = (
            AuthService.normalize_email(
                email
            )
        )

        return (

            db.query(User)

            .filter(
                User.email == normalized_email
            )

            .first()
        )

    # =====================================================
    # GENERATE TOKENS
    # =====================================================

    @staticmethod
    def generate_auth_tokens(
        user: User
    ):

        payload = {

            "sub": str(user.id),

            "email": user.email
        }

        access_token = (
            create_access_token(
                payload
            )
        )

        refresh_token = (
            create_refresh_token(
                payload
            )
        )

        return {

            "access_token":
                access_token,

            "refresh_token":
                refresh_token,

            "token_type":
                "bearer"
        }

    # =====================================================
    # REGISTER USER
    # =====================================================

    @staticmethod
    async def register_user(

        db: Session,

        payload: RegisterRequest
    ):

        normalized_email = (
            AuthService.normalize_email(
                payload.email
            )
        )

        normalized_name = (
            payload.name.strip()
        )

        # =============================================
        # VALIDATE PASSWORD
        # =============================================

        PasswordValidator.validate_password(
            payload.password
        )

        # =============================================
        # CHECK EXISTING USER
        # =============================================

        existing_user = (

            AuthService.get_user_by_email(
                db,
                normalized_email
            )
        )

        if existing_user:

            raise ValueError(
                "Email already registered"
            )

        # =============================================
        # CREATE USER
        # =============================================

        user = User(

            name=normalized_name,

            email=normalized_email,

            password_hash=hash_password(
                payload.password
            ),

            is_email_verified=False
        )

        try:

            db.add(user)

            db.commit()

            db.refresh(user)

            # =========================================
            # CREATE DEFAULT PROFILE
            # =========================================

            ProfileService.create_default_profile(
                db,
                user
            )

            # =========================================
            # SEND EMAIL OTP
            # =========================================

            try:

                await OTPService.create_email_otp(

                    db=db,

                    user=user,

                    purpose="EMAIL_VERIFICATION"
                )

            except Exception as e:

                print(
                    "EMAIL OTP ERROR:",
                    str(e)
                )

            # =========================================
            # GENERATE TOKENS
            # =========================================

            tokens = (
                AuthService.generate_auth_tokens(
                    user
                )
            )

            return {

                "user":
                    user,

                **tokens,

                "email_verification_required":
                    True
            }

        except Exception:

            db.rollback()

            raise

    # =====================================================
    # LOGIN USER
    # =====================================================

    @staticmethod
    def login_user(

        db: Session,

        payload: LoginRequest
    ):

        user = (

            AuthService.get_user_by_email(
                db,
                payload.email
            )
        )

        # =============================================
        # USER NOT FOUND
        # =============================================

        if not user:

            raise ValueError(
                "User not registered"
            )

        # =============================================
        # VERIFY PASSWORD
        # =============================================

        is_valid_password = verify_password(

            payload.password,

            user.password_hash
        )

        if not is_valid_password:

            raise ValueError(
                "Incorrect password"
            )

        # =============================================
        # EMAIL VERIFICATION
        # =============================================

        if not user.is_email_verified:

            raise ValueError(
                "Please verify your email"
            )

        # =============================================
        # GENERATE TOKENS
        # =============================================

        tokens = (
            AuthService.generate_auth_tokens(
                user
            )
        )

        return {

            "user":
                user,

            **tokens
        }

    # =====================================================
    # VERIFY EMAIL OTP
    # =====================================================

    @staticmethod
    def verify_email_otp(

        db: Session,

        email: str,

        otp_code: str
    ):

        user = (
            AuthService.get_user_by_email(
                db,
                email
            )
        )

        if not user:

            raise ValueError(
                "User not found"
            )

        OTPService.verify_otp(

            db=db,

            user_id=str(user.id),

            otp_code=otp_code,

            purpose="EMAIL_VERIFICATION"
        )

        user.is_email_verified = True

        db.commit()

        return True

    # =====================================================
    # RESEND VERIFICATION OTP
    # =====================================================

    @staticmethod
    async def resend_verification_otp(

        db: Session,

        email: str
    ):

        user = (
            AuthService.get_user_by_email(
                db,
                email
            )
        )

        if not user:

            raise ValueError(
                "User not found"
            )

        if user.is_email_verified:

            raise ValueError(
                "Email already verified"
            )

        await OTPService.create_email_otp(

            db=db,

            user=user,

            purpose="EMAIL_VERIFICATION"
        )

        return True

    # =====================================================
    # SEND PASSWORD RESET OTP
    # =====================================================

    @staticmethod
    async def send_password_reset_otp(

        db: Session,

        email: str
    ):

        user = (
            AuthService.get_user_by_email(
                db,
                email
            )
        )

        if not user:

            raise ValueError(
                "User not found"
            )

        await OTPService.create_email_otp(

            db=db,

            user=user,

            purpose="PASSWORD_RESET"
        )

        return True

    # =====================================================
    # VERIFY RESET OTP
    # =====================================================

    @staticmethod
    def verify_reset_otp(

        db: Session,

        email: str,

        otp_code: str
    ):

        user = (
            AuthService.get_user_by_email(
                db,
                email
            )
        )

        if not user:

            raise ValueError(
                "User not found"
            )

        OTPService.verify_otp(

            db=db,

            user_id=str(user.id),

            otp_code=otp_code,

            purpose="PASSWORD_RESET"
        )

        return True

    # =====================================================
    # RESET PASSWORD
    # =====================================================

    @staticmethod
    def reset_password(

        db: Session,

        email: str,

        new_password: str
    ):

        PasswordValidator.validate_password(
            new_password
        )

        user = (
            AuthService.get_user_by_email(
                db,
                email
            )
        )

        if not user:

            raise ValueError(
                "User not found"
            )

        user.password_hash = hash_password(
            new_password
        )

        db.commit()

        return True