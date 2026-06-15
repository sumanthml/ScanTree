from typing import Dict


class MedicalValidationService:

    BIOMARKER_LIMITS = {
        "hemoglobin": {"min": 1, "max": 25},
        "glucose": {"min": 20, "max": 1000},
        "wbc": {"min": 0.1, "max": 500},
        "platelets": {"min": 1000, "max": 5000000},
        "creatinine": {"min": 0.1, "max": 20}
    }

    @staticmethod
    def normalize_name(name: str) -> str:
        return (name or "").lower().replace(" ", "").replace("-", "").replace("_", "")

    @staticmethod
    def validate_biomarker(name: str, value: str | None) -> Dict:

        if value is None:
            return {"valid": False, "reason": "missing_value"}

        try:
            numeric_value = float(str(value).replace(",", "").strip())
        except:
            return {"valid": False, "reason": "invalid_numeric_format"}

        normalized = MedicalValidationService.normalize_name(name)

        limits = MedicalValidationService.BIOMARKER_LIMITS.get(normalized)

        if not limits:
            return {
                "valid": True,
                "reason": "unknown_biomarker",
                "flag": "needs_reference_validation"
            }

        if limits["min"] <= numeric_value <= limits["max"]:
            return {"valid": True, "reason": "within_range"}

        return {
            "valid": False,
            "reason": "out_of_range",
            "severity_hint": "LOW" if numeric_value < limits["min"] else "HIGH",
            "expected_range": limits
        }