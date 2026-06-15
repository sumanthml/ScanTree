from sqlalchemy import String, Float, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, UUIDMixin, TimestampMixin


class Biomarker(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "biomarkers"

    report_id: Mapped[str] = mapped_column(ForeignKey("reports.id"))

    name: Mapped[str] = mapped_column(String)
    value: Mapped[str | None] = mapped_column(String)
    unit: Mapped[str | None] = mapped_column(String)
    severity: Mapped[str | None] = mapped_column(String)

    category: Mapped[str | None] = mapped_column(String)
    reference_range: Mapped[str | None] = mapped_column(String)

    clinical_significance: Mapped[str | None] = mapped_column(Text)

    confidence_score: Mapped[float | None] = mapped_column(Float)

    report = relationship("Report", back_populates="biomarkers")