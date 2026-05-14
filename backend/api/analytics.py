from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from sqlalchemy import func

from db.client import get_db

from dependencies.auth import (
    get_current_user
)

from models.user import User
from models.biomarker import Biomarker
from models.ai_insight import AIInsight
from models.scan_job import ScanJob


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/overview")
def get_analytics_overview(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    total_biomarkers = (
        db.query(Biomarker)
        .count()
    )

    abnormal_biomarkers = (
        db.query(Biomarker)
        .filter(
            Biomarker.severity.in_(
                [
                    "LOW",
                    "HIGH",
                    "CRITICAL"
                ]
            )
        )
        .count()
    )

    total_scans = (
        db.query(ScanJob)
        .count()
    )

    latest_insight = (
        db.query(AIInsight)
        .order_by(
            AIInsight.created_at.desc()
        )
        .first()
    )

    category_distribution = (
        db.query(
            Biomarker.category,
            func.count(Biomarker.id)
        )
        .group_by(
            Biomarker.category
        )
        .all()
    )

    risk_distribution = (
        db.query(
            AIInsight.risk_level,
            func.count(AIInsight.id)
        )
        .group_by(
            AIInsight.risk_level
        )
        .all()
    )

    return {
        "success": True,
        "data": {

            "overview": {
                "total_scans": total_scans,
                "total_biomarkers": total_biomarkers,
                "abnormal_biomarkers": abnormal_biomarkers
            },

            "latest_insight": {
                "summary": (
                    latest_insight.summary
                    if latest_insight
                    else None
                ),
                "risk_level": (
                    latest_insight.risk_level
                    if latest_insight
                    else None
                )
            },

            "category_distribution": [
                {
                    "category": category,
                    "count": count
                }
                for category, count in category_distribution
            ],

            "risk_distribution": [
                {
                    "risk_level": risk,
                    "count": count
                }
                for risk, count in risk_distribution
            ]
        }
    }