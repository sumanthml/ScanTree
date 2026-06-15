from models.report import Report


class HealthScoreService:

    @staticmethod
    def calculate_health_score(report: Report) -> dict:

        biomarkers = report.biomarkers or []

        if not biomarkers:
            return {
                "health_score": 100,
                "risk_level": "LOW",
                "critical_flags": 0
            }

        score = 100
        critical_flags = 0
        total_penalty = 0

        severity_weights = {
            "NORMAL": 0,
            "LOW": 5,
            "HIGH": 12,
            "CRITICAL": 25
        }

        for b in biomarkers:

            severity = (b.severity or "NORMAL").upper()
            weight = severity_weights.get(severity, 0)

            importance = HealthScoreService.get_biomarker_weight(b.name)

            penalty = weight * importance

            score -= penalty
            total_penalty += penalty

            if severity in ("HIGH", "CRITICAL"):
                critical_flags += 1

        score = max(0, min(score, 100))

        return {
            "health_score": round(score, 2),
            "risk_level": HealthScoreService.determine_risk_level(score),
            "critical_flags": critical_flags,
            "total_penalty": round(total_penalty, 2)
        }

    @staticmethod
    def get_biomarker_weight(name: str) -> float:

        name = (name or "").lower()

        high_priority = [
            "troponin", "creatinine", "hba1c",
            "glucose", "ldl", "cholesterol"
        ]

        return 1.5 if any(k in name for k in high_priority) else 1.0

    @staticmethod
    def determine_risk_level(score: float) -> str:

        if score >= 85:
            return "LOW"
        if score >= 70:
            return "MODERATE"
        if score >= 50:
            return "HIGH"
        return "CRITICAL"