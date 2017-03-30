from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
import datetime

class city(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField('Name',max_length=300)
    lattitude = models.CharField(max_length=20,blank=True)
    longitude = models.CharField(max_length=20,blank=True)
    is_deleted = models.BooleanField('deleted',default=False)
    #...

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        db_table = "city"
        verbose_name = 'City'
        verbose_name_plural = 'Cities'