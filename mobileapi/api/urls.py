from django.urls import path, include
from .views import (
    DriversLicenseViewSet,
    TransitCardViewSet,
    HealthCardViewSet,
    register,
    login,
    getUserInfo,
    getDriversInfo,
    addDriversLicense,
    getTransitInfo,
    addTransit,
    getHealthInfo,
    addHealthCard,
    CustomTokenRefreshView,
    TokenValidationView,
    CustomTokenObtainPairView,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('getUserInfo/', getUserInfo, name='getUserInfo'),
    path('getDriversLicense/', getDriversInfo, name='getDriversLicense'),
    path('addDriversLicense/', addDriversLicense, name='addDriversLicense'),
    path('getTransit/', getTransitInfo, name='getBusPass'),
    path('addTransit/', addTransit, name='addBusPass'),
    path('getHealthCard/', getHealthInfo, name='getHealthCard'),
    path('addHealthCard/', addHealthCard, name='addHealthCard'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/validate/', TokenValidationView.as_view(), name='token_validate'), 
]

