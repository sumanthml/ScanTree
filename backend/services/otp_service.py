import random

from datetime import datetime
from datetime import timedelta
from datetime import timezone

from sqlalchemy.orm import Session

from models.email_otp import EmailOTP
from models.user import User

from services.email_service import (
    EmailService
)


class OTPService:

    OTP_EXPIRY_MINUTES = 10

    # =====================================================
    # GENERATE OTP
    # =====================================================

    @staticmethod
    def generate_otp():

        return str(

            random.randint(
                100000,
                999999
            )
        )

    # =====================================================
    # INVALIDATE EXISTING OTPS
    # =====================================================

    @staticmethod
    def invalidate_existing_otps(

        db: Session,

        user_id: str,

        purpose: str
    ):

        existing_otps = (

            db.query(EmailOTP)

            .filter(

                EmailOTP.user_id == user_id,

                EmailOTP.purpose == purpose,

                EmailOTP.is_used == False
            )

            .all()
        )

        for otp in existing_otps:

            otp.is_used = True

        db.commit()

    # =====================================================
    # CREATE EMAIL OTP
    # =====================================================

    @staticmethod
    async def create_email_otp(

        db: Session,

        user: User,

        purpose: str
    ):

        # =================================================
        # INVALIDATE OLD OTPs
        # =================================================

        OTPService.invalidate_existing_otps(

            db=db,

            user_id=str(user.id),

            purpose=purpose
        )

        # =================================================
        # GENERATE OTP
        # =================================================

        otp_code = (
            OTPService.generate_otp()
        )

        # =================================================
        # CREATE OTP RECORD
        # =================================================

        otp = EmailOTP(

            user_id=str(user.id),

            otp_code=otp_code,

            purpose=purpose,

            expires_at=(

                datetime.now(timezone.utc)

                +

                timedelta(
                    minutes=OTPService.OTP_EXPIRY_MINUTES
                )
            )
        )

        db.add(otp)

        db.commit()

        db.refresh(otp)

        # =================================================
        # SEND EMAIL
        # =================================================

        await EmailService.send_otp_email(

            recipient=user.email,

            otp_code=otp_code
        )

        return otp

    # =====================================================
    # VERIFY OTP
    # =====================================================

    @staticmethod
    def verify_otp(

        db: Session,

        user_id: str,

        otp_code: str,

        purpose: str
    ):

        otp = (

            db.query(EmailOTP)

            .filter(

                EmailOTP.user_id == user_id,

                EmailOTP.otp_code == otp_code,

                EmailOTP.purpose == purpose,

                EmailOTP.is_used == False
            )

            .order_by(
                EmailOTP.created_at.desc()
            )

            .first()
        )

        # =================================================
        # INVALID OTP
        # =================================================

        if not otp:

            raise ValueError(
                "Invalid OTP"
            )

        # =================================================
        # EXPIRED OTP
        # =================================================

        current_time = datetime.now(
            timezone.utc
        )

        otp_expiry = otp.expires_at

        if otp_expiry.tzinfo is None:

            otp_expiry = otp_expiry.replace(
                tzinfo=timezone.utc
            )

        if otp_expiry < current_time:

            raise ValueError(
                "OTP expired"
            )

        # =================================================
        # MARK OTP USED
        # =================================================

        otp.is_used = True

        db.commit()

        return True