from django.conf import settings
from django.db import models
from django.utils import timezone


# =========================================================
# EXAM CENTER
# =========================================================

class ExamCenter(models.Model):

    name = models.CharField(
        max_length=150,
        unique=True
    )

    address = models.CharField(
        max_length=255,
        blank=True
    )

    capacity = models.PositiveIntegerField(
        default=200
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    @property
    def total_booked(self):
        return self.applications.filter(
            status="submitted"
        ).count()

    @property
    def available_seats(self):
        return max(
            self.capacity - self.total_booked,
            0
        )


# =========================================================
# STUDENT APPLICATION
# =========================================================

class StudentApplication(models.Model):

    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    )

    BOARD_CHOICES = (
        ("UPMSP", "UP Board"),
        ("CBSE", "CBSE"),
        ("ICSE", "ICSE"),
        ("OTHER", "Other"),
    )

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("submitted", "Submitted"),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="application"
    )

    application_number = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        null=True,
        blank=True
    )

    student_full_name = models.CharField(
        max_length=150
    )

    father_name = models.CharField(
        max_length=150
    )

    mother_name = models.CharField(
        max_length=150
    )

    aadhar_number = models.CharField(
        max_length=30
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )

    mobile_number = models.CharField(
        max_length=10
    )

    student_class = models.CharField(
        max_length=50
    )

    school_name = models.CharField(
        max_length=200
    )

    board = models.CharField(
        max_length=20,
        choices=BOARD_CHOICES
    )

    village = models.CharField(
        max_length=150
    )

    post = models.CharField(
        max_length=150
    )

    pin_code = models.CharField(
        max_length=6
    )

    district = models.CharField(
        max_length=100
    )

    state = models.CharField(
        max_length=100
    )

    exam_center = models.ForeignKey(
        ExamCenter,
        on_delete=models.PROTECT,
        related_name="applications",
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    submitted_at = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):

        if not self.application_number:

            year = timezone.now().year

            existing_numbers = (
                StudentApplication.objects
                .filter(
                    application_number__startswith=f"GPK{year}"
                )
                .values_list(
                    "application_number",
                    flat=True
                )
            )

            max_number = 0

            for number in existing_numbers:

                try:
                    sequence = int(number[-6:])

                    if sequence > max_number:
                        max_number = sequence

                except (ValueError, TypeError):
                    continue

            self.application_number = (
                f"GPK{year}{max_number + 1:06d}"
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return (
            f"{self.application_number or 'New'} - "
            f"{self.student_full_name} - "
            f"{self.status}"
        )


# =========================================================
# ADMIT CARD
# =========================================================

class AdmitCard(models.Model):

    application = models.OneToOneField(
        StudentApplication,
        on_delete=models.CASCADE,
        related_name="admit_card"
    )

    exam_center = models.ForeignKey(
        ExamCenter,
        on_delete=models.PROTECT,
        related_name="admit_cards"
    )

    exam_venue = models.CharField(
        max_length=255,
        blank=True
    )

    exam_date = models.DateField()

    exam_time = models.TimeField()

    reporting_time = models.TimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):

        return (
            f"{self.application.application_number} - "
            f"{self.application.student_full_name}"
        )