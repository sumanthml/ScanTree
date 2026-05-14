from fastapi import UploadFile

from sqlalchemy.orm import Session

from models.scan_job import ScanJob

from storage.local_storage import (
    LocalStorage
)

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

        user_id: str,

        profile_id: str
    ):

        # =================================================
        # VALIDATE FILE EXTENSION
        # =================================================

        validate_file_extension(
            file.filename
        )

        # =================================================
        # SAVE FILE
        # =================================================

        storage_result = (
            await LocalStorage.save_file(
                file
            )
        )

        # =================================================
        # VALIDATE FILE SIZE
        # =================================================

        validate_file_size(
            storage_result[
                "file_size"
            ]
        )

        # =================================================
        # CREATE SCAN JOB
        # =================================================

        scan_job = ScanJob(

            user_id=user_id,

            original_filename=(
                file.filename
            ),

            stored_filename=(
                storage_result[
                    "stored_filename"
                ]
            ),

            file_path=(
                storage_result[
                    "file_path"
                ]
            ),

            file_size=(
                storage_result[
                    "file_size"
                ]
            ),

            mime_type=(
                file.content_type
            ),

            status="UPLOADED"
        )

        db.add(scan_job)

        db.commit()

        db.refresh(scan_job)

        # =================================================
        # DISPATCH BACKGROUND PROCESSING
        # =================================================

        dispatch_scan_job(
            str(scan_job.id)
        )

        # =================================================
        # RETURN SCAN JOB
        # =================================================

        return scan_job