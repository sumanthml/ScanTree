from models.report import Report


class HealthScoreService:

    # =================================================
    # CALCULATE HEALTH SCORE
    # =================================================

    @staticmethod
    def calculate_health_score(
        report: Report
    ) -> dict:

        biomarkers = report.biomarkers

        if not biomarkers:

            return {

                "health_score": 100,

                "risk_level": "LOW",

                "critical_flags": 0
            }

        score = 100

        critical_flags = 0

        # =============================================
        # SEVERITY PENALTIES
        # =============================================

        severity_penalties = {

            "NORMAL": 0,

            "BORDERLINE": 5,

            "HIGH": 15,

            "CRITICAL": 30
        }

        for biomarker in biomarkers:

            severity = (
                biomarker.severity
                or
                "NORMAL"
            ).upper()

            penalty = severity_penalties.get(
                severity,
                0
            )

            score -= penalty

            if severity in [
                "HIGH",
                "CRITICAL"
            ]:
                critical_flags += 1

        # =============================================
        # NORMALIZE SCORE
        # =============================================

        score = max(
            0,
            min(score, 100)
        )

        # =============================================
        # DETERMINE RISK LEVEL
        # =============================================

        risk_level = (
            HealthScoreService
            .determine_risk_level(
                score
            )
        )

        return {

            "health_score":
                score,

            "risk_level":
                risk_level,

            "critical_flags":
                critical_flags
        }

    # =================================================
    # DETERMINE RISK LEVEL
    # =================================================

    @staticmethod
    def determine_risk_level(
        score: int
    ) -> str:

        if score >= 85:
            return "LOW"

        if score >= 70:
            return "MODERATE"

        if score >= 50:
            return "HIGH"

        return "CRITICAL"