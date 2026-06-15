import json
from google import genai
from settings import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


class ClinicalSeverityService:

    ALLOWED = {
        "LOW",
        "NORMAL",
        "HIGH",
        "CRITICAL",
        "UNKNOWN"
    }

    @staticmethod
    def analyze_biomarker(biomarker_data):

        prompt = f"""
You are a clinical laboratory severity classification engine.

STRICT OUTPUT RULES:
- Output ONLY valid JSON
- No markdown
- No explanations

Allowed severity values:
LOW, NORMAL, HIGH, CRITICAL, UNKNOWN

If reference range is missing → UNKNOWN

INPUT:
name: {biomarker_data.name}
value: {biomarker_data.value}
unit: {biomarker_data.unit}
reference_range: {biomarker_data.reference_range}

OUTPUT FORMAT:
{{
  "severity": "NORMAL",
  "confidence_score": 0.0,
  "reason": "short clinical explanation"
}}
"""

        try:
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt
            )

            if not response or not response.text:
                return ClinicalSeverityService._fallback()

            cleaned = (
                response.text
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            parsed = json.loads(cleaned)

            severity = (
                str(parsed.get("severity", "UNKNOWN"))
                .upper()
            )

            if severity not in ClinicalSeverityService.ALLOWED:
                severity = "UNKNOWN"

            confidence = parsed.get("confidence_score", 0.0)

            try:
                confidence = float(confidence)
            except:
                confidence = 0.0

            return {
                "severity": severity,
                "confidence_score": confidence,
                "reason": parsed.get("reason", "")
            }

        except Exception:
            return ClinicalSeverityService._fallback()

    @staticmethod
    def _fallback():
        return {
            "severity": "UNKNOWN",
            "confidence_score": 0.0,
            "reason": "LLM parsing failed or insufficient data"
        }