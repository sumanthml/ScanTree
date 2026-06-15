from uuid import uuid4
from pathlib import Path

from fastapi import UploadFile

from supabase import create_client

from settings import settings


supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY
)


class SupabaseStorage:

    @staticmethod
    async def save_file(file: UploadFile):

        extension = Path(file.filename).suffix
        stored_filename = f"{uuid4()}{extension}"
        content = await file.read()

        supabase.storage.from_(
            settings.SUPABASE_BUCKET_NAME
        ).upload(
            path=stored_filename,
            file=content,
            file_options={"content-type": file.content_type}
        )

        return {
            "stored_filename": stored_filename,
            "file_path": stored_filename,
            "file_size": len(content)
        }

    @staticmethod
    def delete_file(stored_filename: str):
        supabase.storage.from_(
            settings.SUPABASE_BUCKET_NAME
        ).remove([stored_filename])

    @staticmethod
    def get_signed_url(stored_filename: str, expires_in: int = 3600):
        response = (
            supabase.storage
            .from_(settings.SUPABASE_BUCKET_NAME)
            .create_signed_url(stored_filename, expires_in)
        )
        return response.get("signedURL")