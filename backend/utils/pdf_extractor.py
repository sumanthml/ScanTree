import fitz


class PDFExtractor:

    @staticmethod
    def extract_text(
        file_path: str
    ) -> str:

        document = fitz.open(
            file_path
        )

        extracted_text = []

        for page in document:

            text = page.get_text()

            extracted_text.append(text)

        document.close()

        return "\n".join(
            extracted_text
        )