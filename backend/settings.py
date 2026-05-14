from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(
    BaseSettings
):

    # =====================================================
    # APP
    # =====================================================

    APP_NAME: str = "ScanTrace"

    APP_ENV: str = "development"

    DEBUG: bool = True

    HOST: str = "0.0.0.0"

    PORT: int = 8000

    # =====================================================
    # DATABASE
    # =====================================================

    POSTGRES_HOST: str

    POSTGRES_PORT: int

    POSTGRES_DB: str

    POSTGRES_USER: str

    POSTGRES_PASSWORD: str

    # =====================================================
    # JWT
    # =====================================================

    JWT_SECRET_KEY: str

    JWT_REFRESH_SECRET_KEY: str

    JWT_ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # =====================================================
    # SMTP
    # =====================================================

    SMTP_SERVER: str

    SMTP_PORT: int

    SMTP_USERNAME: str

    SMTP_PASSWORD: str

    SMTP_FROM: str

    SMTP_FROM_NAME: str

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

    FRONTEND_URL: str

    # =====================================================
    # PYDANTIC CONFIG
    # =====================================================

    model_config = ConfigDict(

        env_file=".env",

        extra="ignore"
    )


settings = Settings()