from django.contrib import admin

from .models import ExamCenter, StudentApplication


@admin.register(ExamCenter)
class ExamCenterAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "capacity",
        "total_booked",
        "available_seats",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
        "address",
    )


@admin.register(StudentApplication)
class StudentApplicationAdmin(admin.ModelAdmin):

    list_display = (
        "student_full_name",
        "mobile_number",
        "student_class",
        "board",
        "exam_center",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "board",
        "gender",
        "exam_center",
    )

    search_fields = (
        "student_full_name",
        "father_name",
        "mobile_number",
        "aadhar_number",
    )