import os
import resend


def send_otp_email(email, otp):
    subject = "Ghazipur Pratibha Khoj - OTP Verification"

    message = f"""
Dear Student,

Your OTP is:

{otp}

This OTP is valid for 10 minutes.

Do not share this OTP with anyone.

Regards,
Ghazipur Pratibha Khoj
Nishchay Academy Association
"""

    api_key = os.getenv("RESEND_API_KEY")

    if not api_key:
        raise Exception("RESEND_API_KEY is not configured.")

    resend.api_key = api_key

    return resend.Emails.send(
        {
            "from": "noreply@ghazipurpratibhakhoj.com",
            "to": [email],
            "subject": subject,
            "text": message,
        }
    )