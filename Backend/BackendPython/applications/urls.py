from django.urls import path

from applications.views import AcceptApplicationView, ApplicationListCreateView, MyApplicationsView, ReceivedApplicationsView, RejectApplicationView


urlpatterns = [
    path("", ApplicationListCreateView.as_view()),
    path("mine/", MyApplicationsView.as_view()),
    path("received/", ReceivedApplicationsView.as_view()),
    path("<int:pk>/accept/", AcceptApplicationView.as_view()),
    path("<int:pk>/reject/", RejectApplicationView.as_view()),
]
