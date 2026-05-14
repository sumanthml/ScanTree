from sqlalchemy.orm import Session

from models.scan_job import ScanJob


class ProcessingService:

    @staticmethod
    def start_processing(
        db: Session,
        scan_job: ScanJob
    ):
        scan_job.status = "PROCESSING"

        scan_job.progress = 10

        scan_job.current_stage = (
            "Initializing processing"
        )

        db.commit()

        return scan_job

    @staticmethod
    def complete_processing(
        db: Session,
        scan_job: ScanJob
    ):
        scan_job.status = "COMPLETED"

        scan_job.progress = 100

        scan_job.current_stage = (
            "Completed"
        )

        db.commit()

        return scan_job

    @staticmethod
    def fail_processing(
        db: Session,
        scan_job: ScanJob,
        error_message: str
    ):
        scan_job.status = "FAILED"

        scan_job.error_message = error_message

        db.commit()

        return scan_job