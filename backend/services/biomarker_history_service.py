from sqlalchemy.orm import Session

from models.profile import Profile
from models.report import Report
from models.biomarker import Biomarker
from models.user import User


class BiomarkerHistoryService:

    # =================================================
    # GET BIOMARKER HISTORY
    # =================================================

    @staticmethod
    def get_biomarker_history(

        db: Session,

        profile_id: str,

        biomarker_name: str,

        user: User
    ):

        # =============================================
        # VERIFY PROFILE OWNERSHIP
        # =============================================

        profile = (

            db.query(Profile)

            .filter(

                Profile.id == profile_id,

                Profile.user_id == user.id
            )

            .first()
        )

        if not profile:
            return None

        # =============================================
        # FETCH HISTORY
        # =============================================

        biomarkers = (

            db.query(Biomarker)

            .join(
                Report,
                Biomarker.report_id
                ==
                Report.id
            )

            .filter(

                Report.profile_id
                ==
                profile.id,

                Biomarker.name.ilike(
                    biomarker_name
                )
            )

            .order_by(
                Report.created_at.asc()
            )

            .all()
        )

        history = []

        for biomarker in biomarkers:

            numeric_value = (
                BiomarkerHistoryService
                .safe_float(
                    biomarker.value
                )
            )

            if numeric_value is None:
                continue

            history.append({

                "report_id":
                    str(
                        biomarker.report.id
                    ),

                "report_date":
                    str(
                        biomarker.report.report_date
                        or
                        biomarker.report.created_at.date()
                    ),

                "value":
                    numeric_value,

                "unit":
                    biomarker.unit,

                "severity":
                    biomarker.severity,

                "reference_range":
                    biomarker.reference_range,

                "confidence_score":
                    biomarker.confidence_score
            })

        return history

    # =================================================
    # SAFE FLOAT
    # =================================================

    @staticmethod
    def safe_float(
        value: str | None
    ) -> float | None:

        if not value:
            return None

        try:

            cleaned = (
                value
                .replace(",", "")
                .strip()
            )

            return float(cleaned)

        except Exception:

            return None