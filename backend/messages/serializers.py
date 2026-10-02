from rest_framework import serializers

from .models import Message
from users.models import User


class AdminMessageStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "full_name",
            "email",
            "mobile",
        )


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(
        source="sender.full_name",
        read_only=True
    )

    recipient_name = serializers.CharField(
        source="recipient.full_name",
        read_only=True
    )

    class Meta:
        model = Message
        fields = (
            "id",
            "sender",
            "sender_name",
            "recipient",
            "recipient_name",
            "message",
            "is_read",
            "created_at",
            "read_at",
        )
        read_only_fields = (
            "id",
            "sender",
            "sender_name",
            "recipient_name",
            "is_read",
            "created_at",
            "read_at",
        )