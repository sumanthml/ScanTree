from uuid import UUID

from fastapi import UploadFile
from sqlalchemy.orm import Session

from models.user import User
from models.scan_job import ScanJob
from models.profile import Profile

from storage.supabase_storage import SupabaseStorage

from utils.file_utils import (
    validate_file_extension,
    validate_file_size
)

from worker.job_manager import (
    dispatch_scan_job
)


class UploadService:

    @staticmethod
    async def upload_scan(
        db: Session,
        file: UploadFile,
        user: User,
        profile_id: UUID
    ):
        # =====================================================
        # VERIFY PROFILE OWNERSHIP
        # =====================================================
        profile = (
            db.query(Profile)
            .filter(
                Profile.id == profile_id,
                Profile.user_id == user.id
            )
            .first()
        )

        if not profile:
            raise ValueError("Profile not found or access denied")

        # =====================================================
        # VALIDATE FILE EXTENSION
        # =====================================================
        validate_file_extension(file.filename)

        # =====================================================
        # SAVE FILE TO SUPABASE STORAGE
        # =====================================================
        storage_result = await SupabaseStorage.save_file(file)

        # =====================================================
        # VALIDATE FILE SIZE
        # =====================================================
        validate_file_size(storage_result["file_size"])

        try:
            # =================================================
            # CREATE SCAN JOB
            # =================================================
            scan_job = ScanJob(
                user_id=user.id,
                profile_id=str(profile_id),
                original_filename=file.filename,
                stored_filename=storage_result["stored_filename"],
                file_path=storage_result["file_path"],
                file_size=storage_result["file_size"],
                mime_type=file.content_type,
                status="UPLOADED",
                progress=0,
                current_stage="Uploaded"
            )

            db.add(scan_job)
            db.commit()
            db.refresh(scan_job)

        except Exception:
            db.rollback()
            raise

        # =====================================================
        # DISPATCH BACKGROUND PROCESSING (threaded)
        # =====================================================
        dispatch_scan_job(str(scan_job.id))

        return scan_job