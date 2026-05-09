from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import HasInternalApiKey
from notifications.models import Notification
from notifications.serializers import NotificationCreateSerializer, NotificationSerializer


class NotificationListCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "Autenticación requerida"}, status=status.HTTP_401_UNAUTHORIZED)
        queryset = Notification.objects.filter(recipient=request.user)
        unread = request.query_params.get("unread")
        if unread and unread.lower() in {"1", "true", "yes"}:
            queryset = queryset.filter(is_read=False)
        limit = int(request.query_params.get("limit", 20))
        offset = int(request.query_params.get("offset", 0))
        return Response(
            {
                "items": NotificationSerializer(queryset[offset : offset + limit], many=True).data,
                "total": queryset.count(),
                "limit": limit,
                "offset": offset,
            }
        )

    def post(self, request):
        if not HasInternalApiKey().has_permission(request, self):
            return Response({"detail": "API key interna inválida"}, status=status.HTTP_403_FORBIDDEN)
        serializer = NotificationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notification = serializer.save()
        return Response(NotificationSerializer(notification).data, status=status.HTTP_201_CREATED)


class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        notification = Notification.objects.get(pk=pk, recipient=request.user)
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save(update_fields=["is_read", "read_at"])
        return Response(NotificationSerializer(notification).data)
