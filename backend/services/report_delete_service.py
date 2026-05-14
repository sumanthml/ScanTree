import os

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
        # DELETE STORED FILE
        # =================================================

        if (

            report.file_path

            and

            os.path.exists(
                report.file_path
            )
        ):

            try:

                os.remove(
                    report.file_path
                )

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