from django.urls import path

from users.views import MeView, UserStatsView


urlpatterns = [
    path("me/", MeView.as_view()),
    path("stats/", UserStatsView.as_view()),
]
