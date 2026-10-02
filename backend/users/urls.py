from django.urls import path

from .views import (
    RegisterView,
    VerifyOTPView,
    ResendOTPView,
    LoginView,
    MeView,
    AdminStudentListCreateView,
    AdminStudentDetailView,
    AdminStudentCompleteDetailView,
    AdminStudentManagementListView,
)


urlpatterns = [

    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "verify-otp/",
        VerifyOTPView.as_view(),
        name="verify-otp"
    ),

    path(
        "resend-otp/",
        ResendOTPView.as_view(),
        name="resend-otp"
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    path(
        "me/",
        MeView.as_view(),
        name="me"
    ),

    path(
        "admin/students/",
        AdminStudentListCreateView.as_view(),
        name="admin-student-list-create",
    ),

    path(
        "admin/students/<int:student_id>/",
        AdminStudentDetailView.as_view(),
        name="admin-student-detail",
    ),
    path(
        "admin/students/<int:student_id>/complete/",
        AdminStudentCompleteDetailView.as_view(),
        name="admin-student-complete-detail",
    ),
    path(
        "admin/student-management/",
        AdminStudentManagementListView.as_view(),
        name="admin-student-management",
    ),

]