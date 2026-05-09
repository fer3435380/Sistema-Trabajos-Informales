from rest_framework import serializers

from notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "recipient", "type", "message", "extra_data", "is_read", "read_at", "created_at")
        read_only_fields = ("is_read", "read_at", "created_at")


class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "recipient", "type", "message", "extra_data", "is_read", "read_at", "created_at")
        read_only_fields = ("is_read", "read_at", "created_at")
