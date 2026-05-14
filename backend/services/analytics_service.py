from collections import defaultdict

from sqlalchemy.orm import Session

from models.profile import Profile
from models.report import Report
from models.biomarker import Biomarker
from models.user import User


class AnalyticsService:

    # =================================================
    # GET BIOMARKER TRENDS
    # =================================================

    @staticmethod
    def get_biomarker_trends(

        db: Session,

        profile_id: str,

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
        # GET REPORTS
        # =============================================

        reports = (
            db.query(Report)
            .filter(
                Report.profile_id == profile.id
            )
            .order_by(
                Report.created_at.asc()
            )
            .all()
        )

        raw_trends = defaultdict(list)

        # =============================================
        # BUILD HISTORY
        # =============================================

        for report in reports:

            biomarkers = (
                db.query(Biomarker)
                .filter(
                    Biomarker.report_id == report.id
                )
                .all()
            )

            for biomarker in biomarkers:

                try:
                    numeric_value = float(
                        biomarker.value
                    )
                except:
                    continue

                raw_trends[
                    biomarker.name
                ].append({

                    "report_id": str(
                        report.id
                    ),

                    "report_date": str(
                        report.report_date
                        or report.created_at.date()
                    ),

                    "value": numeric_value,

                    "unit": biomarker.unit,

                    "severity": (
                        biomarker.severity
                    ),

                    "reference_range": (
                        biomarker.reference_range
                    ),

                    "confidence_score": (
                        biomarker.confidence_score
                    )
                })

        # =============================================
        # ANALYZE TRENDS
        # =============================================

        analyzed_trends = {}

        for biomarker_name, history in raw_trends.items():

            history = sorted(
                history,
                key=lambda x: x["report_date"]
            )

            trend = "STABLE"

            change_percent = 0

            risk_level = "LOW"

            if len(history) >= 2:

                first = history[0]["value"]

                last = history[-1]["value"]

                if first != 0:

                    change_percent = round(

                        (
                            (last - first)
                            / first
                        ) * 100,

                        2
                    )

                # =====================================
                # DETECT TREND
                # =====================================

                if last > first:

                    trend = "RISING"

                elif last < first:

                    trend = "FALLING"

                # =====================================
                # RISK LOGIC
                # =====================================

                if abs(change_percent) > 30:

                    risk_level = "HIGH"

                elif abs(change_percent) > 15:

                    risk_level = "MODERATE"

            analyzed_trends[
                biomarker_name
            ] = {

                "trend": trend,

                "change_percent": (
                    change_percent
                ),

                "risk_level": risk_level,

                "history": history
            }

        return analyzed_trends