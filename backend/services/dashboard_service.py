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
    def get_profile_dashboard(db: Session, profile_id: str):

        total_reports = (
            db.query(Report)
            .filter(Report.profile_id == profile_id)
            .count()
        )

        health_score_stats = (
            db.query(
                func.avg(Report.health_score),
                func.max(Report.health_score),
                func.min(Report.health_score)
            )
            .filter(Report.profile_id == profile_id)
            .first()
        )

        avg = float(health_score_stats[0]) if health_score_stats[0] else None

        latest_report = (
            db.query(Report)
            .filter(Report.profile_id == profile_id)
            .order_by(Report.created_at.desc())
            .first()
        )

        abnormal_biomarkers = (
            db.query(Biomarker)
            .join(Report)
            .filter(
                Report.profile_id == profile_id,
                Biomarker.severity.in_(["HIGH", "LOW", "CRITICAL"])
            )
            .count()
        )

        high_risk_insights = (
            db.query(AIInsight)
            .join(Report)
            .filter(
                Report.profile_id == profile_id,
                AIInsight.severity.in_(["HIGH", "CRITICAL"])
            )
            .count()
        )

        return {
            "total_reports": total_reports,
            "latest_health_score": latest_report.health_score if latest_report else None,
            "average_health_score": round(avg, 2) if avg else 0,
            "highest_health_score": health_score_stats[1],
            "lowest_health_score": health_score_stats[2],
            "abnormal_biomarkers": abnormal_biomarkers,
            "high_risk_insights": high_risk_insights,
            "latest_report_date": latest_report.created_at if latest_report else None,
        }

    # =====================================================
    # HEALTH SCORE HISTORY
    # =====================================================
    @staticmethod
    def get_health_score_history(db: Session, profile_id: str):

        reports = (
            db.query(Report)
            .filter(
                Report.profile_id == profile_id,
                Report.health_score.isnot(None)
            )
            .order_by(Report.created_at.asc())
            .all()
        )

        return [
            {
                "report_id": str(r.id),
                "date": r.report_date or r.created_at.date(),
                "health_score": r.health_score
            }
            for r in reports
        ]

    # =====================================================
    # BIOMARKER HISTORY (LIGHT VERSION)
    # =====================================================
    @staticmethod
    def get_biomarker_history(db: Session, profile_id: str, biomarker_name: str):

        biomarkers = (
            db.query(Biomarker)
            .join(Report)
            .filter(
                Report.profile_id == profile_id,
                Biomarker.name.ilike(biomarker_name)
            )
            .order_by(Report.created_at.asc())
            .all()
        )

        history = []

        for b in biomarkers:

            try:
                value = float(b.value) if b.value else None
            except:
                value = None

            history.append({
                "report_id": str(b.report_id),
                "date": b.report.created_at.date(),
                "value": value,
                "unit": b.unit,
                "severity": b.severity
            })

        return history

    # =====================================================
    # RECENT REPORTS
    # =====================================================
    @staticmethod
    def get_recent_reports(db: Session, profile_id: str):

        reports = (
            db.query(Report)
            .filter(Report.profile_id == profile_id)
            .order_by(Report.created_at.desc())
            .limit(5)
            .all()
        )

        return [
            {
                "id": str(r.id),
                "health_score": r.health_score,
                "date": r.created_at
            }
            for r in reports
        ]

    # =====================================================
    # RISK PROGRESSION
    # =====================================================
    @staticmethod
    def get_risk_progression(db: Session, profile_id: str):

        reports = (
            db.query(Report)
            .filter(Report.profile_id == profile_id)
            .order_by(Report.created_at.asc())
            .all()
        )

        return [
            {
                "date": r.created_at,
                "score": r.health_score
            }
            for r in reports
        ]

    # =====================================================
    # CRITICAL CHANGES
    # =====================================================
    @staticmethod
    def get_critical_changes(db: Session, profile_id: str):

        biomarkers = (
            db.query(Biomarker)
            .join(Report)
            .filter(
                Report.profile_id == profile_id,
                Biomarker.severity.in_(["HIGH", "CRITICAL"])
            )
            .limit(10)
            .all()
        )

        return [
            {
                "name": b.name,
                "value": b.value,
                "severity": b.severity
            }
            for b in biomarkers
        ]

    # =====================================================
    # AI SUMMARY
    # =====================================================
    @staticmethod
    def get_ai_summary(db: Session, profile_id: str):

        insights = (
            db.query(AIInsight)
            .join(Report)
            .filter(Report.profile_id == profile_id)
            .order_by(AIInsight.created_at.desc())
            .limit(5)
            .all()
        )

        return [
            {
                "title": i.title,
                "description": i.description,
                "severity": i.severity
            }
            for i in insights
        ]