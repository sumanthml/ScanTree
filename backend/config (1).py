from dotenv import load_dotenv
import os

load_dotenv()


class Settings:

    APP_NAME = os.getenv(
        "APP_NAME"
    )

    POSTGRES_HOST = os.getenv(
        "POSTGRES_HOST"
    )

    POSTGRES_PORT = os.getenv(
        "POSTGRES_PORT"
    )

    POSTGRES_DB = os.getenv(
        "POSTGRES_DB"
    )

    POSTGRES_USER = os.getenv(
        "POSTGRES_USER"
    )

    POSTGRES_PASSWORD = os.getenv(
        "POSTGRES_PASSWORD"
    )

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY"
    )

    JWT_ALGORITHM = os.getenv(
        "JWT_ALGORITHM"
    )

    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv(
            "ACCESS_TOKEN_EXPIRE_MINUTES"
        )
    )

    AI_PROVIDER = os.getenv(
        "AI_PROVIDER"
    )

    GEMINI_API_KEY = os.getenv(
        "GEMINI_API_KEY"
    )

    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL"
    )

    DATABASE_URL = (
        f"postgresql://"
        f"{POSTGRES_USER}:"
        f"{POSTGRES_PASSWORD}@"
        f"{POSTGRES_HOST}:"
        f"{POSTGRES_PORT}/"
        f"{POSTGRES_DB}"
    )


settings = Settings()