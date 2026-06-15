from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):

    # =====================================================
    # APP
    # =====================================================
    APP_NAME: str = "ScanTrace"
    APP_ENV: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # =====================================================
    # DATABASE (Direct URL — from Supabase)
    # =====================================================
    DATABASE_URL: str

    # =====================================================
    # SUPABASE
    # =====================================================
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_BUCKET_NAME: str = "reports"

    # =====================================================
    # FIREBASE
    # =====================================================
    FIREBASE_CREDENTIALS_JSON: str
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_STORAGE_BUCKET: str = ""

    # =====================================================
    # JWT (kept for legacy compatibility)
    # =====================================================
    JWT_SECRET_KEY: str = "unused"
    JWT_REFRESH_SECRET_KEY: str = "unused"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # =====================================================
    # SMTP
    # =====================================================
    SMTP_SERVER: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""
    SMTP_FROM_NAME: str = "ScanTrace"

    # =====================================================
    # AI
    # =====================================================
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-2.5-flash"
    AI_PROVIDER: str = "gemini"

    # =====================================================
    # STORAGE
    # =====================================================
    UPLOAD_DIR: str = "uploads"

    # =====================================================
    # FRONTEND
    # =====================================================
    FRONTEND_URL: str = "http://localhost:8081"

    # =====================================================
    # PYDANTIC CONFIG
    # =====================================================
    model_config = ConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()