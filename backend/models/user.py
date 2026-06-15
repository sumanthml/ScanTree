from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from db.base import Base, UUIDMixin, TimestampMixin


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    firebase_uid: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)

    # For Firebase users this is an empty string; kept for legacy JWT compat
    password_hash: Mapped[str] = mapped_column(String, default="")
    avatar_url: Mapped[str | None] = mapped_column(String, nullable=True)

    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # Active profile pointer
    active_profile_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", use_alter=True, name="fk_user_active_profile"),
        nullable=True,
        index=True
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================
    profiles = relationship(
        "Profile",
        back_populates="user",
        cascade="all, delete-orphan",
        foreign_keys="Profile.user_id"
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

    shared_access = relationship(
        "SharedAccess",
        back_populates="owner",
        cascade="all, delete-orphan",
        foreign_keys="SharedAccess.owner_user_id"
    )