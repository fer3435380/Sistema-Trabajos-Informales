from django.urls import path

from applications.views import AcceptApplicationView, ApplicationDetailView, ApplicationListCreateView, MyApplicationsView, ReceivedApplicationsView, RejectApplicationView


urlpatterns = [
    path("", ApplicationListCreateView.as_view()),
    path("mine/", MyApplicationsView.as_view()),
    path("received/", ReceivedApplicationsView.as_view()),
    path("<int:pk>/accept/", AcceptApplicationView.as_view()),
    path("<int:pk>/reject/", RejectApplicationView.as_view()),
    path("<int:pk>/", ApplicationDetailView.as_view()),
]
