from datetime import date
from sqlalchemy import String, Text, Date, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, UUIDMixin, TimestampMixin


class Report(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "reports"

    profile_id: Mapped[str] = mapped_column(ForeignKey("profiles.id"))
    scan_job_id: Mapped[str] = mapped_column(ForeignKey("scan_jobs.id"))

    firebase_uid: Mapped[str] = mapped_column(String(255), index=True)

    report_type: Mapped[str] = mapped_column(String(100), default="LAB_REPORT")

    original_filename: Mapped[str | None] = mapped_column(String)
    stored_filename: Mapped[str | None] = mapped_column(String)
    file_path: Mapped[str | None] = mapped_column(Text)

    mime_type: Mapped[str | None] = mapped_column(String)
    file_size: Mapped[int | None] = mapped_column(Integer)

    hospital_name: Mapped[str | None] = mapped_column(String)
    report_date: Mapped[date | None] = mapped_column(Date)

    health_score: Mapped[int | None] = mapped_column(Integer)
    summary: Mapped[str | None] = mapped_column(Text)

    profile = relationship("Profile", back_populates="reports")
    scan_job = relationship("ScanJob", back_populates="reports")

    biomarkers = relationship("Biomarker", back_populates="report", cascade="all, delete-orphan")
    ai_insights = relationship("AIInsight", back_populates="report", cascade="all, delete-orphan")