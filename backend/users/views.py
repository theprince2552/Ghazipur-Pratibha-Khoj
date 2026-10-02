from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from django.utils import timezone
from datetime import timedelta
from .serializers import RegisterSerializer, VerifyOTPSerializer, LoginSerializer
from core.models import OTPVerification
from core.email_service import send_otp_email
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


class RegisterView(APIView):

    @transaction.atomic
    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Validation failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()

        OTPVerification.objects.filter(
            user=user,
            purpose="register",
            is_used=False
        ).delete()

        otp_record = OTPVerification.objects.create(
            user=user,
            purpose="register"
        )

        try:

            send_otp_email(
                user.email,
                otp_record.otp
            )

        except Exception:

            transaction.set_rollback(True)

            return Response(
                {
                    "success": False,
                    "message": "Unable to send OTP email."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {
                "success": True,
                "message": "OTP sent successfully.",
                "data": {
                    "email": user.email
                }
            },
            status=status.HTTP_201_CREATED
        )

class VerifyOTPView(APIView):

    @transaction.atomic
    def post(self, request):

        serializer = VerifyOTPSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Invalid data.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
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
                    "message": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        otp_record = OTPVerification.objects.filter(
            user=user,
            purpose="register",
            is_used=False
        ).first()

        if not otp_record:

            return Response(
                {
                    "success": False,
                    "message": (
                        "OTP not found. "
                        "Please request a new OTP."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if otp_record.is_expired():

            return Response(
                {
                    "success": False,
                    "message": (
                        "OTP has expired. "
                        "Please request a new OTP."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if otp_record.otp != otp:

            return Response(
                {
                    "success": False,
                    "message": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -----------------------------------------
        # VERIFY USER
        # -----------------------------------------

        user.is_verified = True

        user.save(
            update_fields=["is_verified"]
        )

        # -----------------------------------------
        # MARK OTP USED
        # -----------------------------------------

        otp_record.is_used = True

        otp_record.save(
            update_fields=["is_used"]
        )

        # -----------------------------------------
        # GENERATE JWT
        # -----------------------------------------

        refresh = RefreshToken.for_user(user)

        # -----------------------------------------
        # RESPONSE
        # -----------------------------------------

        return Response(
            {
                "success": True,
                "message": "Email verified successfully.",

                "data": {

                    "access": str(
                        refresh.access_token
                    ),

                    "refresh": str(
                        refresh
                    ),

                    "user": {

                        "id": user.id,

                        "full_name": (
                            user.full_name
                        ),

                        "email": user.email,

                        "mobile": user.mobile,

                        "role": user.role,

                        "is_verified": (
                            user.is_verified
                        ),
                    }
                }
            },
            status=status.HTTP_200_OK,
        )

# =========================================================
# RESEND REGISTRATION OTP
# =========================================================

class ResendOTPView(APIView):

    @transaction.atomic
    def post(self, request):

        email = request.data.get("email", "").strip().lower()

        if not email:
            return Response(
                {
                    "success": False,
                    "message": "Email is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Already verified user cannot request registration OTP
        if user.is_verified:
            return Response(
                {
                    "success": False,
                    "message": "Email is already verified. Please login."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # CHECK RESEND COOLDOWN
        # -------------------------------------------------

        latest_otp = (
            OTPVerification.objects
            .filter(
                user=user,
                purpose="register",
                is_used=False
            )
            .order_by("-created_at")
            .first()
        )

        if latest_otp:

            cooldown_until = (
                latest_otp.created_at +
                timedelta(seconds=45)
            )

            now = timezone.now()

            if now < cooldown_until:

                remaining_seconds = int(
                    (cooldown_until - now).total_seconds()
                )

                return Response(
                    {
                        "success": False,
                        "message": (
                            f"Please wait {remaining_seconds} "
                            f"seconds before requesting another OTP."
                        ),
                        "retry_after": remaining_seconds,
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )

        # -------------------------------------------------
        # REMOVE OLD OTP
        # -------------------------------------------------

        OTPVerification.objects.filter(
            user=user,
            purpose="register",
            is_used=False
        ).delete()

        # -------------------------------------------------
        # CREATE NEW OTP
        # -------------------------------------------------

        otp_record = OTPVerification.objects.create(
            user=user,
            purpose="register"
        )

        # -------------------------------------------------
        # SEND EMAIL
        # -------------------------------------------------

        try:

            send_otp_email(
                user.email,
                otp_record.otp
            )

        except Exception:

            transaction.set_rollback(True)

            return Response(
                {
                    "success": False,
                    "message": "Unable to send OTP email."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # -------------------------------------------------
        # SUCCESS
        # -------------------------------------------------

        return Response(
            {
                "success": True,
                "message": "OTP resent successfully.",
                "data": {
                    "email": user.email,
                    "retry_after": 45
                }
            },
            status=status.HTTP_200_OK
        )

class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Validation failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Invalid email or password."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.check_password(password):
            return Response(
                {
                    "success": False,
                    "message": "Invalid email or password."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_verified:
            return Response(
                {
                    "success": False,
                    "message": "Please verify your email with OTP before login."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if not user.is_active:
            return Response(
                {
                    "success": False,
                    "message": "Your account is inactive."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "data": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "id": user.id,
                        "full_name": user.full_name,
                        "email": user.email,
                        "mobile": user.mobile,
                        "role": user.role,
                        "is_verified": user.is_verified,
                    }
                }
            },
            status=status.HTTP_200_OK,
        )   

from rest_framework.permissions import IsAuthenticated


class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response(
            {
                "success": True,
                "message": "User data fetched successfully.",
                "data": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "mobile": user.mobile,
                    "role": user.role,
                    "is_verified": user.is_verified,
                }
            },
            status=status.HTTP_200_OK,
        )     
# =========================================================
# ADMIN STUDENT MANAGEMENT
# =========================================================

from rest_framework.permissions import IsAuthenticated
from .serializers import (
    AdminStudentCreateSerializer,
    AdminStudentSerializer,
    AdminStudentUpdateSerializer,
)


class AdminStudentListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def check_admin(self, request):

        return (
            request.user.is_authenticated
            and request.user.role == "admin"
            and request.user.is_staff
        )

    # -----------------------------------------------------
    # GET - ALL STUDENTS
    # -----------------------------------------------------

    def get(self, request):

        if not self.check_admin(request):

            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        students = User.objects.filter(
            role="student"
        ).order_by("-date_joined")

        serializer = AdminStudentSerializer(
            students,
            many=True
        )

        return Response(
            {
                "success": True,
                "message": "Students fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # -----------------------------------------------------
    # POST - CREATE STUDENT
    # -----------------------------------------------------

    def post(self, request):

        if not self.check_admin(request):

            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = AdminStudentCreateSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Validation failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        student = serializer.save()

        response_serializer = AdminStudentSerializer(
            student
        )

        return Response(
            {
                "success": True,
                "message": "Student created successfully.",
                "data": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class AdminStudentDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def check_admin(self, request):

        return (
            request.user.is_authenticated
            and request.user.role == "admin"
            and request.user.is_staff
        )

    # -----------------------------------------------------
    # GET - SINGLE STUDENT
    # -----------------------------------------------------

    def get(self, request, student_id):

        if not self.check_admin(request):

            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:

            student = User.objects.get(
                id=student_id,
                role="student"
            )

        except User.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Student not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminStudentSerializer(
            student
        )

        return Response(
            {
                "success": True,
                "message": "Student fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # -----------------------------------------------------
    # PUT - UPDATE STUDENT
    # -----------------------------------------------------

    def put(self, request, student_id):

        if not self.check_admin(request):

            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:

            student = User.objects.get(
                id=student_id,
                role="student"
            )

        except User.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Student not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminStudentUpdateSerializer(
            student,
            data=request.data,
            partial=True
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Validation failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        student = serializer.save()

        response_serializer = AdminStudentSerializer(
            student
        )

        return Response(
            {
                "success": True,
                "message": "Student updated successfully.",
                "data": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )
# =========================================================
# ADMIN STUDENT COMPLETE DETAILS
# =========================================================

from exams.models import StudentApplication, AdmitCard
from payments.models import Payment


class AdminStudentCompleteDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def check_admin(self, request):

        return (
            request.user.is_authenticated
            and request.user.role == "admin"
            and request.user.is_staff
        )

    def get(self, request, student_id):

        if not self.check_admin(request):

            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            student = User.objects.get(
                id=student_id,
                role="student"
            )

        except User.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Student not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # -------------------------------------------------
        # APPLICATION
        # -------------------------------------------------

        application = StudentApplication.objects.filter(
            user=student
        ).select_related(
            "exam_center"
        ).first()

        application_data = None

        if application:

            application_data = {
                "id": application.id,
                "application_number": application.application_number,
                "student_full_name": application.student_full_name,
                "father_name": application.father_name,
                "mother_name": application.mother_name,
                "aadhar_number": application.aadhar_number,
                "gender": application.gender,
                "mobile_number": application.mobile_number,
                "student_class": application.student_class,
                "school_name": application.school_name,
                "board": application.board,
                "village": application.village,
                "post": application.post,
                "pin_code": application.pin_code,
                "district": application.district,
                "state": application.state,

                "exam_center": (
                    {
                        "id": application.exam_center.id,
                        "name": application.exam_center.name,
                        "address": application.exam_center.address,
                    }
                    if application.exam_center
                    else None
                ),

                "status": application.status,
                "created_at": application.created_at,
                "updated_at": application.updated_at,
                "submitted_at": application.submitted_at,
            }

        # -------------------------------------------------
        # PAYMENT
        # -------------------------------------------------

        payment = Payment.objects.filter(
            user=student
        ).order_by("-created_at").first()

        payment_data = None

        if payment:

            payment_data = {
                "id": payment.id,
                "amount": payment.amount,
                "status": payment.status,
                "payment_method": payment.payment_method,
                "razorpay_order_id": payment.razorpay_order_id,
                "razorpay_payment_id": payment.razorpay_payment_id,
                "created_at": payment.created_at,
                "updated_at": payment.updated_at,
            }

        # -------------------------------------------------
        # ADMIT CARD
        # -------------------------------------------------

        admit_card_data = None

        if application:

            admit_card = AdmitCard.objects.filter(
                application=application
            ).select_related(
                "exam_center"
            ).first()

            if admit_card:

                admit_card_data = {
                    "id": admit_card.id,
                    "exam_center": (
                        {
                            "id": admit_card.exam_center.id,
                            "name": admit_card.exam_center.name,
                            "address": admit_card.exam_center.address,
                        }
                        if admit_card.exam_center
                        else None
                    ),
                    "exam_venue": admit_card.exam_venue,
                    "exam_date": admit_card.exam_date,
                    "exam_time": admit_card.exam_time,
                    "reporting_time": admit_card.reporting_time,
                    "created_at": admit_card.created_at,
                    "updated_at": admit_card.updated_at,
                }

        # -------------------------------------------------
        # FINAL RESPONSE
        # -------------------------------------------------

        return Response(
            {
                "success": True,
                "message": "Student details fetched successfully.",
                "data": {
                    "student": {
                        "id": student.id,
                        "full_name": student.full_name,
                        "email": student.email,
                        "mobile": student.mobile,
                        "role": student.role,
                        "is_verified": student.is_verified,
                        "is_active": student.is_active,
                        "date_joined": student.date_joined,
                    },

                    "application": application_data,

                    "payment": payment_data,

                    "admit_card": admit_card_data,
                }
            },
            status=status.HTTP_200_OK,
        )    
# =========================================================
# ADMIN STUDENT LIST + SEARCH
# =========================================================

class AdminStudentManagementListView(APIView):

    permission_classes = [IsAuthenticated]

    def check_admin(self, request):

        return (
            request.user.is_authenticated
            and request.user.role == "admin"
            and request.user.is_staff
        )

    def get(self, request):

        if not self.check_admin(request):

            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # -------------------------------------------------
        # SEARCH
        # -------------------------------------------------

        search = request.query_params.get(
            "search",
            ""
        ).strip()

        students = User.objects.filter(
            role="student"
        ).order_by("-date_joined")

        if search:

            students = students.filter(
                full_name__icontains=search
            ) | students.filter(
                email__icontains=search
            ) | students.filter(
                mobile__icontains=search
            )

        # -------------------------------------------------
        # BUILD STUDENT LIST
        # -------------------------------------------------

        student_list = []

        for student in students:

            application = (
                StudentApplication.objects
                .filter(user=student)
                .select_related("exam_center")
                .first()
            )

            payment = (
                Payment.objects
                .filter(user=student)
                .order_by("-created_at")
                .first()
            )

            admit_card_exists = False

            if application:

                admit_card_exists = AdmitCard.objects.filter(
                    application=application
                ).exists()

            student_list.append(
                {
                    "id": student.id,

                    "full_name": student.full_name,

                    "email": student.email,

                    "mobile": student.mobile,

                    "is_verified": student.is_verified,

                    "is_active": student.is_active,

                    "date_joined": student.date_joined,

                    # ---------------------------------
                    # APPLICATION
                    # ---------------------------------

                    "application": {
                        "id": application.id,
                        "application_number": (
                            application.application_number
                        ),
                        "student_class": (
                            application.student_class
                        ),
                        "school_name": (
                            application.school_name
                        ),
                        "status": application.status,
                        "exam_center": (
                            application.exam_center.name
                            if application.exam_center
                            else None
                        ),
                    } if application else None,

                    # ---------------------------------
                    # PAYMENT
                    # ---------------------------------

                    "payment": {
                        "amount": payment.amount,
                        "status": payment.status,
                        "payment_method": (
                            payment.payment_method
                        ),
                    } if payment else None,

                    # ---------------------------------
                    # ADMIT CARD
                    # ---------------------------------

                    "admit_card_created": admit_card_exists,
                }
            )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return Response(
            {
                "success": True,
                "message": "Student list fetched successfully.",
                "count": len(student_list),
                "data": student_list,
            },
            status=status.HTTP_200_OK,
        )    