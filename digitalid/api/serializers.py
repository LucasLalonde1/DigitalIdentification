from rest_framework import serializers
from .models import DriversLicense, car_registration, car_insurance

# Serializer for DriversLicense model
class DriversLicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriversLicense
        fields = '__all__'

# Serializer for car_registration model
class CarRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = car_registration
        fields = '__all__'

# Serializer for car_insurance model
class CarInsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = car_insurance
        fields = '__all__'
