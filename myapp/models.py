from django.db import models

class React(models.Model):
    employee = models.CharField(max_length=30)
    department = models.CharField(max_length=200)
