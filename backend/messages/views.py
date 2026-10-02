from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from users.models import User
from .models import Message
from .serializers import (
    AdminMessageStudentSerializer,
    MessageSerializer,
)


class IsAdminUser:
    """
    Simple admin check.
    """

    @staticmethod
    def check(user):
        return (
            user.is_authenticated
            and user.role == "admin"
            and user.is_staff
        )


class AdminMessageStudentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not IsAdminUser.check(request.user):
            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        search = request.GET.get("search", "").strip()

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

        serializer = AdminMessageStudentSerializer(
            students,
            many=True
        )

        return Response(
            {
                "success": True,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )


class AdminSendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not IsAdminUser.check(request.user):
            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        recipient_ids = request.data.get("recipient_ids", [])
        message_text = request.data.get("message", "").strip()

        # Validate recipients
        if not recipient_ids:
            return Response(
                {
                    "success": False,
                    "message": "Please select at least one student."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate message
        if not message_text:
            return Response(
                {
                    "success": False,
                    "message": "Message cannot be empty."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(message_text) > 5000:
            return Response(
                {
                    "success": False,
                    "message": "Message cannot exceed 5000 characters."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Make sure IDs are valid integers
        try:
            recipient_ids = [
                int(student_id)
                for student_id in recipient_ids
            ]
        except (TypeError, ValueError):
            return Response(
                {
                    "success": False,
                    "message": "Invalid student ID."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        students = User.objects.filter(
            id__in=recipient_ids,
            role="student"
        )

        if not students.exists():
            return Response(
                {
                    "success": False,
                    "message": "No valid students found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        with transaction.atomic():

            messages = [
                Message(
                    sender=request.user,
                    recipient=student,
                    message=message_text
                )
                for student in students
            ]

            Message.objects.bulk_create(messages)

        return Response(
            {
                "success": True,
                "message": (
                    f"Message sent to {len(messages)} student(s)."
                ),
                "sent_count": len(messages)
            },
            status=status.HTTP_201_CREATED
        )


class AdminMessageHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not IsAdminUser.check(request.user):
            return Response(
                {
                    "success": False,
                    "message": "Admin access required."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        messages = Message.objects.select_related(
            "sender",
            "recipient"
        ).filter(
            sender=request.user
        )

        serializer = MessageSerializer(
            messages,
            many=True
        )

        return Response(
            {
                "success": True,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

class StudentMessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        messages = Message.objects.select_related(
            "sender"
        ).filter(
            recipient=request.user
        ).order_by("-created_at")

        serializer = MessageSerializer(
            messages,
            many=True
        )

        return Response(
            {
                "success": True,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )


class StudentMessageReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, message_id):
        try:
            message = Message.objects.get(
                id=message_id,
                recipient=request.user
            )
        except Message.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Message not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if not message.is_read:
            from django.utils import timezone

            message.is_read = True
            message.read_at = timezone.now()

            message.save(
                update_fields=[
                    "is_read",
                    "read_at"
                ]
            )

        return Response(
            {
                "success": True,
                "message": "Message marked as read."
            },
            status=status.HTTP_200_OK
        )    