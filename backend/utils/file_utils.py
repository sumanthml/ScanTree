from pathlib import Path

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg"
}

MAX_FILE_SIZE = 20 * 1024 * 1024


def validate_file_extension(
    filename: str
):
    extension = (
        Path(filename)
        .suffix
        .lower()
    )

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Unsupported file type"
        )


def validate_file_size(
    file_size: int
):
    if file_size > MAX_FILE_SIZE:
        raise ValueError(
            "File size exceeds 20MB limit"
        )