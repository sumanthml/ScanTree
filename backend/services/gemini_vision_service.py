import tempfile
import os
import json
import fitz
from PIL import Image
from google import genai
from settings import settings


client = genai.Client(api_key=settings.GEMINI_API_KEY)


class GeminiVisionService:

    # =====================================================
    # MAIN PIPELINE
    # =====================================================
    @staticmethod
    def extract_medical_report_data(file_path: str) -> str:

        if not file_path:
            raise ValueError("file_path is required")

        document = None
        temp_files = []

        try:
            document = fitz.open(file_path)

            images = []

            for page_index in range(len(document)):

                page = document.load_page(page_index)
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))

                tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
                tmp_path = tmp.name
                tmp.close()

                temp_files.append(tmp_path)
                pix.save(tmp_path)
                images.append(Image.open(tmp_path))

            if not images:
                raise ValueError("No pages extracted from PDF")

            prompt = GeminiVisionService._build_prompt()

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=[prompt, *images]
            )

            if not response or not response.text:
                raise RuntimeError("Empty Gemini Vision response")

            return GeminiVisionService._clean_response(response.text)

        finally:
            if document:
                document.close()
            for path in temp_files:
                try:
                    os.remove(path)
                except Exception:
                    pass

    # =====================================================
    # PROMPT
    # =====================================================
    @staticmethod
    def _build_prompt() -> str:
        return """
You are a medical AI assistant specializing in lab report analysis.

Analyze the provided medical lab report image(s) and extract all relevant information.

Return ONLY a valid JSON object with this exact structure:

{
  "patient_summary": "Brief clinical summary of the patient's overall health based on results",
  "risk_level": "LOW | MODERATE | HIGH | CRITICAL",
  "overall_confidence_score": 0.0,
  "biomarkers": [
    {
      "name": "Biomarker name",
      "value": "Numeric value as string",
      "unit": "Unit of measurement",
      "reference_range": "Normal range e.g. 70-100",
      "status": "NORMAL | HIGH | LOW | CRITICAL",
      "category": "Category e.g. Blood Sugar, Lipid Panel, Liver Function",
      "clinical_significance": "Brief clinical note about this value",
      "confidence_score": 0.95
    }
  ],
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2"
  ]
}

Rules:
- Extract ALL biomarkers visible in the report
- Do NOT include markdown, code fences, or any text outside the JSON
- confidence_score must be between 0.0 and 1.0
- risk_level must be one of: LOW, MODERATE, HIGH, CRITICAL
- If a value cannot be determined, use null
"""

    # =====================================================
    # CLEAN RESPONSE
    # =====================================================
    @staticmethod
    def _clean_response(raw: str) -> str:
        cleaned = raw.strip()
        # Strip markdown code fences if present
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            # Remove first line (```json or ```) and last line (```)
            lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            cleaned = "\n".join(lines).strip()
        return cleaned