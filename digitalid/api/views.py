from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DriversLicense, CarRegistration, CarInsurance
from .serializers import DriversLicenseSerializer, CarRegistrationSerializer, CarInsuranceSerializer
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64
import sys
import os

# Retrieve AES key from environment variables for security
aes_key = bytes.fromhex(os.getenv('AES_KEY'))


def decrypt_aes(encrypted_data):
    print("1: ", encrypted_data)
    try:
        # Decode from Base64
        encrypted_data_bytes = base64.b64decode(encrypted_data)
        print("2: ", encrypted_data_bytes)

        # No need to extract an IV for ECB mode
        cipher = AES.new(aes_key, AES.MODE_ECB)

        # Decrypt and unpad
        decrypted = unpad(cipher.decrypt(encrypted_data_bytes), AES.block_size)

        print("Last byte of decrypted data:", decrypted[-1])  # Check the last byte
        print("Decrypted bytes:", decrypted)  # See the entire decrypted byte array
        sys.stdout.flush()

        # Replace null byte as a bytes literal (b'\x00' is for bytes, '\x00' is for str)
        decrypted = decrypted.replace(b'\x00', b'')  # clean the data from null bytes
        
        return decrypted.decode('utf-8')

    except Exception as e:
        # Use print statement for debugging
        print(f"Decryption failed: {str(e)}. Encrypted data: {encrypted_data!r}")
        sys.stdout.flush()
        # Re-raise the exception with detailed information
        raise ValueError(f"Decryption failed: {str(e)}. Encrypted data: {encrypted_data!r}")

class DriversLicenseAPIView(APIView):
    
    def post(self, request):
        # Check if 'license_data' is provided in the request body
        encrypted_license_number = request.data.get("license_data")
        if not encrypted_license_number:
            return Response({"error": "License data not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decrypt the provided license number
            decrypted_license_number = decrypt_aes(encrypted_license_number)
            print(f"Decrypted license number: {decrypted_license_number}")

            # Retrieve the driver's license from the database
            try:
                drivers_license = DriversLicense.objects.get(license_number=decrypted_license_number)
                serializer = DriversLicenseSerializer(drivers_license)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except DriversLicense.DoesNotExist:
                return Response({"error": "License not found"}, status=status.HTTP_404_NOT_FOUND)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CarRegistrationAPIView(APIView):

    def post(self, request):
        # Check if 'license_data' is provided in the request body
        encrypted_license_number = request.data.get("license_data")
        if not encrypted_license_number:
            return Response({"error": "License data not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve car registration data based on decrypted license number
            decrypted_license_number = decrypt_aes(encrypted_license_number)
            registration = CarRegistration.objects.get(license_number=decrypted_license_number)
            serializer = CarRegistrationSerializer(registration)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CarRegistration.DoesNotExist:
            return Response({"error": "Registration not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CarInsuranceAPIView(APIView):

    def post(self, request):
        # Check if 'policy_number' is provided in the request body
        policy_number = request.data.get("policy_number")
        if not policy_number:
            return Response({"error": "Policy number not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve car insurance data based on policy number
            insurance = CarInsurance.objects.get(policy_number=policy_number)
            serializer = CarInsuranceSerializer(insurance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CarInsurance.DoesNotExist:
            return Response({"error": "Insurance policy not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
