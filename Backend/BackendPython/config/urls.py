from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health(_request):
    return JsonResponse({"status": "ok", "service": "backend-python"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("users.auth_urls")),
    path("api/v1/users/", include("users.urls")),
    path("api/v1/jobs/", include("jobs.urls")),
    path("api/v1/applications/", include("applications.urls")),
    path("api/v1/notifications/", include("notifications.urls")),
    path("api/v1/health/", health),
]
