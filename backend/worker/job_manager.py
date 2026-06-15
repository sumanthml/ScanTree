from threading import Thread

from worker.worker import (
    process_scan_job
)


def dispatch_scan_job(
    scan_job_id: str
):
    thread = Thread(
        target=process_scan_job,
        args=(scan_job_id,)
    )

    thread.start()