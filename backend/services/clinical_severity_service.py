import json

from google import genai

from config import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


class ClinicalSeverityService:

    @staticmethod
    def analyze_biomarker(
        biomarker_data
    ):

        name = biomarker_data.name
        value = biomarker_data.value
        unit = biomarker_data.unit
        reference_range = (
            biomarker_data.reference_range
        )

        prompt = f"""
You are a clinical laboratory severity engine.

STRICT RULES:

- Use ONLY:
LOW
NORMAL
HIGH
CRITICAL
UNKNOWN

- Do NOT hallucinate.
- Do NOT infer diseases.
- Use ONLY:
    biomarker value,
    unit,
    reference range

- If reference range missing:
UNKNOWN

- Return ONLY JSON.

Biomarker Input:

{{
    "name": "{name}",
    "value": "{value}",
    "unit": "{unit}",
    "reference_range": "{reference_range}"
}}

Return ONLY:

{{
    "severity": "NORMAL",
    "confidence_score": 0.98,
    "reason": "short reason"
}}
"""

        response = (
            client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt
            )
        )

        cleaned_response = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        parsed_response = json.loads(
            cleaned_response
        )

        allowed = {
            "LOW",
            "NORMAL",
            "HIGH",
            "CRITICAL",
            "UNKNOWN"
        }

        severity = (
            parsed_response.get(
                "severity",
                "UNKNOWN"
            )
            .upper()
        )

        if severity not in allowed:
            severity = "UNKNOWN"

        return {
            "severity": severity,
            "confidence_score": (
                parsed_response.get(
                    "confidence_score",
                    0.0
                )
            ),
            "reason": (
                parsed_response.get(
                    "reason"
                )
            )
        }