from sqlalchemy.orm import Session

from models.report import Report
from models.biomarker import Biomarker


class ComparisonService:

    # =================================================
    # COMPARE REPORTS
    # =================================================

    @staticmethod
    def compare_reports(
        current_report: Report,
        previous_report: Report
    ) -> dict:

        current_biomarkers = {

            biomarker.name.lower(): biomarker

            for biomarker
            in current_report.biomarkers
        }

        previous_biomarkers = {

            biomarker.name.lower(): biomarker

            for biomarker
            in previous_report.biomarkers
        }

        comparison_results = {}

        common_biomarkers = (

            set(current_biomarkers.keys())

            &

            set(previous_biomarkers.keys())
        )

        for biomarker_name in common_biomarkers:

            current = current_biomarkers[
                biomarker_name
            ]

            previous = previous_biomarkers[
                biomarker_name
            ]

            current_value = (
                ComparisonService.safe_float(
                    current.value
                )
            )

            previous_value = (
                ComparisonService.safe_float(
                    previous.value
                )
            )

            # =========================================
            # SKIP INVALID VALUES
            # =========================================

            if (
                current_value is None
                or
                previous_value is None
            ):
                continue

            # =========================================
            # CALCULATE DIFFERENCE
            # =========================================

            difference = round(
                current_value
                -
                previous_value,
                2
            )

            # =========================================
            # CALCULATE CHANGE PERCENT
            # =========================================

            change_percent = (
                ComparisonService
                .calculate_change_percent(
                    previous_value,
                    current_value
                )
            )

            # =========================================
            # BUILD RESULT
            # =========================================

            comparison_results[
                current.name
            ] = {

                "previous_value":
                    previous_value,

                "current_value":
                    current_value,

                "difference":
                    difference,

                "change_percent":
                    change_percent,

                "trend":
                    ComparisonService
                    .determine_trend(
                        difference
                    ),

                "risk_level":
                    ComparisonService
                    .determine_risk_level(
                        change_percent
                    ),

                "severity_evolution":
                    ComparisonService
                    .build_severity_evolution(
                        previous.severity,
                        current.severity
                    ),

                "previous_severity":
                    previous.severity,

                "current_severity":
                    current.severity,

                "clinical_status":
                    ComparisonService
                    .determine_clinical_status(
                        previous.severity,
                        current.severity
                    ),

                "unit":
                    current.unit,

                "reference_range":
                    current.reference_range,

                "confidence_score":
                    current.confidence_score,

                "category":
                    current.category,

                "clinical_significance":
                    current.clinical_significance
            }

        return comparison_results

    # =================================================
    # GET PREVIOUS REPORT
    # =================================================

    @staticmethod
    def get_previous_report(
        db: Session,
        report: Report
    ) -> Report | None:

        return (

            db.query(Report)

            .filter(

                Report.profile_id
                ==
                report.profile_id,

                Report.created_at
                <
                report.created_at
            )

            .order_by(
                Report.created_at.desc()
            )

            .first()
        )

    # =================================================
    # TREND DETECTION
    # =================================================

    @staticmethod
    def determine_trend(
        difference: float
    ) -> str:

        if difference > 0:
            return "INCREASED"

        if difference < 0:
            return "DECREASED"

        return "UNCHANGED"

    # =================================================
    # CHANGE PERCENT
    # =================================================

    @staticmethod
    def calculate_change_percent(
        previous_value: float,
        current_value: float
    ) -> float:

        if previous_value == 0:
            return 0.0

        return round(

            (
                (
                    current_value
                    -
                    previous_value
                )
                /
                previous_value
            )
            * 100,

            2
        )

    # =================================================
    # RISK LEVEL DETECTION
    # =================================================

    @staticmethod
    def determine_risk_level(
        change_percent: float
    ) -> str:

        absolute_change = abs(
            change_percent
        )

        if absolute_change >= 50:
            return "CRITICAL"

        if absolute_change >= 30:
            return "HIGH"

        if absolute_change >= 15:
            return "MODERATE"

        return "LOW"

    # =================================================
    # SEVERITY EVOLUTION
    # =================================================

    @staticmethod
    def build_severity_evolution(
        previous_severity: str | None,
        current_severity: str | None
    ) -> str:

        previous = (
            previous_severity
            or
            "UNKNOWN"
        )

        current = (
            current_severity
            or
            "UNKNOWN"
        )

        return f"{previous} -> {current}"

    # =================================================
    # CLINICAL STATUS
    # =================================================

    @staticmethod
    def determine_clinical_status(
        previous_severity: str | None,
        current_severity: str | None
    ) -> str:

        severity_order = {

            "NORMAL": 0,

            "BORDERLINE": 1,

            "HIGH": 2,

            "CRITICAL": 3
        }

        previous_score = severity_order.get(
            (previous_severity or "").upper(),
            0
        )

        current_score = severity_order.get(
            (current_severity or "").upper(),
            0
        )

        if current_score > previous_score:
            return "WORSENED"

        if current_score < previous_score:
            return "IMPROVED"

        return "STABLE"

    # =================================================
    # SAFE FLOAT PARSER
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