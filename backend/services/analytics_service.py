from sqlalchemy.orm import Session

from models.report import Report
from models.biomarker import Biomarker

from services.dashboard_service import DashboardService
from services.comparison_service import ComparisonService


class AnalyticsService:

    # =====================================================
    # MAIN ANALYTICS ENTRY POINT
    # =====================================================
    @staticmethod
    def get_profile_analytics(db: Session, profile_id: str):

        overview = DashboardService.get_profile_dashboard(db, profile_id)
        health_history = DashboardService.get_health_score_history(db, profile_id)

        dynamic_biomarkers = AnalyticsService.build_dynamic_biomarkers(db, profile_id)
        critical_changes = AnalyticsService.build_critical_changes(db, profile_id)

        ai_insights = AnalyticsService.build_ai_insights(critical_changes)

        return {
            "overview": {
                "total_reports": overview.get("total_reports", 0),
                "average_health_score": overview.get("average_health_score") or 0,
                "latest_health_score": overview.get("latest_health_score") or 0,
                "abnormal_biomarkers": overview.get("abnormal_biomarkers", 0),
                "high_risk_insights": overview.get("high_risk_insights", 0),
            },
            "health_history": health_history,
            "dynamic_biomarkers": dynamic_biomarkers,
            "critical_changes": critical_changes,
            "ai_insights": ai_insights,
            "comparison_insights": ai_insights
        }

    # =====================================================
    # BIOMARKER TIME SERIES
    # =====================================================
    @staticmethod
    def build_dynamic_biomarkers(db: Session, profile_id: str):

        biomarker_rows = (
            db.query(Biomarker.name)
            .join(Report, Biomarker.report_id == Report.id)
            .filter(Report.profile_id == profile_id)
            .distinct()
            .all()
        )

        results = []

        for row in biomarker_rows:

            name = row[0]

            history = DashboardService.get_biomarker_history(
                db,
                profile_id,
                name
            )

            if not history:
                continue

            graph = [
                {
                    "date": str(entry.get("date")),
                    "value": entry.get("value")
                }
                for entry in history
                if entry.get("value") is not None
            ]

            if len(graph) >= 2:
                results.append({
                    "name": name,
                    "history": graph
                })

        return results

    # =====================================================
    # CRITICAL CHANGES
    # =====================================================
    @staticmethod
    def build_critical_changes(db: Session, profile_id: str):

        reports = (
            db.query(Report)
            .filter(Report.profile_id == profile_id)
            .order_by(Report.created_at.desc())
            .limit(2)
            .all()
        )

        if len(reports) < 2:
            return []

        latest, previous = reports

        comparison = ComparisonService.compare_reports(latest, previous)

        results = []

        for name, data in comparison.items():

            change_percent = data.get("change_percent")

            if change_percent is None or abs(change_percent) < 5:
                continue

            results.append({
                "name": name,
                "change_percent": round(change_percent, 2),
                "trend": data.get("trend"),
                "risk_level": data.get("risk_level"),
                "clinical_status": data.get("clinical_status")
            })

        results.sort(key=lambda x: abs(x["change_percent"]), reverse=True)

        return results[:10]

    # =====================================================
    # AI INSIGHTS
    # =====================================================
    @staticmethod
    def build_ai_insights(changes: list):

        if not changes:
            return []

        return [
            {
                "title": f"{c['name']} {c['trend']}",
                "description": f"{c['name']} changed by {c['change_percent']}% and clinical status is {c['clinical_status']}"
            }
            for c in changes
        ]