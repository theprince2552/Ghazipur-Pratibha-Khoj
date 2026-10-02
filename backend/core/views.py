from django.shortcuts import render
import random

from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from django.core import signing

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from users.models import User
from .models import OTPVerification

from users.serializers import (
    ForgotPasswordSerializer,
    VerifyOTPSerializer,
    ResetPasswordSerializer,
)

# =========================================================
# FORGOT PASSWORD - SEND OTP
# =========================================================

class ForgotPasswordView(APIView):

    def post(self, request):

        serializer = ForgotPasswordSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data["email"]

        try:

            user = User.objects.get(
                email=email
            )

        except User.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "No account found with this email."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Old forgot-password OTPs invalidate
        OTPVerification.objects.filter(
            user=user,
            purpose="forgot_password",
            is_used=False
        ).update(
            is_used=True
        )

        # New OTP
        otp = str(
            random.randint(100000, 999999)
        )

        otp_record = OTPVerification.objects.create(
            user=user,
            otp=otp,
            purpose="forgot_password",
            expires_at=(
                timezone.now()
                + timedelta(minutes=10)
            )
        )

        # Email
        send_mail(
            subject="Ghazipur Pratibha Khoj - Password Reset OTP",

            message=f"""
Hello {user.full_name},

Your OTP for resetting your password is:

{otp}

This OTP is valid for 10 minutes.

If you did not request a password reset,
please ignore this email.

Regards,
Ghazipur Pratibha Khoj
""",

            from_email=settings.DEFAULT_FROM_EMAIL,

            recipient_list=[user.email],

            fail_silently=False,
        )

        return Response(
            {
                "success": True,
                "message": "OTP sent successfully."
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# VERIFY FORGOT PASSWORD OTP
# =========================================================

class VerifyForgotPasswordOTPView(APIView):

    def post(self, request):

        serializer = VerifyOTPSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        try:

            user = User.objects.get(
                email=email
            )

        except User.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        otp_record = (
            OTPVerification.objects
            .filter(
                user=user,
                otp=otp,
                purpose="forgot_password",
                is_used=False
            )
            .first()
        )

        if not otp_record:

            return Response(
                {
                    "success": False,
                    "message": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if otp_record.is_expired():

            return Response(
                {
                    "success": False,
                    "message": "OTP has expired."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Secure temporary reset token
        reset_token = signing.dumps(
            {
                "user_id": user.id,
                "otp_id": otp_record.id,
            }
        )

        return Response(
            {
                "success": True,
                "message": "OTP verified successfully.",
                "reset_token": reset_token
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# RESET PASSWORD
# =========================================================

class ResetPasswordView(APIView):

    def post(self, request):

        reset_token = request.data.get(
            "reset_token"
        )

        if not reset_token:

            return Response(
                {
                    "success": False,
                    "message": "Reset token is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify token
        try:

            data = signing.loads(
                reset_token,
                max_age=600
            )

        except signing.BadSignature:

            return Response(
                {
                    "success": False,
                    "message": "Invalid or expired reset session."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            user = User.objects.get(
                id=data["user_id"]
            )

            otp_record = OTPVerification.objects.get(
                id=data["otp_id"],
                user=user,
                purpose="forgot_password",
                is_used=False
            )

        except (
            User.DoesNotExist,
            OTPVerification.DoesNotExist
        ):

            return Response(
                {
                    "success": False,
                    "message": "Invalid password reset session."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # OTP expiry check
        if otp_record.is_expired():

            return Response(
                {
                    "success": False,
                    "message": "OTP session has expired."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ResetPasswordSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Change password
        user.set_password(
            serializer.validated_data["new_password"]
        )

        user.save(
            update_fields=["password"]
        )

        # OTP can never be reused
        otp_record.is_used = True

        otp_record.save(
            update_fields=["is_used"]
        )

        return Response(
            {
                "success": True,
                "message": "Password reset successfully. Please login."
            },
            status=status.HTTP_200_OK
        )

