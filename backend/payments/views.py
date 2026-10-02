import razorpay

from django.conf import settings
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from .models import Payment


# =========================================================
# CREATE RAZORPAY ORDER
# =========================================================

class CreateOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        amount = 100

        try:

            client = razorpay.Client(
                auth=(
                    settings.RAZORPAY_KEY_ID,
                    settings.RAZORPAY_KEY_SECRET,
                )
            )

            order = client.order.create(
                {
                    "amount": amount * 100,
                    "currency": "INR",
                    "receipt": f"GPK-{request.user.id}",
                }
            )

            Payment.objects.create(
                user=request.user,
                amount=amount,
                razorpay_order_id=order["id"],
                status="created",
            )

            return Response(
                {
                    "success": True,
                    "message": "Payment order created successfully.",
                    "data": {
                        "order_id": order["id"],
                        "amount": amount,
                        "currency": "INR",
                        "razorpay_key": settings.RAZORPAY_KEY_ID,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:

            return Response(
                {
                    "success": False,
                    "message": "Unable to create payment order.",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# =========================================================
# VERIFY RAZORPAY PAYMENT
# =========================================================

class VerifyPaymentView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        order_id = request.data.get(
            "razorpay_order_id"
        )

        payment_id = request.data.get(
            "razorpay_payment_id"
        )

        signature = request.data.get(
            "razorpay_signature"
        )

        # -------------------------------------------------
        # Check required data
        # -------------------------------------------------

        if not order_id or not payment_id or not signature:

            return Response(
                {
                    "success": False,
                    "message": "Payment verification data is incomplete."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -------------------------------------------------
        # Find payment belonging to current user
        # -------------------------------------------------

        try:

            payment = Payment.objects.select_for_update().get(
                razorpay_order_id=order_id,
                user=request.user,
            )

        except Payment.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Payment order not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # -------------------------------------------------
        # Already paid
        # -------------------------------------------------

        if payment.status == "paid":

            return Response(
                {
                    "success": True,
                    "message": "Payment already verified.",
                },
                status=status.HTTP_200_OK,
            )

        # -------------------------------------------------
        # Verify Razorpay signature
        # -------------------------------------------------

        try:

            client = razorpay.Client(
                auth=(
                    settings.RAZORPAY_KEY_ID,
                    settings.RAZORPAY_KEY_SECRET,
                )
            )

            client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": order_id,
                    "razorpay_payment_id": payment_id,
                    "razorpay_signature": signature,
                }
            )

        except razorpay.errors.SignatureVerificationError:

            payment.status = "failed"
            payment.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            return Response(
                {
                    "success": False,
                    "message": "Payment verification failed."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:

            return Response(
                {
                    "success": False,
                    "message": "Unable to verify payment."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # -------------------------------------------------
        # Payment verified successfully
        # -------------------------------------------------

        payment.razorpay_payment_id = payment_id
        payment.razorpay_signature = signature
        payment.status = "paid"

        payment.save(
            update_fields=[
                "razorpay_payment_id",
                "razorpay_signature",
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Payment verified successfully.",
                "data": {
                    "payment_id": payment.id,
                    "razorpay_payment_id": payment_id,
                    "amount": payment.amount,
                    "status": payment.status,
                },
            },
            status=status.HTTP_200_OK,
        )

# =========================================================
# ADMIN PAYMENT LIST
# =========================================================

class AdminPaymentListView(APIView):

    permission_classes = [IsAuthenticated]

    def check_admin(self, request):
        return (
            request.user.role == "admin"
            and request.user.is_staff
        )

    def get(self, request):

        if not self.check_admin(request):
            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        payments = (
            Payment.objects
            .select_related("user")
            .order_by("-created_at")
        )

        data = []

        for payment in payments:

            application = getattr(
                payment.user,
                "application",
                None
            )

            data.append({
                "id": payment.id,
                "user_id": payment.user.id,

                "student_name": (
                    application.student_full_name
                    if application
                    else payment.user.full_name
                ),

                "email": payment.user.email,
                "mobile": payment.user.mobile,

                "application_number": (
                    application.application_number
                    if application
                    else None
                ),

                "amount": payment.amount,
                "status": payment.status,
                "payment_method": payment.payment_method,

                "razorpay_order_id":
                    payment.razorpay_order_id,

                "razorpay_payment_id":
                    payment.razorpay_payment_id,

                "created_at": payment.created_at,
                "updated_at": payment.updated_at,
            })

        return Response(
            {
                "success": True,
                "count": len(data),
                "data": data,
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ADMIN MARK PAYMENT AS PAID
# =========================================================

class AdminMarkPaymentPaidView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, user_id):

        # -------------------------------------------------
        # ADMIN CHECK
        # -------------------------------------------------

        if not (
            request.user.role == "admin"
            and request.user.is_staff
        ):
            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # -------------------------------------------------
        # FIND STUDENT
        # -------------------------------------------------

        from django.contrib.auth import get_user_model

        User = get_user_model()

        try:
            student = User.objects.get(
                id=user_id,
                role="student"
            )

        except User.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Student not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------------------------------
        # ALREADY PAID CHECK
        # -------------------------------------------------

        existing_paid = (
            Payment.objects
            .filter(
                user=student,
                status="paid"
            )
            .order_by("-created_at")
            .first()
        )

        if existing_paid:

            return Response(
                {
                    "success": True,
                    "message":
                        "Student payment is already marked as paid.",
                    "data": {
                        "payment_id": existing_paid.id,
                        "status": existing_paid.status,
                        "payment_method":
                            existing_paid.payment_method,
                    }
                },
                status=status.HTTP_200_OK
            )

        # -------------------------------------------------
        # FIND LATEST PAYMENT
        # -------------------------------------------------

        payment = (
            Payment.objects
            .select_for_update()
            .filter(user=student)
            .order_by("-created_at")
            .first()
        )

        # -------------------------------------------------
        # EXISTING PAYMENT
        # -------------------------------------------------

        if payment:

            payment.status = "paid"
            payment.payment_method = "manual"

            payment.save(
                update_fields=[
                    "status",
                    "payment_method",
                    "updated_at",
                ]
            )

        # -------------------------------------------------
        # NO PAYMENT RECORD
        # -------------------------------------------------

        else:

            payment = Payment.objects.create(
                user=student,
                amount=100,
                razorpay_order_id=(
                    f"MANUAL-{student.id}-"
                    f"{int(timezone.now().timestamp())}"
                ),
                status="paid",
                payment_method="manual",
            )

        return Response(
            {
                "success": True,
                "message":
                    "Payment marked as paid successfully.",
                "data": {
                    "payment_id": payment.id,
                    "user_id": student.id,
                    "student_name": student.full_name,
                    "amount": payment.amount,
                    "status": payment.status,
                    "payment_method":
                        payment.payment_method,
                }
            },
            status=status.HTTP_200_OK
        )    