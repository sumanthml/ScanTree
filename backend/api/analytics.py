from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.client import get_db

from dependencies.auth import get_current_user

from models.user import User
from services.analytics_service import AnalyticsService


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# =====================================================
# PROFILE ANALYTICS — TRENDS
# =====================================================

@router.get("/profile/{profile_id}/trends")
def get_profile_trends(
    profile_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from services.profile_service import ProfileService
    profile = ProfileService.get_profile_by_id(db, profile_id, current_user)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found or access denied"
        )

    analytics = AnalyticsService.get_profile_analytics(db, profile_id)

    return {
        "success": True,
        "data": analytics
    }


# =====================================================
# LIGHTWEIGHT OVERVIEW
# =====================================================

@router.get("/overview/{profile_id}")
def get_overview(
    profile_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from services.profile_service import ProfileService
    profile = ProfileService.get_profile_by_id(db, profile_id, current_user)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found or access denied"
        )

    analytics = AnalyticsService.get_profile_analytics(db, profile_id)

    return {
        "success": True,
        "data": {
            "overview": analytics["overview"],
            "history": analytics["history"]
        }
    }