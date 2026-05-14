from datetime import datetime

from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import String

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from db.base import Base
from db.base import TimestampMixin
from db.base import UUIDMixin


class OTPCode(
    Base,
    UUIDMixin,
    TimestampMixin
):
    __tablename__ = "otp_codes"

    user_id: Mapped[str | None] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=True,
        index=True
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )

    otp_code: Mapped[str] = mapped_column(
        String(10),
        nullable=False
    )

    purpose: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    is_used: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="otp_codes"
    )