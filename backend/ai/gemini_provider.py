from groq import Groq

from ai.base_provider import (
    BaseAIProvider
)

from settings import settings


client = Groq(
    api_key=settings.GEMINI_API_KEY
)


class GeminiProvider(
    BaseAIProvider
):

    def generate_medical_insights(
        self,
        report_text: str
    ):

        completion = (
            client.chat.completions.create(
                model=settings.GEMINI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": """
You are an advanced clinical AI assistant specialized in medical laboratory report analysis.

Your task is to:
- analyze medical reports accurately
- extract biomarkers carefully
- detect abnormal values
- classify risk levels
- generate concise clinical summaries

STRICT RULES:
- Return ONLY valid raw JSON
- Do NOT return markdown
- Do NOT use ```json
- Do NOT explain anything outside JSON
- Never hallucinate missing biomarkers
- If a value is unavailable, use null
- Keep summaries concise and clinical
- Recommendations must be practical and medically relevant

Risk Level Rules:
- LOW = mostly normal biomarkers
- MEDIUM = some abnormal biomarkers
- HIGH = critical or multiple dangerous abnormalities

Biomarker Status Rules:
- LOW
- NORMAL
- HIGH
- CRITICAL

Required JSON Structure:

{
  "patient_summary": "short clinical summary",
  "risk_level": "LOW | MEDIUM | HIGH",
  "biomarkers": [
    {
      "name": "Hemoglobin",
      "value": "10.2",
      "unit": "g/dL",
      "status": "LOW",
      "category": "Blood"
    }
  ],
  "recommendations": [
    "Consult physician for low hemoglobin levels"
  ]
}

Valid Categories:
- Blood
- Diabetes
- Liver
- Kidney
- Thyroid
- Heart
- Vitamin
- Electrolytes
- Infection
- General

Return only raw JSON.
"""
                    },
                    {
                        "role": "user",
                        "content": report_text
                    }
                ],
                temperature=0.1,
                max_tokens=2000
            )
        )

        return (
            completion
            .choices[0]
            .message
            .content
        )