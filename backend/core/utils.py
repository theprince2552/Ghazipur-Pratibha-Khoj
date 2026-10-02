from django.utils import timezone


def is_otp_expired(otp_instance):
    return timezone.now() > otp_instance.expires_at