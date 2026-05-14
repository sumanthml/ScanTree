from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from db.client import get_db

from models.user import User
from models.profile import Profile
from models.report import Report

from fastapi import Response

from services.report_delete_service import (
    ReportDeleteService
)

from schemas.report import (
    ReportDetailResponse
)

from services.comparison_service import (
    ComparisonService
)

from services.report_service import (
    ReportService
)

from services.file_service import (
    FileService
)

from utils.dependencies import (
    get_current_user
)

from fastapi.responses import FileResponse

from services.pdf_export_service import (
    PDFExportService
)


router = APIRouter(

    prefix="/reports",

    tags=["Reports"]
)


# =====================================================
# GET REPORT DETAILS
# =====================================================

@router.get(
    "/{report_id}",
    response_model=ReportDetailResponse
)
def get_report_details(

    report_id: UUID,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    report = (
        ReportService.get_report_details(
            db,
            str(report_id),
            current_user
        )
    )

    if not report:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Report not found"
        )

    return report


# =====================================================
# DOWNLOAD REPORT FILE
# =====================================================

@router.get(
    "/{report_id}/download"
)
def download_report(

    report_id: UUID,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    # =================================================
    # GET REPORT
    # =================================================

    report = (
        ReportService.get_report_details(
            db,
            str(report_id),
            current_user
        )
    )

    if not report:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Report not found"
        )

    # =================================================
    # RETURN FILE
    # =================================================

    file_response = (
        FileService.get_report_file(
            report
        )
    )

    if not file_response:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Report file not found"
        )

    return file_response


# =====================================================
# REPORT COMPARISON
# =====================================================

@router.get(
    "/{report_id}/comparison"
)
def compare_report(

    report_id: UUID,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    # =================================================
    # GET CURRENT REPORT
    # =================================================

    current_report = (

        db.query(Report)

        .join(
            Profile,
            Report.profile_id == Profile.id
        )

        .filter(

            Report.id == report_id,

            Profile.user_id
            ==
            current_user.id
        )

        .first()
    )

    if not current_report:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Report not found"
        )

    # =================================================
    # GET PREVIOUS REPORT
    # =================================================

    previous_report = (
        ComparisonService.get_previous_report(
            db,
            current_report
        )
    )

    # =================================================
    # NO PREVIOUS REPORT
    # =================================================

    if not previous_report:

        return {

            "success": True,

            "message": (
                "No previous report "
                "available for comparison"
            ),

            "data": {}
        }
    
    # =====================================================
# DELETE REPORT
# =====================================================

@router.delete(
    "/{report_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_report(

    report_id: UUID,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    # =================================================
    # GET REPORT
    # =================================================

    report = (
        ReportService.get_report_details(
            db,
            str(report_id),
            current_user
        )
    )

    if not report:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Report not found"
        )

    # =================================================
    # DELETE REPORT
    # =================================================

    ReportDeleteService.delete_report(
        db,
        report
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )
    # =================================================
    # COMPARE REPORTS
    # =================================================

    comparison_data = (
        ComparisonService.compare_reports(
            current_report,
            previous_report
        )
    )

    # =================================================
    # RESPONSE
    # =================================================

    return {

        "success": True,

        "data": {

            "current_report_id":
                str(current_report.id),

            "previous_report_id":
                str(previous_report.id),

            "comparison":
                comparison_data
        }
    }

     # =====================================================
# EXPORT REPORT SUMMARY PDF
# =====================================================

@router.get(
    "/{report_id}/export-summary"
)
def export_report_summary(

    report_id: UUID,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    # =================================================
    # GET REPORT
    # =================================================

    report = (
        ReportService.get_report_details(
            db,
            str(report_id),
            current_user
        )
    )

    if not report:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Report not found"
        )

    # =================================================
    # GENERATE PDF
    # =================================================

    pdf_path = (
        PDFExportService
        .export_report_summary(
            report
        )
    )

    return FileResponse(

        path=pdf_path,

        filename=(
            f"health_summary_"
            f"{report.id}.pdf"
        ),

        media_type="application/pdf"
    )