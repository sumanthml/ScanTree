from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from db.client import get_db

from models.profile import Profile
from models.user import User

from services.dashboard_service import (
    DashboardService
)

from dependencies.auth import (
    get_current_user
)


router = APIRouter(

    prefix="/dashboard",

    tags=["Dashboard"]
)


# =====================================================
# PROFILE DASHBOARD
# =====================================================

@router.get(
    "/{profile_id}"
)
def get_dashboard(

    profile_id: UUID,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    # =================================================
    # VERIFY PROFILE OWNERSHIP
    # =================================================

    profile = (

        db.query(Profile)

        .filter(

            Profile.id == profile_id,

            Profile.user_id
            ==
            current_user.id
        )

        .first()
    )

    if not profile:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Profile not found"
        )

    # =================================================
    # GET DASHBOARD DATA
    # =================================================

    dashboard_data = (

        DashboardService
        .get_profile_dashboard(
            db,
            str(profile_id)
        )
    )

    return {

        "success": True,

        "data": dashboard_data
    }


# =====================================================
# HEALTH SCORE HISTORY
# =====================================================

@router.get(
    "/{profile_id}/health-score-history"
)
def get_health_score_history(

    profile_id: UUID,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    # =================================================
    # VERIFY PROFILE OWNERSHIP
    # =================================================

    profile = (

        db.query(Profile)

        .filter(

            Profile.id == profile_id,

            Profile.user_id
            ==
            current_user.id
        )

        .first()
    )

    if not profile:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Profile not found"
        )

    # =================================================
    # FETCH HISTORY
    # =================================================

    history = (

        DashboardService
        .get_health_score_history(
            db,
            str(profile_id)
        )
    )

    return {

        "success": True,

        "count": len(history),

        "data": history
    }


# =====================================================
# BIOMARKER HISTORY
# =====================================================

@router.get(
    "/{profile_id}/biomarker-history/{biomarker_name}"
)
def get_biomarker_history(

    profile_id: UUID,

    biomarker_name: str,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    # =================================================
    # VERIFY PROFILE OWNERSHIP
    # =================================================

    profile = (

        db.query(Profile)

        .filter(

            Profile.id == profile_id,

            Profile.user_id
            ==
            current_user.id
        )

        .first()
    )

    if not profile:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Profile not found"
        )

    # =================================================
    # FETCH BIOMARKER HISTORY
    # =================================================

    history = (

        DashboardService
        .get_biomarker_history(

            db,

            str(profile_id),

            biomarker_name
        )
    )

    return {

        "success": True,

        "biomarker":
            biomarker_name,

        "count":
            len(history),

        "data":
            history
    }