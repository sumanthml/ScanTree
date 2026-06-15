import qrcode
import io
import base64

from models.report import Report


class QRService:

    # =====================================================
    # GENERATE QR FOR REPORT ACCESS
    # =====================================================
    @staticmethod
    def generate_report_qr(
        report: Report,
        base_url: str
    ) -> str:

        # Secure deep link to report
        url = f"{base_url}/reports/{report.id}"

        qr = qrcode.QRCode(
            version=1,
            box_size=10,
            border=4
        )

        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill="black", back_color="white")

        buffer = io.BytesIO()
        img.save(buffer, format="PNG")

        qr_base64 = base64.b64encode(
            buffer.getvalue()
        ).decode()

        return f"data:image/png;base64,{qr_base64}"

    # =====================================================
    # GENERATE DOWNLOAD QR
    # =====================================================
    @staticmethod
    def generate_download_qr(
        report: Report,
        base_url: str
    ) -> str:

        url = f"{base_url}/reports/{report.id}/download"

        qr = qrcode.QRCode(
            version=1,
            box_size=10,
            border=4
        )

        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill="black", back_color="white")

        buffer = io.BytesIO()
        img.save(buffer, format="PNG")

        return base64.b64encode(buffer.getvalue()).decode()