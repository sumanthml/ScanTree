from sqlalchemy.orm import Session, joinedload

from models.report import Report
from services.pdf_export_service import PDFExportService


class PDFService:

    # =====================================================
    # EXPORT REPORT BY ID
    # =====================================================
    @staticmethod
    def export_report(
        db: Session,
        report_id: str
    ) -> str:

        report = (
            db.query(Report)
            .options(
                joinedload(Report.biomarkers),
                joinedload(Report.ai_insights)
            )
            .filter(Report.id == report_id)
            .first()
        )

        if not report:
            raise ValueError("Report not found")

        pdf_path = PDFExportService.export_report_summary(report)

        return pdf_path

    # =====================================================
    # EXPORT MULTIPLE REPORTS (FUTURE EXTENSION)
    # =====================================================
    @staticmethod
    def export_profile_reports(
        db: Session,
        profile_id: str
    ) -> list[str]:

        reports = (
            db.query(Report)
            .filter(Report.profile_id == profile_id)
            .order_by(Report.created_at.desc())
            .all()
        )

        paths = []

        for report in reports:
            path = PDFExportService.export_report_summary(report)
            paths.append(path)

        return paths