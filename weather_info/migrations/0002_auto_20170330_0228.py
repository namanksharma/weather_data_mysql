# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weather_info', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='city',
            name='country',
        ),
        migrations.AlterField(
            model_name='city',
            name='name',
            field=models.CharField(max_length=300, verbose_name='Name'),
        ),
    ]
