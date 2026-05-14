from datetime import date

from sqlalchemy import Date
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import Text

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from db.base import Base
from db.base import TimestampMixin
from db.base import UUIDMixin


class Profile(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "profiles"

    # =====================================================
    # OWNER USER
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
    # PROFILE DETAILS
    # =====================================================

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    gender: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    date_of_birth: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    blood_group: Mapped[str | None] = mapped_column(
        String(10),
        nullable=True
    )

    relationship_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Self"
    )

    photo_path: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        back_populates="profiles"
    )

    reports = relationship(
        "Report",
        back_populates="profile",
        cascade="all, delete-orphan"
    )