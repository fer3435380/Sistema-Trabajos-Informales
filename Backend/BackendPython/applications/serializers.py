from rest_framework import serializers

from applications.models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    applicant_name = serializers.CharField(source="applicant.name", read_only=True)

    class Meta:
        model = Application
        fields = ("id", "job", "job_title", "applicant", "applicant_name", "status", "cover_letter", "created_at", "updated_at")
        read_only_fields = ("applicant", "applicant_name", "status", "created_at", "updated_at")


class ApplicationCreateSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    applicant_name = serializers.CharField(source="applicant.name", read_only=True)

    class Meta:
        model = Application
        fields = (
            "id",
            "job",
            "job_title",
            "applicant",
            "applicant_name",
            "status",
            "cover_letter",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("applicant", "applicant_name", "job_title", "status", "created_at", "updated_at")
