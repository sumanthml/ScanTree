from sqlalchemy import DECIMAL, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, UUIDMixin, TimestampMixin


class AIInsight(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "ai_insights"

    # =====================================================
    # RELATION
    # =====================================================
    report_id: Mapped[str] = mapped_column(
        ForeignKey("reports.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # =====================================================
    # LEGACY FIELDS (migration safety)
    # =====================================================
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    risk_level: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True
    )

    recommendations: Mapped[str | None] = mapped_column(Text, nullable=True)

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

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    severity: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True
    )

    recommendation: Mapped[str | None] = mapped_column(Text, nullable=True)

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