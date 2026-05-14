from datetime import datetime
from datetime import timedelta
from datetime import timezone

from sqlalchemy import (
    String,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column
)

from db.base import Base
from db.base import UUIDMixin
from db.base import TimestampMixin


class EmailOTP(

    Base,

    UUIDMixin,

    TimestampMixin
):

    __tablename__ = "email_otps"

    # =====================================================
    # USER
    # =====================================================

    user_id: Mapped[str] = mapped_column(

        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),

        nullable=False,

        index=True
    )

    # =====================================================
    # OTP CODE
    # =====================================================

    otp_code: Mapped[str] = mapped_column(

        String(10),

        nullable=False
    )

    # =====================================================
    # PURPOSE
    # =====================================================

    purpose: Mapped[str] = mapped_column(

        String(50),

        nullable=False,

        index=True
    )

    # =====================================================
    # STATUS
    # =====================================================

    is_used: Mapped[bool] = mapped_column(

        Boolean,

        default=False,

        nullable=False
    )

    # =====================================================
    # EXPIRATION
    # =====================================================

    expires_at: Mapped[datetime] = mapped_column(

        DateTime(timezone=True),

        nullable=False,

        default=lambda:

            datetime.now(
                timezone.utc
            )

            +

            timedelta(minutes=10)
    )