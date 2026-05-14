from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.base import Base
from db.client import engine

# =====================================================
# IMPORT MODELS
# =====================================================

from models import *

# =====================================================
# ROUTERS
# =====================================================

from routes.auth import (
    router as auth_router
)

from routes.dashboard import (
    router as dashboard_router
)

from routes.analytics import (
    router as analytics_trends_router
)

from routes.profiles import (
    router as profiles_router
)

from routes.reports import (
    router as reports_router
)

from api.scans import (
    router as scans_router
)

from api.biomarkers import (
    router as biomarkers_router
)

from api.analytics import (
    router as analytics_router
)

from api.insights import (
    router as insights_router
)

# =====================================================
# FASTAPI
# =====================================================

app = FastAPI(

    title="ScanTrace API",

    version="1.0.0"
)

# =====================================================
# CORS
# =====================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:8081",

        "http://127.0.0.1:8081",

        "http://localhost:3000",

        "http://127.0.0.1:3000"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# =====================================================
# ROUTERS
# =====================================================

app.include_router(auth_router)

app.include_router(dashboard_router)

app.include_router(analytics_trends_router)

app.include_router(profiles_router)

app.include_router(reports_router)

app.include_router(scans_router)

app.include_router(biomarkers_router)

app.include_router(analytics_router)

app.include_router(insights_router)

# =====================================================
# STARTUP
# =====================================================

@app.on_event("startup")
def startup():

    Base.metadata.create_all(
        bind=engine
    )

# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():

    return {

        "success": True,

        "message":
            "ScanTrace Backend Running"
    }

# =====================================================
# DB CHECK
# =====================================================

@app.get("/db-check")
def db_check():

    try:

        connection = engine.connect()

        connection.close()

        return {

            "success": True,

            "message":
                "Database connected successfully"
        }

    except Exception as e:

        return {

            "success": False,

            "error":
                str(e)
        }