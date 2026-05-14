import os

from fastapi.responses import FileResponse

from models.report import Report


class FileService:

    # =====================================================
    # GET REPORT FILE
    # =====================================================

    @staticmethod
    def get_report_file(
        report: Report
    ):

        if not report.file_path:

            return None

        if not os.path.exists(
            report.file_path
        ):

            return None

        filename = (

            report.original_filename

            or

            "medical_report"
        )

        return FileResponse(

            path=report.file_path,

            filename=filename,

            media_type=report.mime_type
        )