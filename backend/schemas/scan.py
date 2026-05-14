from uuid import UUID

from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict


# =====================================================
# SCAN UPLOAD REQUEST
# =====================================================

class ScanUploadRequest(
    BaseModel
):

    profile_id: UUID


# =====================================================
# SCAN UPLOAD RESPONSE
# =====================================================

class ScanUploadResponse(
    BaseModel
):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    original_filename: str

    stored_filename: str

    file_size: int

    mime_type: str

    status: str

    created_at: datetime


# =====================================================
# SCAN STATUS RESPONSE
# =====================================================

class ScanStatusResponse(
    BaseModel
):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    status: str

    progress: int

    current_stage: str | None

    error_message: str | None