# pyrefly: ignore [missing-import]
from sqlalchemy import create_engine
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import sessionmaker

from settings import settings


# =====================================================
# NORMALISE DATABASE_URL
# Supabase often provides postgresql+asyncpg:// URLs.
# We use synchronous psycopg2, so strip any driver suffix.
# =====================================================
def _get_sync_url(url: str) -> str:
    """Ensure we always use the psycopg2 (sync) driver."""
    if url.startswith("postgresql+asyncpg://"):
        return url.replace("postgresql+asyncpg://", "postgresql://", 1)
    if url.startswith("postgres://"):
        # Heroku-style shorthand
        return url.replace("postgres://", "postgresql://", 1)
    return url


DATABASE_URL = _get_sync_url(settings.DATABASE_URL)


# =====================================================
# ENGINE
# =====================================================
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"timeout": 10}
else:
    connect_args = {
        "connect_timeout": 10,
        "options": "-c statement_timeout=30000"
    }

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args=connect_args
)


# =====================================================
# SESSION LOCAL
# =====================================================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# =====================================================
# GET DB — FastAPI dependency
# =====================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
