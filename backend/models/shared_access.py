from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import String

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from db.base import Base
from db.base import TimestampMixin
from db.base import UUIDMixin


class SharedAccess(
    Base,
    UUIDMixin,
    TimestampMixin
):
    __tablename__ = "shared_access"

    owner_user_id: Mapped[str] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    shared_user_email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )

    permission_level: Mapped[str] = mapped_column(
        String(50),
        default="read",
        nullable=False
    )

    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    owner = relationship(
        "User",
        back_populates="shared_access"
    )