from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

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
        mine = self.request.query_params.get("mine")
        if mine and mine.lower() in {"1", "true", "yes"} and self.request.user.is_authenticated:
            queryset = queryset.filter(creator=self.request.user)
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


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.select_related("creator").all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        job = super().get_object()
        if self.request.method in permissions.SAFE_METHODS:
            return job

        user = self.request.user
        if not user or not user.is_authenticated:
            raise PermissionDenied("Debes autenticarte para modificar este microtrabajo.")

        if user.role == "admin" or job.creator_id == user.id:
            return job

        raise PermissionDenied("Solo el creador o admin pueden modificar este microtrabajo.")
