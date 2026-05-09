from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from applications.models import Application
from applications.serializers import ApplicationCreateSerializer, ApplicationSerializer
from applications.services import change_application_status, create_application


class ApplicationListCreateView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        return ApplicationCreateSerializer if self.request.method == "POST" else ApplicationSerializer

    def get_queryset(self):
        return Application.objects.select_related("job", "applicant", "job__creator").filter(applicant=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application = create_application(request.user, serializer.validated_data["job"], serializer.validated_data.get("cover_letter", ""))
        return Response(ApplicationCreateSerializer(application).data, status=status.HTTP_201_CREATED)


class MyApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        return Application.objects.select_related("job", "applicant").filter(applicant=self.request.user)


class ReceivedApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        return Application.objects.select_related("job", "applicant").filter(job__creator=self.request.user)


class AcceptApplicationView(APIView):
    def patch(self, request, pk):
        application = get_object_or_404(Application.objects.select_related("job", "applicant", "job__creator"), pk=pk)
        return Response(ApplicationCreateSerializer(change_application_status(request.user, application, Application.Status.ACCEPTED)).data)


class RejectApplicationView(APIView):
    def patch(self, request, pk):
        application = get_object_or_404(Application.objects.select_related("job", "applicant", "job__creator"), pk=pk)
        return Response(ApplicationCreateSerializer(change_application_status(request.user, application, Application.Status.REJECTED)).data)
