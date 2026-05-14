import tempfile

import fitz

from PIL import Image

from google import genai

from config import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


class GeminiVisionService:

    @staticmethod
    def extract_medical_report_data(
        file_path: str
    ):

        document = fitz.open(
            file_path
        )

        uploaded_images = []

        for page_index in range(
            len(document)
        ):

            page = document.load_page(
                page_index
            )

            pix = page.get_pixmap(
                matrix=fitz.Matrix(
                    2,
                    2
                )
            )

            temp_image = tempfile.NamedTemporaryFile(
                suffix=".png",
                delete=False
            )

            pix.save(
                temp_image.name
            )

            image = Image.open(
                temp_image.name
            )

            uploaded_images.append(
                image
            )

        prompt = """
You are an advanced multimodal clinical AI system specialized in medical laboratory report analysis.

Analyze ALL pages carefully.

Extract ALL biomarkers visible in the report.

Your task is:
- identify biomarkers
- identify values
- identify units
- identify reference ranges
- estimate medical abnormality
- estimate extraction confidence

Return ONLY valid JSON.

Required JSON schema:

{
  "patient_summary": "short medical summary",

  "risk_level": "LOW | MEDIUM | HIGH",

  "overall_confidence_score": 0.95,

  "biomarkers": [
    {
      "name": "Biomarker Name",

      "value": "Numeric Value",

      "unit": "Unit",

      "reference_range": "Reference Range",

      "status": "LOW | NORMAL | HIGH",

      "category": "Category",

      "clinical_significance": "Clinical meaning",

      "confidence_score": 0.98
    }
  ],

  "recommendations": [
    "Recommendation"
  ]
}

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text
- Preserve values exactly
- Preserve units exactly
- Extract every visible biomarker
- Do not hallucinate biomarkers
- confidence_score must be between 0 and 1
- overall_confidence_score must be between 0 and 1
- If uncertain, lower confidence
"""

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=[
                prompt,
                *uploaded_images
            ]
        )

        return response.text