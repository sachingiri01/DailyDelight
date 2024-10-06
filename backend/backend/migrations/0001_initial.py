# Generated by Django 5.1 on 2024-09-01 11:53

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.CharField(max_length=255, primary_key=True, serialize=False, unique=True)),
                ('username', models.CharField(max_length=255)),
                ('email_id', models.EmailField(max_length=255, unique=True)),
                ('gender', models.CharField(choices=[('male', 'Male'), ('female', 'Female'), ('others', 'Others')], max_length=10)),
                ('password', models.CharField(max_length=255)),
                ('bio', models.TextField(blank=True, null=True)),
                ('profile_picture', models.URLField(blank=True, max_length=255, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(default=datetime.datetime.now)),
            ],
        ),
    ]