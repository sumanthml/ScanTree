from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, UUIDMixin, TimestampMixin


class SharedAccess(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "shared_access"

    owner_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True
    )

    shared_user_email: Mapped[str] = mapped_column(String(255), index=True)

    permission_level: Mapped[str] = mapped_column(String(50), default="read")

    status: Mapped[str] = mapped_column(String(20), default="pending", server_default="pending")

    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    owner = relationship("User", back_populates="shared_access")