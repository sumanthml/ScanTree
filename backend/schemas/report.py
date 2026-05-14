from uuid import UUID

from datetime import date
from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict


# =====================================================
# BIOMARKER ITEM
# =====================================================

class ReportBiomarkerResponse(
    BaseModel
):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    name: str

    value: str | None

    unit: str | None

    severity: str | None

    category: str | None

    reference_range: str | None

    clinical_significance: str | None

    confidence_score: float | None


# =====================================================
# AI INSIGHT ITEM
# =====================================================

class ReportInsightResponse(
    BaseModel
):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    insight_type: str | None

    title: str | None

    description: str | None

    severity: str | None

    recommendation: str | None


# =====================================================
# REPORT DETAILS
# =====================================================

class ReportDetailResponse(
    BaseModel
):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    profile_id: UUID

    report_type: str

    hospital_name: str | None

    report_date: date | None

    health_score: int | None

    summary: str | None

    original_filename: str | None

    stored_filename: str | None

    file_path: str | None

    mime_type: str | None

    file_size: int | None

    created_at: datetime

    biomarkers: list[
        ReportBiomarkerResponse
    ]

    ai_insights: list[
        ReportInsightResponse
    ]