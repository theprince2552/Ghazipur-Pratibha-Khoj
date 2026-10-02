from django.contrib import admin
from .models import OTPVerification


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "otp",
        "purpose",
        "is_used",
        "expires_at",
    )

    search_fields = (
        "user__email",
        "user__mobile",
    )

    list_filter = (
        "purpose",
        "is_used",
    )