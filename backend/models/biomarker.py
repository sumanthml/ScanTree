import uuid

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy import Float

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import relationship

from db.base import Base


class Biomarker(Base):

    __tablename__ = "biomarkers"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    report_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reports.id"),
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    value = Column(
        String,
        nullable=True
    )

    unit = Column(
        String,
        nullable=True
    )

    severity = Column(
        String,
        nullable=True
    )

    category = Column(
        String,
        nullable=True
    )

    reference_range = Column(
        String,
        nullable=True
    )

    clinical_significance = Column(
        Text,
        nullable=True
    )

    confidence_score = Column(
        Float,
        nullable=True
    )

    report = relationship(
        "Report",
        back_populates="biomarkers"
    )