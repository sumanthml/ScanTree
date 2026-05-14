from typing import List
from typing import Optional

from pydantic import BaseModel
from pydantic import Field


class BiomarkerSchema(
    BaseModel
):

    name: str

    value: Optional[str] = None

    unit: Optional[str] = None

    reference_range: Optional[str] = None

    status: Optional[str] = None

    category: Optional[str] = None

    clinical_significance: Optional[str] = None

    confidence_score: Optional[float] = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )


class AIResponseSchema(
    BaseModel
):

    patient_summary: str

    risk_level: str = Field(
        default="UNKNOWN"
    )

    overall_confidence_score: Optional[float] = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    biomarkers: List[
        BiomarkerSchema
    ] = []

    recommendations: List[
        str
    ] = []