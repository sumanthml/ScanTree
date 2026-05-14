from sqlalchemy import Boolean
from sqlalchemy import String

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from db.base import Base
from db.base import TimestampMixin
from db.base import UUIDMixin


class User(

    Base,

    UUIDMixin,

    TimestampMixin
):

    __tablename__ = "users"

    # =====================================================
    # BASIC INFO
    # =====================================================

    name: Mapped[str] = mapped_column(

        String(120),

        nullable=False
    )

    email: Mapped[str] = mapped_column(

        String(255),

        unique=True,

        nullable=False,

        index=True
    )

    password_hash: Mapped[str] = mapped_column(

        String,

        nullable=False
    )

    avatar_url: Mapped[str | None] = mapped_column(

        String,

        nullable=True
    )

    # =====================================================
    # EMAIL VERIFICATION
    # =====================================================

    is_email_verified: Mapped[bool] = mapped_column(

        Boolean,

        default=False,

        nullable=False
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    profiles = relationship(

        "Profile",

        back_populates="user",

        cascade="all, delete-orphan"
    )

    scan_jobs = relationship(

        "ScanJob",

        back_populates="user",

        cascade="all, delete-orphan"
    )

    notifications = relationship(

        "Notification",

        back_populates="user",

        cascade="all, delete-orphan"
    )

    email_otps = relationship(

        "EmailOTP",

        cascade="all, delete-orphan"
    )