from storage.supabase_storage import SupabaseStorage
from sqlalchemy.orm import Session
from models.report import Report


class ReportDeleteService:

    # =====================================================
    # DELETE REPORT
    # =====================================================

    @staticmethod
    def delete_report(

        db: Session,

        report: Report
    ):

        # =================================================
        # DELETE STORED FILE FROM SUPABASE
        # =================================================

        if report.file_path:

            try:

                SupabaseStorage.delete_file(report.file_path)

            except Exception:

                pass

        # =================================================
        # DELETE REPORT
        # CASCADE removes:
        # biomarkers
        # ai_insights
        # =================================================

        db.delete(report)

        db.commit()

        return True