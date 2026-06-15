from utils.pdf_extractor import PDFExtractor


class ExtractionService:

    # =====================================================
    # MAIN TEXT EXTRACTION ENTRYPOINT
    # =====================================================
    @staticmethod
    def extract_report_text(file_path: str) -> str:

        if not file_path:
            raise ValueError("file_path cannot be empty")

        try:
            raw_text = PDFExtractor.extract_text(file_path)

            if not raw_text:
                return ""

            return ExtractionService.clean_text(raw_text)

        except Exception as e:
            raise RuntimeError(
                f"Failed to extract text from file: {str(e)}"
            )

    # =====================================================
    # TEXT CLEANING PIPELINE
    # =====================================================
    @staticmethod
    def clean_text(text: str) -> str:

        if not text:
            return ""

        return (
            text
            .replace("\x00", "")   # null bytes
            .strip()
        )