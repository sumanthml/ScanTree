from datetime import date

from sqlalchemy import Date
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from db.base import Base
from db.base import TimestampMixin
from db.base import UUIDMixin


class Report(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "reports"

    # =====================================================
    # PROFILE OWNERSHIP
    # =====================================================

    profile_id: Mapped[str] = mapped_column(
        ForeignKey(
            "profiles.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    # =====================================================
    # SCAN JOB RELATION
    # =====================================================

    scan_job_id: Mapped[str] = mapped_column(
        ForeignKey(
            "scan_jobs.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    # =====================================================
    # REPORT METADATA
    # =====================================================

    report_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="LAB_REPORT",
        index=True
    )

    original_filename: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    stored_filename: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    file_path: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    mime_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    file_size: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    hospital_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    report_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    health_score: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    profile = relationship(
        "Profile",
        back_populates="reports"
    )

    scan_job = relationship(
        "ScanJob",
        back_populates="reports"
    )

    biomarkers = relationship(
        "Biomarker",
        back_populates="report",
        cascade="all, delete-orphan"
    )

    ai_insights = relationship(
        "AIInsight",
        back_populates="report",
        cascade="all, delete-orphan"
    )