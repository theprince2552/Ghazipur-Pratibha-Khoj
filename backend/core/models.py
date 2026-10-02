from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import random


class OTPVerification(models.Model):

    PURPOSE_CHOICES = (
        ("register", "Register"),
        ("login", "Login"),
        ("forgot_password", "Forgot Password"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="otp_records"
    )

    otp = models.CharField(max_length=6)

    purpose = models.CharField(
        max_length=20,
        choices=PURPOSE_CHOICES,
        default="register"
    )

    is_used = models.BooleanField(default=False)

    expires_at = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):

        if not self.otp:
            self.otp = str(random.randint(100000, 999999))

        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)

        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.user.email} - {self.otp}"