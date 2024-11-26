from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, first_name, last_name, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):

    use_in_migrations = True
    
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    driver_license = models.OneToOneField('DriversLicense', on_delete=models.CASCADE, null=True, blank=True)
    health_card = models.OneToOneField('HealthCard', on_delete=models.CASCADE, null=True, blank=True)
    transit_card = models.OneToOneField('TransitCard', on_delete=models.CASCADE, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

class DriversLicense(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    license_number = models.CharField(max_length=20)
    province = models.CharField(max_length=50)
    expiration_date = models.DateField()

    def __str__(self):
        return self.license_number

class TransitCard(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    card_number = models.CharField(max_length=20)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    expiration_date = models.DateField()

    def __str__(self):
        return self.card_number

class HealthCard(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    card_number = models.CharField(max_length=20)
    province = models.CharField(max_length=50)
    expiration_date = models.DateField()

    def __str__(self):
        return self.card_number
