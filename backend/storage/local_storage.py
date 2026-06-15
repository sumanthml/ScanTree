
import os
import uuid

from pathlib import Path

import aiofiles

from fastapi import UploadFile


UPLOAD_DIR = "uploads/originals"

Path(UPLOAD_DIR).mkdir(
    parents=True,
    exist_ok=True
)


class LocalStorage:

    @staticmethod
    async def save_file(
        file: UploadFile
    ):
        extension = (
            Path(file.filename)
            .suffix
        )

        stored_filename = (
            f"{uuid.uuid4()}{extension}"
        )

        file_path = os.path.join(
            UPLOAD_DIR,
            stored_filename
        )

        content = await file.read()

        async with aiofiles.open(
            file_path,
            "wb"
        ) as out_file:
            await out_file.write(content)

        return {
            "stored_filename": stored_filename,
            "file_path": file_path,
            "file_size": len(content)
        }