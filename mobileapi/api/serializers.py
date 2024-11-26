from rest_framework import serializers
from .models import DriversLicense, TransitCard, HealthCard, CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

# Get your custom user model
CustomUser = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Extract email and password from attrs
        email = attrs.get('email')
        password = attrs.get('password')

        # Attempt to authenticate the user with the provided credentials
        user = authenticate(email=email, password=password)
        
        if not user:
            raise serializers.ValidationError('Invalid credentials provided.')

        # If user is authenticated, call the parent class validate method to issue the tokens
        data = super().validate(attrs)

        # Optionally, include additional user data in the response
        data['user'] = {
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        
        return data
    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'password', 'driver_license', 'health_card', 'transit_card']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = CustomUser(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class DriversLicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriversLicense
        fields = '__all__'

class TransitCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransitCard
        fields = '__all__'

class HealthCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthCard
        fields = '__all__'
        