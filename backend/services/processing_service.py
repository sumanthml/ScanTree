from sqlalchemy.orm import Session
from datetime import datetime

from models.scan_job import ScanJob


class ProcessingService:

    # =====================================================
    # START PROCESSING
    # =====================================================
    @staticmethod
    def start_processing(
        db: Session,
        scan_job: ScanJob
    ):

        scan_job.status = "PROCESSING"
        scan_job.progress = 5
        scan_job.current_stage = "Queued → Processing started"
        scan_job.started_at = datetime.utcnow()

        db.add(scan_job)
        db.commit()
        db.refresh(scan_job)

        return scan_job

    # =====================================================
    # UPDATE STAGE PROGRESS (IMPORTANT ADDITION)
    # =====================================================
    @staticmethod
    def update_stage(
        db: Session,
        scan_job: ScanJob,
        stage: str,
        progress: int
    ):

        scan_job.current_stage = stage
        scan_job.progress = min(max(progress, 0), 100)

        db.add(scan_job)
        db.commit()
        db.refresh(scan_job)

        return scan_job

    # =====================================================
    # COMPLETE PROCESSING
    # =====================================================
    @staticmethod
    def complete_processing(
        db: Session,
        scan_job: ScanJob
    ):

        scan_job.status = "COMPLETED"
        scan_job.progress = 100
        scan_job.current_stage = "All pipeline stages completed"
        scan_job.completed_at = datetime.utcnow()

        db.add(scan_job)
        db.commit()
        db.refresh(scan_job)

        return scan_job

    # =====================================================
    # FAIL PROCESSING
    # =====================================================
    @staticmethod
    def fail_processing(
        db: Session,
        scan_job: ScanJob,
        error_message: str
    ):

        scan_job.status = "FAILED"
        scan_job.error_message = error_message
        scan_job.current_stage = "Processing failed"
        scan_job.failed_at = datetime.utcnow()

        db.add(scan_job)
        db.commit()
        db.refresh(scan_job)

        return scan_job