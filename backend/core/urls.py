from django.urls import path

from .views import (
    ForgotPasswordView,
    VerifyForgotPasswordOTPView,
    ResetPasswordView,
)


urlpatterns = [

    path(
        "forgot-password/",
        ForgotPasswordView.as_view(),
        name="forgot-password"
    ),

    path(
        "verify-forgot-otp/",
        VerifyForgotPasswordOTPView.as_view(),
        name="verify-forgot-otp"
    ),

    path(
        "reset-password/",
        ResetPasswordView.as_view(),
        name="reset-password"
    ),

]