from sqlalchemy import DECIMAL
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import Text

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from db.base import Base
from db.base import TimestampMixin
from db.base import UUIDMixin


class AIInsight(

    Base,

    UUIDMixin,

    TimestampMixin
):

    __tablename__ = "ai_insights"

    # =====================================================
    # RELATION
    # =====================================================

    report_id: Mapped[str] = mapped_column(

        ForeignKey(
            "reports.id",
            ondelete="CASCADE"
        ),

        nullable=False,

        index=True
    )

    # =====================================================
    # LEGACY FIELDS
    # TEMPORARY FOR MIGRATION
    # =====================================================

    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    risk_level: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True
    )

    recommendations: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # =====================================================
    # NORMALIZED FIELDS
    # =====================================================

    insight_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True
    )

    title: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    severity: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True
    )

    recommendation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # =====================================================
    # SHARED FIELDS
    # =====================================================

    confidence_score: Mapped[float | None] = mapped_column(
        DECIMAL(5, 2),
        nullable=True
    )

    provider: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    # =====================================================
    # RELATIONSHIP
    # =====================================================

    report = relationship(
        "Report",
        back_populates="ai_insights"
    )