from django.urls import path, include
from rest_framework.routers import DefaultRouter # not needed???
from .views import CarInsuranceAPIView, DriversLicenseAPIView, CarRegistrationAPIView


urlpatterns = [
    path('drivers-license/<str:license_number>/', DriversLicenseAPIView.as_view(), name="drivers-license-detail"),
    path('car-registration/<str:license_number>/', CarRegistrationAPIView.as_view(), name="car-registration"),
    path('car-insurance/<str:policy_number>/', CarInsuranceAPIView.as_view(), name="car-insurance"),
]