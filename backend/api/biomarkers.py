from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query
from fastapi import status

from sqlalchemy import asc
from sqlalchemy.orm import Session

from db.client import get_db

from dependencies.auth import get_current_user

from models.user import User
from models.profile import Profile
from models.report import Report
from models.biomarker import Biomarker

from services.biomarker_history_service import BiomarkerHistoryService


router = APIRouter(
    prefix="/biomarkers",
    tags=["Biomarkers"]
)


# =====================================================
# GET ALL BIOMARKERS
# =====================================================

@router.get("/")
def get_biomarkers(
    category: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    limit: int = Query(default=100, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from services.profile_service import ProfileService
    profiles = ProfileService.get_profiles(db, current_user)
    profile_ids = [p["id"] for p in profiles]

    query = (
        db.query(Biomarker)
        .join(Report, Biomarker.report_id == Report.id)
        .filter(Report.profile_id.in_(profile_ids))
    )

    if category:
        query = query.filter(Biomarker.category.ilike(category))

    if severity:
        query = query.filter(Biomarker.severity.ilike(severity))

    biomarkers = (
        query
        .order_by(Biomarker.name.asc())
        .limit(limit)
        .all()
    )

    return {
        "success": True,
        "count": len(biomarkers),
        "filters": {"category": category, "severity": severity},
        "data": [
            {
                "id": str(b.id),
                "report_id": str(b.report_id),
                "name": b.name,
                "value": b.value,
                "unit": b.unit,
                "severity": b.severity,
                "category": b.category,
                "reference_range": b.reference_range,
                "clinical_significance": b.clinical_significance,
                "confidence_score": b.confidence_score
            }
            for b in biomarkers
        ]
    }


# =====================================================
# GET BIOMARKER HISTORY
# =====================================================

@router.get("/history/{profile_id}/{biomarker_name}")
def get_biomarker_history(
    profile_id: UUID,
    biomarker_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from services.profile_service import ProfileService
    profile = ProfileService.get_profile_by_id(db, profile_id, current_user)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found or access denied"
        )

    history = BiomarkerHistoryService.get_biomarker_history(
        db=db,
        profile_id=str(profile_id),
        biomarker_name=biomarker_name
    )

    return {
        "success": True,
        "data": {
            "profile_id": str(profile_id),
            "biomarker_name": biomarker_name,
            "history": history
        }
    }


# =====================================================
# GET BIOMARKER CATEGORIES
# =====================================================

@router.get("/categories/list")
def get_biomarker_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from services.profile_service import ProfileService
    profiles = ProfileService.get_profiles(db, current_user)
    profile_ids = [p["id"] for p in profiles]

    categories = (
        db.query(Biomarker.category)
        .join(Report, Biomarker.report_id == Report.id)
        .filter(Report.profile_id.in_(profile_ids))
        .distinct()
        .all()
    )

    cleaned_categories = [c[0] for c in categories if c[0]]

    return {
        "success": True,
        "count": len(cleaned_categories),
        "data": cleaned_categories
    }