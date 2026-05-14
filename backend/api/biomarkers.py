from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query
from fastapi import status

from sqlalchemy import asc
from sqlalchemy.orm import Session

from db.client import get_db

from dependencies.auth import (
    get_current_user
)

from models.user import User
from models.profile import Profile
from models.report import Report
from models.biomarker import Biomarker

from services.biomarker_history_service import (
    BiomarkerHistoryService
)


router = APIRouter(

    prefix="/biomarkers",

    tags=["Biomarkers"]
)


# =====================================================
# GET ALL BIOMARKERS
# =====================================================

@router.get("/")
def get_biomarkers(

    category: str | None = Query(
        default=None
    ),

    severity: str | None = Query(
        default=None
    ),

    limit: int = Query(
        default=100,
        le=500
    ),

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    query = (

        db.query(Biomarker)

        .join(
            Report,
            Biomarker.report_id
            ==
            Report.id
        )

        .join(
            Profile,
            Report.profile_id
            ==
            Profile.id
        )

        .filter(
            Profile.user_id
            ==
            current_user.id
        )
    )

    # =================================================
    # FILTERS
    # =================================================

    if category:

        query = query.filter(
            Biomarker.category.ilike(
                category
            )
        )

    if severity:

        query = query.filter(
            Biomarker.severity.ilike(
                severity
            )
        )

    biomarkers = (

        query

        .order_by(
            Biomarker.name.asc()
        )

        .limit(limit)

        .all()
    )

    return {

        "success": True,

        "count": len(biomarkers),

        "filters": {

            "category": category,

            "severity": severity
        },

        "data": [

            {

                "id":
                    str(biomarker.id),

                "report_id":
                    str(
                        biomarker.report_id
                    ),

                "name":
                    biomarker.name,

                "value":
                    biomarker.value,

                "unit":
                    biomarker.unit,

                "severity":
                    biomarker.severity,

                "category":
                    biomarker.category,

                "reference_range":
                    biomarker.reference_range,

                "clinical_significance":
                    biomarker.clinical_significance,

                "confidence_score":
                    biomarker.confidence_score
            }

            for biomarker
            in biomarkers
        ]
    }


# =====================================================
# GET BIOMARKER HISTORY
# =====================================================

@router.get(
    "/history/{profile_id}/{biomarker_name}"
)
def get_biomarker_history(

    profile_id: UUID,

    biomarker_name: str,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    history = (

        BiomarkerHistoryService
        .get_biomarker_history(

            db=db,

            profile_id=str(profile_id),

            biomarker_name=biomarker_name,

            user=current_user
        )
    )

    if history is None:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Profile not found"
        )

    return {

        "success": True,

        "data": {

            "profile_id":
                str(profile_id),

            "biomarker_name":
                biomarker_name,

            "history":
                history
        }
    }


# =====================================================
# GET BIOMARKER CATEGORIES
# =====================================================

@router.get("/categories/list")
def get_biomarker_categories(

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    categories = (

        db.query(
            Biomarker.category
        )

        .join(
            Report,
            Biomarker.report_id
            ==
            Report.id
        )

        .join(
            Profile,
            Report.profile_id
            ==
            Profile.id
        )

        .filter(
            Profile.user_id
            ==
            current_user.id
        )

        .distinct()

        .all()
    )

    cleaned_categories = [

        category[0]

        for category
        in categories

        if category[0]
    ]

    return {

        "success": True,

        "count":
            len(cleaned_categories),

        "data":
            cleaned_categories
    }