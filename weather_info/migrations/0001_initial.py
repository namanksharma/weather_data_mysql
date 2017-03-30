# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='city',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(unique=True, verbose_name='Name', max_length=100)),
                ('country', models.CharField(blank=True, verbose_name='Country', max_length=100)),
                ('lattitude', models.CharField(blank=True, max_length=20)),
                ('longitude', models.CharField(blank=True, max_length=20)),
                ('is_deleted', models.BooleanField(default=False, verbose_name='deleted')),
            ],
            options={
                'db_table': 'city',
                'verbose_name_plural': 'Cities',
                'verbose_name': 'City',
            },
        ),
    ]
