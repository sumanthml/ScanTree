from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query
from fastapi import Response
from fastapi import status

from sqlalchemy.orm import Session

from db.client import get_db

from models.user import User

from schemas.profile import (
    CreateProfileRequest,
    UpdateProfileRequest,
    ProfileResponse
)

from services.profile_service import (
    ProfileService
)

from services.report_service import (
    ReportService
)

from utils.dependencies import (
    get_current_user
)


router = APIRouter(

    prefix="/profiles",

    tags=["Profiles"]
)


# =====================================================
# GET ALL PROFILES
# =====================================================

@router.get(
    "/",
    response_model=list[ProfileResponse]
)
def get_profiles(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    profiles = (

        ProfileService.get_profiles(
            db,
            current_user
        )
    )

    return profiles


# =====================================================
# GET PROFILE BY ID
# =====================================================

@router.get(
    "/{profile_id}",
    response_model=ProfileResponse
)
def get_profile(

    profile_id: UUID,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    profile = (

        ProfileService.get_profile_by_id(
            db,
            profile_id,
            current_user
        )
    )

    if not profile:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Profile not found"
        )

    return profile


# =====================================================
# GET PROFILE REPORTS
# =====================================================

@router.get(
    "/{profile_id}/reports"
)
def get_profile_reports(

    profile_id: UUID,

    page: int = Query(
        default=1,
        ge=1
    ),

    page_size: int = Query(
        default=10,
        ge=1,
        le=100
    ),

    report_type: str | None = Query(
        default=None
    ),

    min_health_score: int | None = Query(
        default=None,
        ge=0,
        le=100
    ),

    max_health_score: int | None = Query(
        default=None,
        ge=0,
        le=100
    ),

    sort_by: str = Query(
        default="created_at"
    ),

    sort_order: str = Query(
        default="desc"
    ),

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    # =================================================
    # VERIFY PROFILE OWNERSHIP
    # =================================================

    profile = (

        ProfileService.get_profile_by_id(
            db,
            profile_id,
            current_user
        )
    )

    if not profile:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Profile not found"
        )

    # =================================================
    # GET PAGINATED REPORTS
    # =================================================

    reports = (

        ReportService
        .get_paginated_reports_for_profile(

            db=db,

            profile_id=str(profile_id),

            current_user=current_user,

            page=page,

            page_size=page_size,

            report_type=report_type,

            min_health_score=min_health_score,

            max_health_score=max_health_score,

            sort_by=sort_by,

            sort_order=sort_order
        )
    )

    return {

        "success": True,

        **reports
    }


# =====================================================
# CREATE PROFILE
# =====================================================

@router.post(
    "/",
    response_model=ProfileResponse,
    status_code=status.HTTP_201_CREATED
)
def create_profile(

    payload: CreateProfileRequest,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    profile = (

        ProfileService.create_profile(
            db,
            payload,
            current_user
        )
    )

    return profile


# =====================================================
# UPDATE PROFILE
# =====================================================

@router.patch(
    "/{profile_id}",
    response_model=ProfileResponse
)
def update_profile(

    profile_id: UUID,

    payload: UpdateProfileRequest,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    profile = (

        ProfileService.get_profile_by_id(
            db,
            profile_id,
            current_user
        )
    )

    if not profile:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Profile not found"
        )

    updated_profile = (

        ProfileService.update_profile(
            db,
            profile,
            payload
        )
    )

    return updated_profile


# =====================================================
# DELETE PROFILE
# =====================================================

@router.delete(
    "/{profile_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_profile(

    profile_id: UUID,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    profile = (

        ProfileService.get_profile_by_id(
            db,
            profile_id,
            current_user
        )
    )

    if not profile:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Profile not found"
        )

    # =================================================
    # PREVENT PRIMARY PROFILE DELETION
    # =================================================

    if profile.relationship_type == "Self":

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail=(
                "Primary self profile "
                "cannot be deleted"
            )
        )

    ProfileService.delete_profile(
        db,
        profile
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )