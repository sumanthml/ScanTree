import ssl
import certifi

from fastapi_mail import (
    FastMail,
    MessageSchema,
    ConnectionConfig
)

from settings import settings


class EmailService:

    # =====================================================
    # SSL CONTEXT
    # =====================================================

    ssl_context = ssl.create_default_context(

        cafile=certifi.where()
    )

    # =====================================================
    # SMTP CONFIGURATION
    # =====================================================

    conf = ConnectionConfig(

        MAIL_USERNAME=settings.SMTP_USERNAME,

        MAIL_PASSWORD=settings.SMTP_PASSWORD,

        MAIL_FROM=settings.SMTP_FROM,

        MAIL_PORT=settings.SMTP_PORT,

        MAIL_SERVER=settings.SMTP_SERVER,

        MAIL_FROM_NAME=settings.SMTP_FROM_NAME,

        MAIL_STARTTLS=True,

        MAIL_SSL_TLS=False,

        USE_CREDENTIALS=True,

        VALIDATE_CERTS=False
    )

    # =====================================================
    # SEND EMAIL
    # =====================================================

    @staticmethod
    async def send_email(

        recipient: str,

        subject: str,

        body: str
    ):

        try:

            message = MessageSchema(

                subject=subject,

                recipients=[recipient],

                body=body,

                subtype="html"
            )

            fast_mail = FastMail(
                EmailService.conf
            )

            await fast_mail.send_message(
                message
            )

            return True

        except Exception as e:

            raise Exception(
                f"Email sending failed: {str(e)}"
            )

    # =====================================================
    # SEND OTP EMAIL
    # =====================================================

    @staticmethod
    async def send_otp_email(

        recipient: str,

        otp_code: str
    ):

        subject = (
            "ScanTrace Verification Code"
        )

        body = f"""
        <div
            style="
                font-family: Arial;
                padding: 20px;
            "
        >

            <h2>
                ScanTrace Email Verification
            </h2>

            <p>
                Your OTP verification code is:
            </p>

            <h1
                style="
                    letter-spacing: 5px;
                    color: #2563eb;
                "
            >
                {otp_code}
            </h1>

            <p>
                This OTP expires in
                10 minutes.
            </p>

            <p>
                If you did not request this,
                please ignore this email.
            </p>

        </div>
        """

        await EmailService.send_email(

            recipient=recipient,

            subject=subject,

            body=body
        )

        return True