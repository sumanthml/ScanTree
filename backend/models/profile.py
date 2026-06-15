from datetime import date
from sqlalchemy import String, Date, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, UUIDMixin, TimestampMixin


class Profile(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "profiles"

    firebase_uid: Mapped[str] = mapped_column(String(255), index=True)

    full_name: Mapped[str] = mapped_column(String(255))
    gender: Mapped[str | None] = mapped_column(String(50))

    date_of_birth: Mapped[date | None] = mapped_column(Date)
    blood_group: Mapped[str | None] = mapped_column(String(10))

    relationship_type: Mapped[str] = mapped_column(String(100), default="Self")
    photo_path: Mapped[str | None] = mapped_column(Text)

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))

    user = relationship("User", back_populates="profiles", foreign_keys=[user_id])
    reports = relationship("Report", back_populates="profile", cascade="all, delete-orphan")