from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from applications.models import Application
from applications.serializers import ApplicationSerializer
from jobs.models import Job
from jobs.serializers import JobSerializer
from notifications.models import Notification
from notifications.serializers import NotificationSerializer


def serialize_profile(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
    }


class WorkerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in {"worker", "admin"}:
            raise PermissionDenied("Solo worker o admin pueden consultar este dashboard.")

        jobs = Job.objects.select_related("creator").filter(status=Job.Status.OPEN)
        applications = Application.objects.select_related("job", "applicant", "job__creator").filter(applicant=request.user)
        notifications = Notification.objects.filter(recipient=request.user).order_by("-created_at")[:20]

        return Response(
            {
                "profile": serialize_profile(request.user),
                "microjobs": JobSerializer(jobs, many=True).data,
                "applications": ApplicationSerializer(applications, many=True).data,
                "notifications": NotificationSerializer(notifications, many=True).data,
            }
        )


class CompanyDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in {"owner", "admin"}:
            raise PermissionDenied("Solo owner o admin pueden consultar este dashboard.")

        jobs = Job.objects.select_related("creator").filter(creator=request.user)
        applications = Application.objects.select_related("job", "applicant", "job__creator").filter(job__creator=request.user)
        notifications = Notification.objects.filter(recipient=request.user).order_by("-created_at")[:20]

        return Response(
            {
                "profile": serialize_profile(request.user),
                "microjobs": JobSerializer(jobs, many=True).data,
                "applications": ApplicationSerializer(applications, many=True).data,
                "notifications": NotificationSerializer(notifications, many=True).data,
            }
        )
