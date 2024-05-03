from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, user_id, user_name, password, email):
        if not user_id:
            raise ValueError('The User ID must be set')
        user = self.model(
            user_id=user_id,
            user_name=user_name,
            email=self.normalize_email(email)
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_id, user_name, password, email):
        user = self.create_user(
            user_id=user_id,
            user_name=user_name,
            password=password,
            email=email,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser):
    user_id = models.CharField(unique=True, max_length=11, primary_key=True)
    user_name = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=20)
    #is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    def __str__(self):
        return self.user_id
