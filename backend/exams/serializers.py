from rest_framework import serializers

from .models import ExamCenter, StudentApplication, AdmitCard


# =========================================================
# EXAM CENTER
# =========================================================

class ExamCenterSerializer(serializers.ModelSerializer):

    available_seats = serializers.IntegerField(
        read_only=True
    )

    class Meta:
        model = ExamCenter
        fields = (
            "id",
            "name",
            "address",
            "capacity",
            "available_seats",
            "is_active",
        )


# =========================================================
# STUDENT APPLICATION
# EXISTING STUDENT API
# =========================================================

class StudentApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentApplication

        fields = (
            "id",
            "application_number",
            "student_full_name",
            "father_name",
            "mother_name",
            "aadhar_number",
            "gender",
            "mobile_number",
            "student_class",
            "school_name",
            "board",
            "village",
            "post",
            "pin_code",
            "district",
            "state",
            "exam_center",
            "status",
            "created_at",
            "updated_at",
            "submitted_at",
        )

        read_only_fields = (
            "id",
            "application_number",
            "status",
            "created_at",
            "updated_at",
            "submitted_at",
        )


# =========================================================
# ADMIN APPLICATION LIST
# =========================================================

class AdminApplicationSerializer(serializers.ModelSerializer):

    payment_status = serializers.SerializerMethodField()

    admit_card_created = serializers.SerializerMethodField()

    exam_center_name = serializers.SerializerMethodField()

    class Meta:
        model = StudentApplication

        fields = (
            "id",
            "application_number",
            "student_full_name",
            "father_name",
            "mother_name",
            "mobile_number",
            "student_class",
            "school_name",
            "board",
            "village",
            "district",
            "state",
            "exam_center",
            "exam_center_name",
            "status",
            "submitted_at",
            "payment_status",
            "admit_card_created",
        )

    def get_payment_status(self, obj):

        return (
            "paid"
            if obj.user.payments.filter(
                status="paid"
            ).exists()
            else "unpaid"
        )

    def get_admit_card_created(self, obj):

        return hasattr(obj, "admit_card")

    def get_exam_center_name(self, obj):

        if obj.exam_center:
            return obj.exam_center.name

        return "Not Assigned"

# =========================================================
# ADMIT CARD
# =========================================================

class AdmitCardSerializer(serializers.ModelSerializer):
    application_number = serializers.CharField(
        source="application.application_number",
        read_only=True
    )

    student_name = serializers.CharField(
        source="application.student_full_name",
        read_only=True
    )

    class Meta:
        model = AdmitCard
        fields = (
            "id",
            "application",
            "application_number",
            "student_name",
            "exam_center",
            "exam_venue",
            "exam_date",
            "exam_time",
            "reporting_time",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "created_at",
            "updated_at",
        )


# =========================================================
# BULK ADMIT CARD CREATION
# =========================================================

class BulkAdmitCardSerializer(serializers.Serializer):
    application_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )

    exam_center = serializers.PrimaryKeyRelatedField(
        queryset=ExamCenter.objects.filter(is_active=True)
    )

    exam_venue = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True
    )

    exam_date = serializers.DateField()

    exam_time = serializers.TimeField()

    reporting_time = serializers.TimeField()

    def validate_application_ids(self, value):
        if len(value) != len(set(value)):
            raise serializers.ValidationError(
                "Duplicate application IDs are not allowed."
            )

        return value