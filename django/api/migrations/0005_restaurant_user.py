# Generated by Django 3.2.4 on 2021-08-24 18:27

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("api", "0004_alter_rating_rating"),
    ]

    operations = [
        migrations.AddField(
            model_name="restaurant",
            name="user",
            field=models.ManyToManyField(
                through="api.Rating", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]