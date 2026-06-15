import fitz


class PDFExtractor:

    @staticmethod
    def extract_text(file_path: str) -> str:

        text_chunks = []

        try:
            document = fitz.open(file_path)

            for page in document:
                text_chunks.append(page.get_text())

        finally:
            document.close()

        return "\n".join(text_chunks)