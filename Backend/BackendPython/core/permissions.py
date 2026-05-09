from rest_framework.permissions import BasePermission


class IsOwnerRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in {"owner", "admin"})


class HasInternalApiKey(BasePermission):
    def has_permission(self, request, view):
        from django.conf import settings

        return request.headers.get("X-Internal-Api-Key") == settings.INTERNAL_API_KEY
