from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, TimestampMixin, UUIDMixin


class ProcessingJob(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "processing_jobs"

    scan_job_id: Mapped[str] = mapped_column(
        ForeignKey("scan_jobs.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )

    status: Mapped[str] = mapped_column(String(50), default="queued", index=True)
    progress: Mapped[int] = mapped_column(Integer, default=0)

    current_stage: Mapped[str | None] = mapped_column(String(100), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    scan_job = relationship("ScanJob", back_populates="processing_jobs")