from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Response
from fastapi import status

from fastapi.responses import FileResponse

# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from db.client import get_db
from models.user import User


from models.profile import Profile
from models.report import Report

from schemas.report import ReportDetailResponse

from services.report_service import ReportService
from services.file_service import FileService
from services.comparison_service import ComparisonService
from services.report_delete_service import ReportDeleteService
from services.pdf_export_service import PDFExportService

from dependencies.auth import get_current_user


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
    current_user: User = Depends(get_current_user)
):

    report = ReportService.get_report_details(
        db,
        str(report_id),
        current_user
    )

    if not report:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    return report


# =====================================================
# DOWNLOAD ORIGINAL REPORT
# =====================================================

@router.get(
    "/{report_id}/download"
)
def download_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    report = ReportService.get_report_details(
        db,
        str(report_id),
        current_user
    )

    if not report:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    file_response = FileService.get_report_file(
        report
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
    current_user: User = Depends(get_current_user)
):

    current_report = ReportService.get_report_details(
        db,
        str(report_id),
        current_user
    )

    if not current_report:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    previous_report = (
        ComparisonService.get_previous_report(
            db,
            current_report
        )
    )

    if not previous_report:

        return {
            "success": True,
            "message": (
                "No previous report available "
                "for comparison"
            ),
            "data": {}
        }

    comparison_data = (
        ComparisonService.compare_reports(
            current_report,
            previous_report
        )
    )

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
# DELETE REPORT
# =====================================================

@router.delete(
    "/{report_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    report = ReportService.get_report_details(
        db,
        str(report_id),
        current_user
    )

    if not report:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    if report.profile.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this report."
        )

    ReportDeleteService.delete_report(
        db,
        report
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )


# =====================================================
# EXPORT HEALTH SUMMARY PDF
# =====================================================

@router.get(
    "/{report_id}/export-summary"
)
def export_report_summary(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    report = ReportService.get_report_details(
        db,
        str(report_id),
        current_user
    )

    if not report:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    pdf_path = (
        PDFExportService.export_report_summary(
            report
        )
    )

    return FileResponse(
        path=pdf_path,
        filename=f"health_summary_{report.id}.pdf",
        media_type="application/pdf"
    )