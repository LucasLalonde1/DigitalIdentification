from django.db import models

# Create your models here.

class DriversLicense(models.Model):
    license_number = models.CharField(max_length=14, primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    expire = models.DateField()
    date_of_birth = models.DateField()
    address = models.CharField(max_length=50)
    photo_url = models.URLField() # FOR TEMPORARY REFERENCE

    def __str__(self):
        return self.license_number
    
class CarRegistration(models.Model):
    license_number = models.CharField(max_length=14, primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    vin = models.CharField(max_length=17, unique=True)
    make = models.CharField(max_length=10)
    model = models.CharField(max_length=20)
    date_issues = models.DateField()
    expire = models.DateField()

    def __str__(self):
        return self.license_number
    
class CarInsurance(models.Model):
    policy_number = models.CharField(max_length=11, primary_key=True)
    insurer = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    address = models.CharField(max_length=50)

    def __str__(self):
        return self.policy_number