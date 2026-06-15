from fastapi.responses import StreamingResponse
import io
from storage.supabase_storage import supabase
from settings import settings
from models.report import Report


class FileService:

    # =====================================================
    # GET REPORT FILE
    # =====================================================
    @staticmethod
    def get_report_file(report: Report):

        if not report.file_path:
            raise FileNotFoundError("Report file path is missing")

        try:
            file_bytes = supabase.storage.from_(
                settings.SUPABASE_BUCKET_NAME
            ).download(report.file_path)
        except Exception as e:
            raise FileNotFoundError(
                f"File not found in Supabase Storage: {e}"
            )

        filename = report.original_filename or "medical_report"

        return StreamingResponse(
            io.BytesIO(file_bytes),
            media_type=report.mime_type or "application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )