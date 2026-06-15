from pathlib import Path
from fastapi import HTTPException, status


ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB


# =====================================================
# STANDALONE FUNCTIONS (used by upload_service)
# =====================================================

def validate_file_extension(filename: str) -> None:
    extension = Path(filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {extension}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )


def validate_file_size(file_size: int) -> None:
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 20MB limit"
        )


# =====================================================
# CLASS-BASED (kept for backwards compat)
# =====================================================

class FileValidationService:

    @staticmethod
    def validate_file_extension(filename: str) -> None:
        validate_file_extension(filename)

    @staticmethod
    def validate_file_size(file_size: int) -> None:
        validate_file_size(file_size)