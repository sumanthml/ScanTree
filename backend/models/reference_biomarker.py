from sqlalchemy import String, Float, Text
from sqlalchemy.orm import Mapped, mapped_column

from db.base import Base, UUIDMixin, TimestampMixin


class ReferenceBiomarker(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "reference_biomarkers"

    name: Mapped[str] = mapped_column(String(255), index=True)

    aliases: Mapped[str | None] = mapped_column(String(500), index=True)

    category: Mapped[str | None] = mapped_column(String(100))
    unit: Mapped[str | None] = mapped_column(String(50))

    min_value: Mapped[float | None] = mapped_column(Float)
    max_value: Mapped[float | None] = mapped_column(Float)

    gender: Mapped[str | None] = mapped_column(String(20))
    age_group: Mapped[str | None] = mapped_column(String(50))

    description: Mapped[str | None] = mapped_column(Text)
    severity_weight: Mapped[float | None] = mapped_column(Float)