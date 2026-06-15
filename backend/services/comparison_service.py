from sqlalchemy.orm import Session
from models.report import Report


class ComparisonService:

    @staticmethod
    def compare_reports(
        current_report: Report,
        previous_report: Report
    ) -> dict:

        current_biomarkers = {
            b.name.lower(): b
            for b in current_report.biomarkers
        }

        previous_biomarkers = {
            b.name.lower(): b
            for b in previous_report.biomarkers
        }

        results = {}

        common = set(current_biomarkers) & set(previous_biomarkers)

        for name in common:

            current = current_biomarkers[name]
            previous = previous_biomarkers[name]

            current_value = ComparisonService.safe_float(current.value)
            previous_value = ComparisonService.safe_float(previous.value)

            if current_value is None or previous_value is None:
                continue

            diff = round(current_value - previous_value, 2)

            change_percent = ComparisonService.calculate_change_percent(
                previous_value,
                current_value
            )

            results[current.name] = {
                "previous_value": previous_value,
                "current_value": current_value,
                "difference": diff,
                "change_percent": change_percent,

                "trend": ComparisonService.determine_trend(diff),
                "risk_level": ComparisonService.determine_risk_level(change_percent),

                "severity_evolution": ComparisonService.build_severity_evolution(
                    previous.severity,
                    current.severity
                ),

                "previous_severity": previous.severity,
                "current_severity": current.severity,

                "clinical_status": ComparisonService.determine_clinical_status(
                    previous.severity,
                    current.severity
                ),

                "unit": current.unit,
                "reference_range": current.reference_range,
                "confidence_score": current.confidence_score,
                "category": getattr(current, "category", None),
                "clinical_significance": getattr(current, "clinical_significance", None)
            }

        return results

    @staticmethod
    def get_previous_report(db: Session, report: Report):

        return (
            db.query(Report)
            .filter(
                Report.profile_id == report.profile_id,
                Report.created_at < report.created_at
            )
            .order_by(Report.created_at.desc())
            .first()
        )

    @staticmethod
    def determine_trend(diff: float) -> str:
        if diff > 0:
            return "INCREASED"
        if diff < 0:
            return "DECREASED"
        return "UNCHANGED"

    @staticmethod
    def calculate_change_percent(prev: float, curr: float) -> float:
        if prev == 0:
            return 0.0

        return round(((curr - prev) / prev) * 100, 2)

    @staticmethod
    def determine_risk_level(change_percent: float) -> str:
        abs_change = abs(change_percent)

        if abs_change >= 50:
            return "CRITICAL"
        if abs_change >= 30:
            return "HIGH"
        if abs_change >= 15:
            return "MODERATE"
        return "LOW"

    @staticmethod
    def build_severity_evolution(prev: str | None, curr: str | None) -> str:
        return f"{prev or 'UNKNOWN'} -> {curr or 'UNKNOWN'}"

    @staticmethod
    def determine_clinical_status(prev: str | None, curr: str | None) -> str:

        order = {
            "LOW": 0,
            "NORMAL": 1,
            "HIGH": 2,
            "CRITICAL": 3,
            "UNKNOWN": -1
        }

        p = order.get((prev or "").upper(), -1)
        c = order.get((curr or "").upper(), -1)

        if c > p:
            return "WORSENED"
        if c < p:
            return "IMPROVED"
        return "STABLE"

    @staticmethod
    def safe_float(value: str | None) -> float | None:
        if not value:
            return None
        try:
            return float(value.replace(",", "").strip())
        except Exception:
            return None