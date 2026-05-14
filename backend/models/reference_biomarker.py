from sqlalchemy import String
from sqlalchemy import Float

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from db.base import Base
from db.base import UUIDMixin
from db.base import TimestampMixin


class ReferenceBiomarker(
    Base,
    UUIDMixin,
    TimestampMixin
):
    __tablename__ = "reference_biomarkers"

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )

    aliases: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    category: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True
    )

    unit: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    min_value: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    max_value: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    gender: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    age_group: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    description: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True
    )