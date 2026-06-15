import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from settings import settings

def send_invitation_email(to_email: str, owner_name: str, permission_level: str):
    if not settings.SMTP_SERVER or not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print("[SMTP] Mail configurations missing. Skipping email send.")
        return False

    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"ScanTrace Shared Access Invitation from {owner_name}"
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM}>"
        msg["To"] = to_email

        # HTML Content
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #020617; color: #F8FAFC; padding: 24px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #0B1329; border: 1px solid #1E293B; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 28px; font-weight: 800; color: #4ADE80; letter-spacing: -0.5px;">🌿 ScanTrace</span>
                <div style="font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">AI Medical Intelligence</div>
              </div>
              <h2 style="color: #4ADE80; margin-top: 0; font-family: sans-serif; text-align: center;">Access Invitation</h2>
              <p style="color: #94A3B8; font-size: 15px; line-height: 24px;">
                Hello,
              </p>
              <p style="color: #94A3B8; font-size: 15px; line-height: 24px;">
                <strong>{owner_name}</strong> has shared their ScanTrace health profile and medical reports with you.
              </p>
              <div style="background-color: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 16px; margin: 24px 0; border: 1px solid rgba(255, 255, 255, 0.05);">
                <p style="margin: 0; color: #F1F5F9; font-size: 14px;"><strong>Invite Details:</strong></p>
                <p style="margin: 6px 0 0 0; color: #94A3B8; font-size: 14px;">• Owner: {owner_name}</p>
                <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 14px;">• Permission Level: {permission_level}</p>
                <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 14px;">• Duration: 1 Year (Expires automatically)</p>
              </div>
              <p style="color: #94A3B8; font-size: 15px; line-height: 24px;">
                To accept this invite and view their profile, please sign in or register on the ScanTrace app using your email address:
              </p>
              <p style="text-align: center; margin: 20px 0;">
                <span style="background-color: #1E293B; color: #4ADE80; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; border: 1px solid rgba(74, 222, 128, 0.2);">
                  {to_email}
                </span>
              </p>
              <p style="color: #64748B; font-size: 13px; line-height: 20px;">
                If you don't have an account yet, simply sign up with the email above, and the shared profile will be automatically connected to your dashboard.
              </p>
              <hr style="border: 0; border-top: 1px solid #1E293B; margin: 30px 0;" />
              <p style="color: #475569; font-size: 11px; text-align: center; margin-bottom: 0;">
                This is an automated email from ScanTrace AI Healthcare Platform. Please do not reply directly to this address.
              </p>
            </div>
          </body>
        </html>
        """

        msg.attach(MIMEText(html, "html"))

        # Send email
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM, to_email, msg.as_string())
        
        print(f"[SMTP] Invitation email successfully sent to {to_email}")
        return True
    except Exception as e:
        print(f"[SMTP] Failed to send email to {to_email}: {e}")
        return False


def send_password_reset_email(to_email: str, reset_link: str):
    if not settings.SMTP_SERVER or not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print("[SMTP] Mail configurations missing. Skipping password reset email.")
        return False

    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Reset Your ScanTrace Password"
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM}>"
        msg["To"] = to_email

        # HTML Content
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #020617; color: #F8FAFC; padding: 24px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #0B1329; border: 1px solid #1E293B; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 28px; font-weight: 800; color: #4ADE80; letter-spacing: -0.5px;">🌿 ScanTrace</span>
                <div style="font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">AI Medical Intelligence</div>
              </div>
              <h2 style="color: #4ADE80; margin-top: 0; font-family: sans-serif; text-align: center;">Reset Your Password</h2>
              <p style="color: #94A3B8; font-size: 15px; line-height: 24px;">
                Hello,
              </p>
              <p style="color: #94A3B8; font-size: 15px; line-height: 24px;">
                We received a request to reset your password for your ScanTrace account. Click the button below to choose a new password:
              </p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" style="background-color: #22C55E; color: #FFFFFF; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; text-decoration: none; display: inline-block;">
                  Reset Password
                </a>
              </p>
              <p style="color: #94A3B8; font-size: 14px; line-height: 22px;">
                If the button above does not work, copy and paste the following link into your browser:
              </p>
              <p style="word-break: break-all; color: #3B82F6; font-size: 13px;">
                <a href="{reset_link}" style="color: #3B82F6;">{reset_link}</a>
              </p>
              <p style="color: #64748B; font-size: 13px; line-height: 20px; margin-top: 24px;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain secure and unchanged.
              </p>
              <hr style="border: 0; border-top: 1px solid #1E293B; margin: 30px 0;" />
              <p style="color: #475569; font-size: 11px; text-align: center; margin-bottom: 0;">
                This is an automated email from ScanTrace AI Healthcare Platform. Please do not reply directly to this address.
              </p>
            </div>
          </body>
        </html>
        """

        msg.attach(MIMEText(html, "html"))

        # Send email
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM, to_email, msg.as_string())
        
        print(f"[SMTP] Password reset email successfully sent to {to_email}")
        return True
    except Exception as e:
        print(f"[SMTP] Failed to send password reset email to {to_email}: {e}")
        return False
