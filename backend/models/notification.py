from sqlalchemy import Boolean
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import Text

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from db.base import Base
from db.base import TimestampMixin
from db.base import UUIDMixin


class Notification(

    Base,

    UUIDMixin,

    TimestampMixin
):

    __tablename__ = "notifications"

    # =====================================================
    # RELATIONS
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
    # CONTENT
    # =====================================================

    title: Mapped[str] = mapped_column(

        String(255),

        nullable=False
    )

    message: Mapped[str] = mapped_column(

        Text,

        nullable=False
    )

    type: Mapped[str | None] = mapped_column(

        String(100),

        nullable=True,

        index=True
    )

    # =====================================================
    # STATE
    # =====================================================

    is_read: Mapped[bool] = mapped_column(

        Boolean,

        default=False,

        nullable=False,

        index=True
    )

    # =====================================================
    # RELATIONSHIP
    # =====================================================

    user = relationship(

        "User",

        back_populates="notifications"
    )