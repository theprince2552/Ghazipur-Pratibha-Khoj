from django.core.mail import send_mail
from django.conf import settings


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

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )