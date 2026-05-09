from django.urls import path

from notifications.views import MarkNotificationReadView, NotificationListCreateView


urlpatterns = [
    path("", NotificationListCreateView.as_view()),
    path("<int:pk>/read/", MarkNotificationReadView.as_view()),
]
