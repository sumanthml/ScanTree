from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import File
from fastapi import Form
from fastapi import HTTPException
from fastapi import UploadFile
from fastapi import status

from sqlalchemy.orm import Session

from db.client import get_db

from dependencies.auth import (
    get_current_user
)

from models.user import User
from models.profile import Profile
from models.scan_job import ScanJob

from schemas.scan import (
    ScanUploadResponse,
    ScanStatusResponse
)

from services.upload_service import (
    UploadService
)


router = APIRouter(

    prefix="/scans",

    tags=["Scans"]
)


# =====================================================
# UPLOAD SCAN
# =====================================================

@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED
)
async def upload_scan(

    profile_id: UUID = Form(...),

    file: UploadFile = File(...),

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    )
):

    try:

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

                status_code=404,

                detail="Profile not found"
            )

        # =================================================
        # PROCESS UPLOAD
        # =================================================

        scan_job = (

            await UploadService.upload_scan(

                db=db,

                file=file,

                user_id=str(current_user.id),

                profile_id=str(profile.id)
            )
        )

        return {

            "success": True,

            "message":
                "File uploaded successfully",

            "data":

                ScanUploadResponse
                .model_validate(
                    scan_job
                )
        }

    except ValueError as error:

        raise HTTPException(

            status_code=400,

            detail=str(error)
        )

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(

            status_code=500,

            detail=str(error)
        )


# =====================================================
# GET SCAN STATUS
# =====================================================

@router.get(
    "/{scan_job_id}/status"
)
def get_scan_status(

    scan_job_id: UUID,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    )
):

    scan_job = (

        db.query(ScanJob)

        .filter(

            ScanJob.id == scan_job_id,

            ScanJob.user_id
            ==
            current_user.id
        )

        .first()
    )

    if not scan_job:

        raise HTTPException(

            status_code=404,

            detail="Scan job not found"
        )

    return {

        "success": True,

        "data":

            ScanStatusResponse
            .model_validate(
                scan_job
            )
    }