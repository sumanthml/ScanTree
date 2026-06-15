from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.client import get_db
from dependencies.auth import get_current_user

from models.user import User
from services.dashboard_service import DashboardService
from services.profile_service import ProfileService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("")
@router.get("/{profile_id}")
def get_dashboard(
    profile_id: UUID | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if profile_id:
        profile = ProfileService.get_profile_by_id(db, profile_id, current_user)
        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found"
            )
        pid = str(profile.id)
    else:
        if not current_user.active_profile_id:
            raise HTTPException(
                status_code=400,
                detail="No active profile set"
            )
        pid = str(current_user.active_profile_id)

    return {
        "overview": DashboardService.get_profile_dashboard(db, pid),
        "health_history": DashboardService.get_health_score_history(db, pid),
        "critical_changes": DashboardService.get_critical_changes(db, pid),
        "risk_progression": DashboardService.get_risk_progression(db, pid),
        "biomarker_trends": [],
        "recent_reports": DashboardService.get_recent_reports(db, pid),
        "ai_summary": DashboardService.get_ai_summary(db, pid)
    }