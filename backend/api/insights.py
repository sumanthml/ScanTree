from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from db.client import get_db

from dependencies.auth import (
    get_current_user
)

from models.user import User
from models.ai_insight import AIInsight


router = APIRouter(
    prefix="/insights",
    tags=["Insights"]
)


@router.get("/")
def get_insights(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):
    insights = (
        db.query(AIInsight)
        .order_by(
            AIInsight.created_at.desc()
        )
        .all()
    )

    return {
        "success": True,
        "count": len(insights),
        "data": [
            {
                "id": str(insight.id),
                "summary": insight.summary,
                "risk_level": insight.risk_level,
                "created_at": insight.created_at
            }
            for insight in insights
        ]
    }