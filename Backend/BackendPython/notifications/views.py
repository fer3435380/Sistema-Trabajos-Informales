from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import HasInternalApiKey
from notifications.models import Notification
from notifications.serializers import NotificationCreateSerializer, NotificationSerializer


class NotificationListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [HasInternalApiKey()]
        return [permissions.IsAuthenticated()]

    @staticmethod
    def _parse_pagination_param(request, name, default, minimum=0, maximum=None):
        raw_value = request.query_params.get(name, default)
        try:
            value = int(raw_value)
        except (TypeError, ValueError) as exc:
            raise serializers.ValidationError({name: "Debe ser un entero válido."}) from exc

        if value < minimum:
            raise serializers.ValidationError({name: f"Debe ser mayor o igual a {minimum}."})
        if maximum is not None and value > maximum:
            raise serializers.ValidationError({name: f"Debe ser menor o igual a {maximum}."})
        return value

    def get(self, request):
        queryset = Notification.objects.filter(recipient=request.user)
        unread = request.query_params.get("unread")
        if unread and unread.lower() in {"1", "true", "yes"}:
            queryset = queryset.filter(is_read=False)
        limit = self._parse_pagination_param(request, "limit", 20, minimum=1, maximum=100)
        offset = self._parse_pagination_param(request, "offset", 0, minimum=0)
        return Response(
            {
                "items": NotificationSerializer(queryset[offset : offset + limit], many=True).data,
                "total": queryset.count(),
                "limit": limit,
                "offset": offset,
            }
        )

    def post(self, request):
        serializer = NotificationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = dict(serializer.validated_data)
        dedupe_key = validated_data.get("dedupe_key")

        if dedupe_key:
            notification, created = Notification.objects.get_or_create(dedupe_key=dedupe_key, defaults=validated_data)
        else:
            notification = Notification.objects.create(**validated_data)
            created = True

        return Response(
            NotificationSerializer(notification).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
        if not notification.is_read:
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save(update_fields=["is_read", "read_at"])
        return Response(NotificationSerializer(notification).data)
