from django.contrib.auth import authenticate
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import DriversLicense, TransitCard, HealthCard, CustomUser
from .serializers import (
    DriversLicenseSerializer,
    TransitCardSerializer,
    HealthCardSerializer,
    CustomUserSerializer,
    CustomTokenObtainPairSerializer,
)

# ViewSets for Cards
class DriversLicenseViewSet(viewsets.ModelViewSet):
    queryset = DriversLicense.objects.all()
    serializer_class = DriversLicenseSerializer

class TransitCardViewSet(viewsets.ModelViewSet):
    queryset = TransitCard.objects.all()
    serializer_class = TransitCardSerializer

class HealthCardViewSet(viewsets.ModelViewSet):
    queryset = HealthCard.objects.all()
    serializer_class = HealthCardSerializer

# --------------------------------------------------------------------------------------------------- #

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = (permissions.AllowAny,)  # Allow public access for refresh token

# Optional: Adding a custom view to validate user tokens
class TokenValidationView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

# --------------------------------------------------------------------------------------------------- #

# User Registration and Login
@api_view(['POST'])
def register(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def login(request):
    print(request.data)
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(email=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        print(refresh.access_token)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'firstName': user.first_name,
            'lastName': user.last_name,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# --------------------------------------------------------------------------------------------------- #

# General function to retrieve card info by card number or email
def get_card_info_by_number_or_email(model, serializer, card_number_field, card_number, email_field, email):
    try:
        # First try to get the card by the card number
        if card_number:
            card = model.objects.get(**{card_number_field: card_number})
            return Response(serializer(card).data, status=status.HTTP_200_OK)
        elif email:
            user = CustomUser.objects.get(email=email)
            card = model.objects.get(user=user)
            print(user, card)
            return Response(serializer(card).data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Either card number or email is required"}, status=status.HTTP_400_BAD_REQUEST)
    except model.DoesNotExist:
        return Response({"error": "Card not found"}, status=status.HTTP_404_NOT_FOUND)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# Retrieving Driver's License Info
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getDriversInfo(request):
    driversLicenseNumber = request.data.get('driversLicenseNumber')
    email = request.data.get('email')
    print("a: ", email, "b: ", driversLicenseNumber)
    
    if not driversLicenseNumber and not email:
        return Response({"error": "License number or email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    return get_card_info_by_number_or_email(
        DriversLicense, DriversLicenseSerializer, 'license_number', driversLicenseNumber, 'email', email
    )

# Retrieving Health Card Info
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getHealthInfo(request):
    healthCardNumber = request.data.get('healthCardNumber')
    email = request.data.get('email')
    
    if not healthCardNumber and not email:
        return Response({"error": "Health card number or email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    return get_card_info_by_number_or_email(
        HealthCard, HealthCardSerializer, 'health_card_number', healthCardNumber, 'email', email
    )

# Retrieving Transit pass Info
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getTransitInfo(request):
    transitNumber = request.data.get('transitNumber')
    email = request.data.get('email')
    
    if not transitNumber and not email:
        return Response({"error": "Bus pass number or email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    return get_card_info_by_number_or_email(
        TransitCard, TransitCardSerializer, 'card_number', transitNumber, 'email', email
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getUserInfo(request):
    # Get the authenticated user
    user = request.user

    # Serialize user data
    user_data = CustomUserSerializer(user).data

    # Include associated card data if they exist
    driver_license_data = None
    health_card_data = None
    transit_card_data = None

    if user.driver_license:
        driver_license_data = DriversLicenseSerializer(user.driver_license).data
    if user.health_card:
        health_card_data = HealthCardSerializer(user.health_card).data
    if user.transit_card:
        transit_card_data = TransitCardSerializer(user.transit_card).data

    # Combine user data with card data
    response_data = {
        "user": user_data,
        "driver_license": driver_license_data,
        "health_card": health_card_data,
        "transit_card": transit_card_data,
    }

    return Response(response_data, status=status.HTTP_200_OK)



# --------------------------------------------------------------------------------------------------- #

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addDriversLicense(request):
    driversLicenseNumber = request.data.get('driversLicenseNumber')

    if not driversLicenseNumber:
        return Response({"error": "License number is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Get the authenticated user
    user = request.user

    # Check if the driver's license already exists in the database
    try:
        # Find the existing license
        driver_license = DriversLicense.objects.get(license_number=driversLicenseNumber)
        
        # Check if the license is already associated with the user
        if driver_license.user is not None:
            return Response({"error": "This license is already associated with another user."}, status=status.HTTP_400_BAD_REQUEST)

        # Associate the existing driver's license with the authenticated user
        driver_license.user = user  # Associate with the authenticated user
        driver_license.save()  # Save the changes
        return Response({"message": "Driver's license associated successfully.", "license": driver_license.license_number}, status=status.HTTP_200_OK)
    
    except DriversLicense.DoesNotExist:
        return Response({"error": "Driver's license not found."}, status=status.HTTP_404_NOT_FOUND)


# Adding Health Card to User
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addHealthCard(request):
    healthCardNumber = request.data.get('healthCardNumber')

    if not healthCardNumber:
        return Response({"error": "Health card number is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Get the authenticated user
    user = request.user

    # Check if the health card already exists in the database
    try:
        # Find the existing health card
        health_card = HealthCard.objects.get(card_number=healthCardNumber)
        
        # Check if the card is already associated with the user
        if health_card.user is not None:
            return Response({"error": "This health card is already associated with another user."}, status=status.HTTP_400_BAD_REQUEST)

        # Associate the existing health card with the authenticated user
        health_card.user = user  # Associate with the authenticated user    
        health_card.save()  # Save the changes
        return Response({"message": "Health card associated successfully.", "card": health_card.card_number}, status=status.HTTP_200_OK)
    
    except HealthCard.DoesNotExist:
        return Response({"error": "Health card not found."}, status=status.HTTP_404_NOT_FOUND)


# Adding Bus Pass to User
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addTransit(request):
    transitNumber = request.data.get('transitNumber')

    if not transitNumber:
        return Response({"error": "Transit number is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Get the authenticated user
    user = request.user

    # Check if the bus pass already exists in the database
    try:
        # Find the existing bus pass
        transit_card = TransitCard.objects.get(card_number=transitNumber)
        
        # Check if the card is already associated with the user
        if transit_card.user is not None:
            return Response({"error": "This transit pass is already associated with another user."}, status=status.HTTP_400_BAD_REQUEST)


        print(f"Before Save: User: {user}, Transit Card: {transit_card}, Expiration Date: {transit_card.expiration_date}, Balance: {transit_card.balance}")


        # Associate the existing bus pass with the authenticated user
        transit_card.user = user  # Associate with the authenticated user
        print(TransitCard.objects.get(card_number=transitNumber))
        transit_card.save()  # Save the changes
        return Response({"message": "Transit pass associated successfully.", "card": transit_card.card_number}, status=status.HTTP_200_OK)
    
    except TransitCard.DoesNotExist:
        return Response({"error": "Transit pass not found."}, status=status.HTTP_404_NOT_FOUND)
