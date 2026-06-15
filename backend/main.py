from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.base import Base
from db.client import engine

# =====================================================
# FIREBASE INIT
# =====================================================
from core.firebase import initialize_firebase

# =====================================================
# IMPORT ALL MODELS (so Base.metadata knows them)
# =====================================================
from models.user import User
from models.profile import Profile
from models.scan_job import ScanJob
from models.report import Report
from models.biomarker import Biomarker
from models.ai_insight import AIInsight
from models.notification import Notification
from models.shared_access import SharedAccess
from models.reference_biomarker import ReferenceBiomarker

# =====================================================
# ROUTERS — routes/ (Firebase-auth based)
# =====================================================
from routes.auth import router as auth_router
from routes.notification import router as notification_router
from routes.dashboard import router as dashboard_router
from routes.profiles import router as profiles_router
from routes.reports import router as reports_router
from routes.access import router as access_router

# =====================================================
# ROUTERS — api/ (resource endpoints)
# =====================================================
from api.scans import router as scans_router
from api.biomarkers import router as biomarkers_router
from api.analytics import router as analytics_router
from api.insights import router as insights_router


# =====================================================
# FASTAPI APP
# =====================================================
app = FastAPI(
    title="ScanTrace API",
    version="1.0.0",
    description="Medical lab report intelligence platform"
)

import time
from fastapi import Request

@app.middleware("http")
async def log_request_time(request: Request, call_next):
    start_time = time.time()
    path = request.url.path
    print(f"[Request Start] {request.method} {path}", flush=True)
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        print(f"[Request End] {request.method} {path} - Completed in {process_time:.4f}s with status {response.status_code}", flush=True)
        return response
    except Exception as e:
        process_time = time.time() - start_time
        print(f"[Request Error] {request.method} {path} - Failed in {process_time:.4f}s: {e}", flush=True)
        raise


# =====================================================
# CORS
# =====================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "http://localhost:19006",
        "http://127.0.0.1:19006",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",  # allow Expo Go / physical devices during dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# INCLUDE ROUTERS
# =====================================================
app.include_router(auth_router)
app.include_router(notification_router)
app.include_router(dashboard_router)
app.include_router(profiles_router)
app.include_router(reports_router)
app.include_router(access_router)
app.include_router(scans_router)
app.include_router(biomarkers_router)
app.include_router(analytics_router)
app.include_router(insights_router)


# =====================================================
# STARTUP
# =====================================================
@app.on_event("startup")
def startup():
    """
    1. Initialize Firebase Admin SDK
    2. Create all DB tables (idempotent — safe to run every start)
    """
    initialize_firebase()
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        # Tables may already exist on Supabase; log but don't crash
        print(f"[startup] DB create_all skipped: {e}")

    # Auto-migration: ensure shared_access has status column
    from sqlalchemy import text
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE shared_access ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';"))
            # Make sure existing records are 'accepted' so we don't break existing features
            conn.execute(text("UPDATE shared_access SET status = 'accepted' WHERE status IS NULL;"))
            conn.commit()
            print("[startup] DB auto-migration: status column checked/added to shared_access table")
    except Exception as e:
        print(f"[startup] DB auto-migration error: {e}")


# =====================================================
# ROOT
# =====================================================
@app.get("/")
def root():
    return {
        "success": True,
        "message": "ScanTrace API is running",
        "auth": "Firebase",
        "database": "Supabase / PostgreSQL"
    }


# =====================================================
# HEALTH CHECK
# =====================================================
@app.get("/health")
def health_check():
    try:
        connection = engine.connect()
        connection.close()
        return {"success": True, "database": "connected"}
    except Exception as e:
        return {"success": False, "database": "error", "detail": str(e)}