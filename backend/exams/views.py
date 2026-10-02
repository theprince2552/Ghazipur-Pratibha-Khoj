from django.db import transaction
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import ExamCenter, AdmitCard, StudentApplication
from .serializers import (
    ExamCenterSerializer,
    StudentApplicationSerializer,
    AdminApplicationSerializer,
    AdmitCardSerializer,
    BulkAdmitCardSerializer,
)


# =========================================================
# AVAILABLE EXAM CENTERS
# =========================================================

class AvailableExamCentersView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        centers = ExamCenter.objects.filter(
            is_active=True
        )

        available_centers = []

        for center in centers:

            if center.available_seats > 0:
                available_centers.append(center)

        serializer = ExamCenterSerializer(
            available_centers,
            many=True
        )

        return Response(
            {
                "success": True,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

# =========================================================
# ADMIN EXAM CENTER MANAGEMENT
# =========================================================

class AdminExamCenterView(APIView):

    permission_classes = [IsAuthenticated]

    def check_admin(self, request):

        return (
            request.user.role == "admin"
            and request.user.is_staff
        )

    # -----------------------------------------------------
    # GET ALL CENTERS
    # -----------------------------------------------------

    def get(self, request):

        if not self.check_admin(request):

            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        centers = ExamCenter.objects.all().order_by("name")

        serializer = ExamCenterSerializer(
            centers,
            many=True
        )

        return Response(
            {
                "success": True,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    # -----------------------------------------------------
    # ADD CENTER
    # -----------------------------------------------------

    def post(self, request):

        if not self.check_admin(request):

            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ExamCenterSerializer(
            data=request.data
        )

        if serializer.is_valid():

            center = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Exam center added successfully.",
                    "data": ExamCenterSerializer(center).data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------------------------
    # UPDATE CENTER
    # -----------------------------------------------------

    def put(self, request, pk):

        if not self.check_admin(request):

            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:

            center = ExamCenter.objects.get(pk=pk)

        except ExamCenter.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Exam center not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ExamCenterSerializer(
            center,
            data=request.data
        )

        if serializer.is_valid():

            center = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Exam center updated successfully.",
                    "data": ExamCenterSerializer(center).data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------------------------
    # DELETE / DEACTIVATE CENTER
    # -----------------------------------------------------

    def delete(self, request, pk):

        if not self.check_admin(request):

            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:

            center = ExamCenter.objects.get(pk=pk)

        except ExamCenter.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Exam center not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Don't actually delete the center.
        # Deactivate it so old applications remain safe.

        center.is_active = False
        center.save(update_fields=["is_active", "updated_at"])

        return Response(
            {
                "success": True,
                "message": "Exam center deactivated successfully."
            },
            status=status.HTTP_200_OK
        )

# =========================================================
# STUDENT APPLICATION
# =========================================================

class StudentApplicationView(APIView):

    permission_classes = [IsAuthenticated]

    # -----------------------------------------------------
    # GET APPLICATION
    # -----------------------------------------------------

    def get(self, request):

        application = StudentApplication.objects.filter(
            user=request.user
        ).first()

        if not application:

            return Response(
                {
                    "success": True,
                    "data": None,
                    "message": "Application not created yet."
                },
                status=status.HTTP_200_OK
            )

        serializer = StudentApplicationSerializer(
            application
        )

        return Response(
            {
                "success": True,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    # -----------------------------------------------------
    # SAVE / UPDATE DRAFT
    # -----------------------------------------------------

    def post(self, request):

        application = StudentApplication.objects.filter(
            user=request.user
        ).first()

        # Already submitted application cannot be edited
        if application and application.status == "submitted":

            return Response(
                {
                    "success": False,
                    "message": "Application already submitted."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Existing draft
        if application:

            serializer = StudentApplicationSerializer(
                application,
                data=request.data,
                partial=True
            )

        # First time application
        else:

            serializer = StudentApplicationSerializer(
                data=request.data
            )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Validation failed.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        application = serializer.save(
            user=request.user,
            status="draft"
        )

        return Response(
            {
                "success": True,
                "message": "Application draft saved successfully.",
                "data": StudentApplicationSerializer(
                    application
                ).data
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# FINAL SUBMIT APPLICATION
# =========================================================

class SubmitApplicationView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        # -------------------------------------------------
        # Get student's application and lock it
        # -------------------------------------------------

        try:

            application = (
                StudentApplication.objects
                .select_for_update()
                .get(user=request.user)
            )

        except StudentApplication.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Please save your application first."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Already submitted
        # -------------------------------------------------

        if application.status == "submitted":

            return Response(
                {
                    "success": False,
                    "message": "Application already submitted."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Validate complete application data
        # -------------------------------------------------

        serializer = StudentApplicationSerializer(
            application,
            data=request.data,
            partial=False
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Please complete all required fields.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Exam center required
        # -------------------------------------------------

        center = serializer.validated_data.get(
            "exam_center"
        )

        if not center:

            return Response(
                {
                    "success": False,
                    "message": "Please select an exam center."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Lock the selected center
        # -------------------------------------------------

        center = (
            ExamCenter.objects
            .select_for_update()
            .get(id=center.id)
        )

        # -------------------------------------------------
        # Check active status
        # -------------------------------------------------

        if not center.is_active:

            return Response(
                {
                    "success": False,
                    "message": "This exam center is currently unavailable."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Count submitted applications
        # -------------------------------------------------

        booked_seats = StudentApplication.objects.filter(
            exam_center=center,
            status="submitted"
        ).count()

        # -------------------------------------------------
        # Capacity check
        # -------------------------------------------------

        if booked_seats >= center.capacity:

            return Response(
                {
                    "success": False,
                    "message": (
                        "This exam center is full. "
                        "Please select another center."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Save application
        # -------------------------------------------------

        application = serializer.save()

        application.status = "submitted"
        application.submitted_at = timezone.now()

        application.save(
            update_fields=[
                "status",
                "submitted_at",
                "updated_at",
            ]
        )

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return Response(
            {
                "success": True,
                "message": "Application submitted successfully.",
                "data": StudentApplicationSerializer(
                    application
                ).data
            },
            status=status.HTTP_200_OK
        )

        # =========================================================
# ADMIN PERMISSION
# =========================================================

class IsAdminUser(APIView):

    def check_admin(self, request):

        if not request.user.is_authenticated:
            return False

        return (
            request.user.role == "admin"
            and request.user.is_staff
        )


# =========================================================
# ADMIN APPLICATION LIST
# =========================================================

class AdminApplicationListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if (
            request.user.role != "admin"
            or not request.user.is_staff
        ):
            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        applications = (
            StudentApplication.objects
            .select_related(
                "user",
                "exam_center"
            )
            .filter(
                status="submitted"
            )
            .order_by("-submitted_at", "-id")
        )

        serializer = AdminApplicationSerializer(
            applications,
            many=True
        )

        return Response(
            {
                "success": True,
                "count": applications.count(),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ADMIN ADMIT CARD LIST
# =========================================================

class AdminAdmitCardListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if (
            request.user.role != "admin"
            or not request.user.is_staff
        ):
            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        admit_cards = (
            AdmitCard.objects
            .select_related(
                "application",
                "exam_center"
            )
            .all()
        )

        serializer = AdmitCardSerializer(
            admit_cards,
            many=True
        )

        return Response(
            {
                "success": True,
                "count": admit_cards.count(),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# BULK CREATE ADMIT CARDS
# =========================================================

class BulkCreateAdmitCardView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        # -------------------------------------------------
        # ADMIN CHECK
        # -------------------------------------------------

        if (
            request.user.role != "admin"
            or not request.user.is_staff
        ):
            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # -------------------------------------------------
        # VALIDATE REQUEST
        # -------------------------------------------------

        serializer = BulkAdmitCardSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Invalid data.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        application_ids = serializer.validated_data[
            "application_ids"
        ]

        exam_center = serializer.validated_data[
            "exam_center"
        ]

        exam_venue = serializer.validated_data.get("exam_venue", "")

        exam_date = serializer.validated_data[
            "exam_date"
        ]

        exam_time = serializer.validated_data[
            "exam_time"
        ]

        reporting_time = serializer.validated_data[
            "reporting_time"
        ]

        # -------------------------------------------------
        # CREATE ADMIT CARDS
        # -------------------------------------------------

        created_cards = []
        already_created = []
        skipped_unpaid = []
        skipped_draft = []

        with transaction.atomic():

            applications = (
                StudentApplication.objects
                .select_for_update()
                .select_related("user")
                .filter(
                    id__in=application_ids
                )
            )

            application_map = {
                application.id: application
                for application in applications
            }

            for application_id in application_ids:

                application = application_map.get(
                    application_id
                )

                # Application doesn't exist
                if not application:
                    continue

                # -------------------------------------------------
                # MUST BE SUBMITTED
                # -------------------------------------------------

                if application.status != "submitted":

                    skipped_draft.append(
                        application.application_number
                    )

                    continue

                # -------------------------------------------------
                # MUST BE PAID
                # -------------------------------------------------

                is_paid = (
                    application.user.payments
                    .filter(status="paid")
                    .exists()
                )

                if not is_paid:

                    skipped_unpaid.append(
                        application.application_number
                    )

                    continue

                # -------------------------------------------------
                # DON'T CREATE DUPLICATE
                # -------------------------------------------------

                if hasattr(application, "admit_card"):

                    already_created.append(
                        application.application_number
                    )

                    continue

                # -------------------------------------------------
                # CREATE ADMIT CARD
                # -------------------------------------------------

                admit_card = AdmitCard.objects.create(

                    application=application,

                    exam_center=exam_center,

                    exam_venue=exam_venue,

                    exam_date=exam_date,

                    exam_time=exam_time,

                    reporting_time=reporting_time,
                )

                created_cards.append(
                    admit_card.application.application_number
                )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return Response(
            {
                "success": True,

                "message": (
                    f"{len(created_cards)} Admit Card(s) "
                    f"created successfully."
                ),

                "created_count": len(created_cards),

                "already_created_count": len(
                    already_created
                ),

                "unpaid_count": len(
                    skipped_unpaid
                ),

                "draft_count": len(
                    skipped_draft
                ),

                "created": created_cards,

                "already_created": already_created,

                "unpaid": skipped_unpaid,

                "draft": skipped_draft,
            },
            status=status.HTTP_201_CREATED
        )