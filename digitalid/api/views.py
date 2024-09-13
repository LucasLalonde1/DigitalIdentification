from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DriversLicense, car_registration, car_insurance
from .serializers import DriversLicenseSerializer, CarRegistrationSerializer, CarInsuranceSerializer

# Create your views here.

class DriversLicenseAPIView(APIView):
    
    # Backend handling get request for license verification
    def get(self, request, license_number=None):
        if license_number:
            try: # find and return a person license information
                drivers_license = DriversLicense.objects.get(license_number = license_number)
                serializer = DriversLicenseSerializer(drivers_license)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except DriversLicense.DoesNotExist: # If license number does not exist, raise error
                return Response({"error": "License does not exist given that license number"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "API Did not recieve a license number"}, status=status.HTTP_400_BAD_REQUEST)
        
    # No functionality, Not applicable?
    def post(self, request):
        pass

class CarRegistrationAPIView(APIView):
    
    # Backend handling for get request for registration verification
    def get(self, request, license_number=None):
        if license_number:
            try: # Find and return car registration given a unique license number
                registration = car_registration.objects.get(license_number=license_number)
                serializer =  CarInsuranceSerializer(car_registration)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except registration.DoesNotExist: # If license number does not exist raise error
                return Response({"error": "Registration Does Not exist given that license number"}, status=status.HTTP_400_BAD_REQUEST)
        else: 
            return Response({"error": "API did not recieve a license number"}, status=status.HTTP_400_BAD_REQUEST)
        
    # Not applicable once again?
    def post(self, request):
        pass

class CarInsuranceAPIView(APIView):

    def get(self, request, policy_number=None):
        if policy_number:
            try: # return insurance data
                insurance = car_insurance.objects.get(policy_number=policy_number)
                serializer = CarInsuranceSerializer(car_insurance)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except insurance.DoesNotExist:
                return Response({"error": "insurance given that policy number does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "API did not recieve a policy number"})
        
    def post(self, request):
        pass