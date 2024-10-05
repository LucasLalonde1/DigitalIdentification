from django.urls import path, include
from rest_framework.routers import DefaultRouter # not needed???
from .views import CarInsuranceAPIView, DriversLicenseAPIView, CarRegistrationAPIView


urlpatterns = [
    path('drivers-license/', DriversLicenseAPIView.as_view(), name="drivers-license-detail"),
    path('car-registration/', CarRegistrationAPIView.as_view(), name="car-registration"),
    path('car-insurance/', CarInsuranceAPIView.as_view(), name="car-insurance"),
]