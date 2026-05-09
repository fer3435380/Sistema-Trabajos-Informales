from rest_framework import serializers

from jobs.models import Job


class JobSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source="creator.name", read_only=True)

    class Meta:
        model = Job
        fields = ("id", "title", "description", "type", "location", "payment", "creator", "creator_name", "status", "created_at", "updated_at")
        read_only_fields = ("creator", "creator_name", "status", "created_at", "updated_at")
