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

from services.profile_service import ProfileService
from services.report_service import ReportService
from services.dashboard_service import DashboardService

from dependencies.auth import get_current_user


router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"]
)


# =====================================================
# GET ALL PROFILES
# =====================================================

@router.get("")
def get_profiles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profiles = ProfileService.get_profiles(db, current_user)

    return {
        "success": True,
        "count": len(profiles),
        "data": profiles
    }


# =====================================================
# GET PROFILE BY ID
# =====================================================

@router.get("/{profile_id}")
def get_profile(
    profile_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = ProfileService.get_profile_by_id(db, profile_id, current_user)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    return {
        "success": True,
        "data": profile
    }


# =====================================================
# PROFILE DASHBOARD SUMMARY
# =====================================================

@router.get("/{profile_id}/summary")
def get_profile_summary(
    profile_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = ProfileService.get_profile_by_id(db, profile_id, current_user)

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return {
        "success": True,
        "data": DashboardService.get_profile_dashboard(db, str(profile_id))
    }


# =====================================================
# GET PROFILE REPORTS
# =====================================================

@router.get("/{profile_id}/reports")
def get_profile_reports(
    profile_id: UUID,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    report_type: str | None = Query(None),
    min_health_score: int | None = Query(None, ge=0, le=100),
    max_health_score: int | None = Query(None, ge=0, le=100),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = ProfileService.get_profile_by_id(db, profile_id, current_user)

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    reports = ReportService.get_paginated_reports_for_profile(
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

    return {
        "success": True,
        "data": reports["data"],
        "total": reports["total"],
        "pages": reports["total_pages"],
        "page": reports["page"]
    }


# =====================================================
# CREATE PROFILE
# =====================================================

@router.post("", status_code=status.HTTP_201_CREATED)
def create_profile(
    payload: CreateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = ProfileService.create_profile(db, payload, current_user)

    # Auto-bind first profile as active
    if not current_user.active_profile_id:
        current_user.active_profile_id = profile.id
        db.commit()

    return {
        "success": True,
        "message": "Profile created successfully",
        "data": profile
    }


# =====================================================
# UPDATE PROFILE
# =====================================================

@router.patch("/{profile_id}")
def update_profile(
    profile_id: UUID,
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = ProfileService.get_profile_by_id(db, profile_id, current_user)

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    updated_profile = ProfileService.update_profile(db, profile, payload)

    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": updated_profile
    }


# =====================================================
# DELETE PROFILE
# =====================================================

@router.delete("/{profile_id}")
def delete_profile(
    profile_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = ProfileService.get_profile_by_id(db, profile_id, current_user)

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if (
        profile.relationship_type and
        profile.relationship_type.lower() == "self"
    ):
        raise HTTPException(
            status_code=400,
            detail="Primary profile cannot be deleted"
        )

    ProfileService.delete_profile(db, profile, current_user)

    return {
        "success": True,
        "message": "Profile deleted successfully"
    }