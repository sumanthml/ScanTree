from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from db.client import get_db

from models.user import User

from services.analytics_service import (
    AnalyticsService
)

from utils.dependencies import (
    get_current_user
)


router = APIRouter(

    prefix="/analytics",

    tags=["Analytics"]
)


# =====================================================
# GET BIOMARKER TRENDS
# =====================================================

@router.get(
    "/profile/{profile_id}/trends"
)
def get_profile_trends(

    profile_id: UUID,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    trends = (
        AnalyticsService.get_biomarker_trends(
            db,
            str(profile_id),
            current_user
        )
    )

    if trends is None:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Profile not found"
        )

    return {

        "success": True,

        "data": trends
    }