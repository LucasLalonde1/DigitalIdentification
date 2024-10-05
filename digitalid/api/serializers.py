from rest_framework import serializers
from .models import DriversLicense, CarRegistration, CarInsurance

# Serializer for DriversLicense model
class DriversLicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriversLicense
        fields = '__all__'

# Serializer for car_registration model
class CarRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarRegistration
        fields = '__all__'

# Serializer for car_insurance model
class CarInsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarInsurance
        fields = '__all__'
