from django.urls import path

from .views import (
    AdminMessageStudentListView,
    AdminSendMessageView,
    AdminMessageHistoryView,
    StudentMessageListView,
    StudentMessageReadView,
)


urlpatterns = [
    path(
        "admin/students/",
        AdminMessageStudentListView.as_view(),
        name="admin-message-students",
    ),

    path(
        "admin/send/",
        AdminSendMessageView.as_view(),
        name="admin-send-message",
    ),

    path(
        "admin/history/",
        AdminMessageHistoryView.as_view(),
        name="admin-message-history",
    ),

    path(
        "student/",
        StudentMessageListView.as_view(),
        name="student-messages",
    ),

    path(
        "student/<int:message_id>/read/",
        StudentMessageReadView.as_view(),
        name="student-message-read",
    ),
]