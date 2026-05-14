from utils.pdf_extractor import (
    PDFExtractor
)


class ExtractionService:

    @staticmethod
    def extract_report_text(
        file_path: str
    ) -> str:

        extracted_text = (
            PDFExtractor.extract_text(
                file_path
            )
        )

        cleaned_text = (
            extracted_text
            .strip()
        )

        return cleaned_text