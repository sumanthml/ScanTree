from datetime import datetime
from sqlalchemy import String, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, UUIDMixin, TimestampMixin


class ScanJob(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "scan_jobs"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    profile_id: Mapped[str | None] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), nullable=True)

    original_filename: Mapped[str] = mapped_column(String)
    stored_filename: Mapped[str] = mapped_column(String)
    file_path: Mapped[str] = mapped_column(String)
    file_size: Mapped[int] = mapped_column(Integer)

    mime_type: Mapped[str | None] = mapped_column(String(100))

    status: Mapped[str] = mapped_column(String(50), default="UPLOADED")
    progress: Mapped[int] = mapped_column(Integer, default=0)

    current_stage: Mapped[str | None] = mapped_column(String)
    error_message: Mapped[str | None] = mapped_column(Text)

    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user = relationship("User", back_populates="scan_jobs")
    reports = relationship("Report", back_populates="scan_job", cascade="all, delete-orphan")