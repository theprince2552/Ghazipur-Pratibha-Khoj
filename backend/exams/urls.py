from django.urls import path

from .views import (
    AvailableExamCentersView,
    StudentApplicationView,
    SubmitApplicationView,
    AdminApplicationListView,
    AdminAdmitCardListView,
    BulkCreateAdmitCardView,
    AdminExamCenterView,
)


urlpatterns = [

    path(
        "centers/",
        AvailableExamCentersView.as_view(),
        name="available-centers"
    ),

    path(
        "application/",
        StudentApplicationView.as_view(),
        name="student-application"
    ),

    path(
        "application/submit/",
        SubmitApplicationView.as_view(),
        name="submit-application"
    ),

    path(
        "admin/applications/",
        AdminApplicationListView.as_view(),
        name="admin-applications"
    ),

    path(
        "admin/admit-cards/",
        AdminAdmitCardListView.as_view(),
        name="admin-admit-cards"
    ),

    path(
        "admin/admit-cards/bulk-create/",
        BulkCreateAdmitCardView.as_view(),
        name="bulk-create-admit-cards"
    ),
    path(
    "admin/centers/",
    AdminExamCenterView.as_view(),
    name="admin-centers"
    ),

    path(
        "admin/centers/<int:pk>/",
        AdminExamCenterView.as_view(),
        name="admin-center-detail"
    ),

]