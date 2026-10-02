from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from exams.models import StudentApplication, AdmitCard
from exams.models import StudentApplication
from payments.models import Payment


class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        # ==========================================
        # STUDENT APPLICATION
        # ==========================================

        application = (
            StudentApplication.objects
            .filter(user=user)
            .select_related("exam_center")
            .first()
        )

        application_data = None

        if application:

            application_data = {
                "id": application.id,
                "student_full_name":
                    application.student_full_name,
                "mobile_number":
                    application.mobile_number,
                "student_class":
                    application.student_class,
                "board":
                    application.board,
                "exam_center":
                    application.exam_center.name
                    if application.exam_center
                    else None,
                "status":
                    application.status,
                "created_at":
                    application.created_at,
                "submitted_at":
                    application.submitted_at,
            }

        # ==========================================
        # PAYMENT
        # ==========================================

        payment = (
            Payment.objects
            .filter(user=user)
            .order_by("-created_at")
            .first()
        )

        payment_data = None

        if payment:

            payment_data = {
                "id": payment.id,
                "amount": payment.amount,
                "status": payment.status,
                "razorpay_order_id":
                    payment.razorpay_order_id,
                "razorpay_payment_id":
                    payment.razorpay_payment_id,
                "created_at":
                    payment.created_at,
            }

                # ==========================================
        # ADMIT CARD
        # ==========================================

        admit_card = None

        if application:

            admit_card = (
                AdmitCard.objects
                .filter(application=application)
                .select_related("exam_center")
                .first()
            )

        admit_card_data = None

        if admit_card:

            admit_card_data = {
                "id": admit_card.id,

                "application_number":
                    application.application_number,

                "student_name":
                    application.student_full_name,

                "father_name":
                    application.father_name,

                "mother_name":
                    application.mother_name,

                "student_class":
                    application.student_class,

                "school_name":
                    application.school_name,

                "board":
                    application.board,

                "gender":
                    application.gender,

                "mobile_number":
                    application.mobile_number,

                "exam_center":
                    admit_card.exam_center.name
                    if admit_card.exam_center
                    else None,

                "exam_center_address":
                    admit_card.exam_center.address
                    if admit_card.exam_center
                    else None,

                "exam_venue":
                    admit_card.exam_venue,

                "exam_date":
                    admit_card.exam_date,

                "exam_time":
                    admit_card.exam_time,

                "reporting_time":
                    admit_card.reporting_time,

                "created_at":
                    admit_card.created_at,
            }
        
        # ==========================================
        # RESPONSE
        # ==========================================

        return Response(
            {
                "success": True,

                "data": {

                    "user": {
                        "id": user.id,
                        "full_name": user.full_name,
                        "email": user.email,
                        "mobile": user.mobile,
                        "role": user.role,
                    },

                    "application":
                        application_data,

                    "payment":
                        payment_data,

                    "admit_card":
                        admit_card_data,    
                },
            },
            status=status.HTTP_200_OK,
        )