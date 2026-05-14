from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
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


class ScanJob(

    Base,

    UUIDMixin,

    TimestampMixin
):

    __tablename__ = "scan_jobs"

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
    # FILE METADATA
    # =====================================================

    original_filename: Mapped[str] = mapped_column(

        String,

        nullable=False
    )

    stored_filename: Mapped[str] = mapped_column(

        String,

        nullable=False,

        unique=True
    )

    file_path: Mapped[str] = mapped_column(

        String,

        nullable=False
    )

    file_size: Mapped[int] = mapped_column(

        Integer,

        nullable=False
    )

    mime_type: Mapped[str | None] = mapped_column(

        String(100),

        nullable=True
    )

    # =====================================================
    # PROCESSING STATE
    # =====================================================

    status: Mapped[str] = mapped_column(

        String(50),

        default="UPLOADED",

        nullable=False,

        index=True
    )

    progress: Mapped[int] = mapped_column(

        Integer,

        default=0,

        nullable=False
    )

    current_stage: Mapped[str | None] = mapped_column(

        String(100),

        nullable=True
    )

    error_message: Mapped[str | None] = mapped_column(

        Text,

        nullable=True
    )

    # =====================================================
    # TIMESTAMPS
    # =====================================================

    uploaded_at: Mapped[datetime] = mapped_column(

        DateTime(timezone=True),

        default=datetime.utcnow,

        nullable=False
    )

    completed_at: Mapped[datetime | None] = mapped_column(

        DateTime(timezone=True),

        nullable=True
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(

        "User",

        back_populates="scan_jobs"
    )

    reports = relationship(

        "Report",

        back_populates="scan_job",

        cascade="all, delete-orphan"
    )