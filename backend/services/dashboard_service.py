from sqlalchemy.orm import Session
from sqlalchemy import func

from models.report import Report
from models.biomarker import Biomarker
from models.ai_insight import AIInsight


class DashboardService:

    # =====================================================
    # PROFILE DASHBOARD
    # =====================================================

    @staticmethod
    def get_profile_dashboard(

        db: Session,

        profile_id: str
    ):

        # =================================================
        # TOTAL REPORTS
        # =================================================

        total_reports = (

            db.query(Report)

            .filter(
                Report.profile_id == profile_id
            )

            .count()
        )

        # =================================================
        # HEALTH SCORE STATS
        # =================================================

        health_score_stats = (

            db.query(

                func.avg(
                    Report.health_score
                ),

                func.max(
                    Report.health_score
                ),

                func.min(
                    Report.health_score
                )
            )

            .filter(
                Report.profile_id == profile_id
            )

            .first()
        )

        average_health_score = (

            round(
                float(
                    health_score_stats[0]
                ),
                2
            )

            if health_score_stats[0]
            else None
        )

        highest_health_score = (
            health_score_stats[1]
        )

        lowest_health_score = (
            health_score_stats[2]
        )

        # =================================================
        # LATEST REPORT
        # =================================================

        latest_report = (

            db.query(Report)

            .filter(
                Report.profile_id == profile_id
            )

            .order_by(
                Report.created_at.desc()
            )

            .first()
        )

        # =================================================
        # ABNORMAL BIOMARKERS
        # =================================================

        abnormal_biomarkers = (

            db.query(Biomarker)

            .join(Report)

            .filter(

                Report.profile_id
                ==
                profile_id,

                Biomarker.severity.in_([
                    "HIGH",
                    "LOW",
                    "CRITICAL"
                ])
            )

            .count()
        )

        # =================================================
        # HIGH RISK INSIGHTS
        # =================================================

        high_risk_insights = (

            db.query(AIInsight)

            .join(Report)

            .filter(

                Report.profile_id
                ==
                profile_id,

                AIInsight.severity.in_([
                    "HIGH",
                    "CRITICAL"
                ])
            )

            .count()
        )

        # =================================================
        # RECENT BIOMARKERS
        # =================================================

        recent_biomarkers = (

            db.query(Biomarker)

            .join(Report)

            .filter(
                Report.profile_id == profile_id
            )

            .order_by(
                Report.created_at.desc()
            )

            .limit(5)

            .all()
        )

        # =================================================
        # TOP CONCERNS
        # =================================================

        top_concerns = (

            db.query(

                Biomarker.name,

                func.count(
                    Biomarker.id
                ).label("count")
            )

            .join(Report)

            .filter(

                Report.profile_id
                ==
                profile_id,

                Biomarker.severity.in_([
                    "HIGH",
                    "LOW",
                    "CRITICAL"
                ])
            )

            .group_by(
                Biomarker.name
            )

            .order_by(
                func.count(
                    Biomarker.id
                ).desc()
            )

            .limit(5)

            .all()
        )

        # =================================================
        # FINAL RESPONSE
        # =================================================

        return {

            "total_reports":
                total_reports,

            "latest_health_score":

                latest_report.health_score

                if latest_report
                else None,

            "average_health_score":
                average_health_score,

            "highest_health_score":
                highest_health_score,

            "lowest_health_score":
                lowest_health_score,

            "abnormal_biomarkers":
                abnormal_biomarkers,

            "high_risk_insights":
                high_risk_insights,

            "latest_report_date":

                latest_report.created_at

                if latest_report
                else None,

            "top_concerns": [

                {
                    "name": concern[0],
                    "count": concern[1]
                }

                for concern in top_concerns
            ],

            "recent_biomarkers": [

                {

                    "name":
                        biomarker.name,

                    "value":
                        biomarker.value,

                    "unit":
                        biomarker.unit,

                    "severity":
                        biomarker.severity,

                    "category":
                        biomarker.category
                }

                for biomarker in recent_biomarkers
            ]
        }

    # =====================================================
    # HEALTH SCORE HISTORY
    # =====================================================

    @staticmethod
    def get_health_score_history(

        db: Session,

        profile_id: str
    ):

        reports = (

            db.query(Report)

            .filter(

                Report.profile_id
                ==
                profile_id,

                Report.health_score.isnot(
                    None
                )
            )

            .order_by(
                Report.created_at.asc()
            )

            .all()
        )

        return [

            {

                "report_id":
                    str(report.id),

                "report_date":

                    report.report_date

                    or

                    report.created_at.date(),

                "health_score":
                    report.health_score
            }

            for report in reports
        ]

    # =====================================================
    # BIOMARKER HISTORY
    # =====================================================

    @staticmethod
    def get_biomarker_history(

        db: Session,

        profile_id: str,

        biomarker_name: str
    ):

        biomarkers = (

            db.query(Biomarker)

            .join(Report)

            .filter(

                Report.profile_id
                ==
                profile_id,

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

            numeric_value = None

            try:

                if biomarker.value:

                    numeric_value = float(
                        biomarker.value
                    )

            except Exception:

                pass

            history.append({

                "report_id":
                    str(biomarker.report_id),

                "report_date":

                    biomarker.report.report_date

                    or

                    biomarker.report.created_at.date(),

                "value":
                    numeric_value,

                "raw_value":
                    biomarker.value,

                "unit":
                    biomarker.unit,

                "severity":
                    biomarker.severity,

                "reference_range":
                    biomarker.reference_range,

                "category":
                    biomarker.category
            })

        return history