class MedicalValidationService:

    BIOMARKER_LIMITS = {

        "Hemoglobin": {
            "min": 1,
            "max": 25
        },

        "Glucose": {
            "min": 20,
            "max": 1000
        },

        "WBC": {
            "min": 0.1,
            "max": 500
        },

        "Platelets": {
            "min": 1000,
            "max": 5000000
        },

        "Creatinine": {
            "min": 0.1,
            "max": 20
        }
    }

    @staticmethod
    def validate_biomarker(
        name: str,
        value: str | None
    ):

        if value is None:
            return False

        try:

            numeric_value = float(value)

        except Exception:

            return False

        limits = (
            MedicalValidationService
            .BIOMARKER_LIMITS
            .get(name)
        )

        if not limits:
            return True

        return (
            limits["min"]
            <= numeric_value <=
            limits["max"]
        )