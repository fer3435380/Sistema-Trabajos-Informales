from django.db.models import Q
from rest_framework import generics, permissions

from core.permissions import IsOwnerRole
from jobs.models import Job
from jobs.serializers import JobSerializer


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsOwnerRole()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Job.objects.select_related("creator").all()
        search = self.request.query_params.get("search")
        job_type = self.request.query_params.get("type")
        location = self.request.query_params.get("location")
        status = self.request.query_params.get("status")
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(description__icontains=search))
        if job_type:
            queryset = queryset.filter(type__icontains=job_type)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.select_related("creator").all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
