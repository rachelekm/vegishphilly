from django.contrib.gis.db import models
from django.db.models.signals import post_save
from django.conf import settings
from django.contrib.auth import get_user_model

"""
def post_save_receiver(sender, instance, created, **kwargs):
    pass


post_save.connect(post_save_receiver, sender=settings.AUTH_USER_MODEL)
"""


class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    loc = models.PointField()
    is_approved = models.BooleanField(default=False)


class Rating(models.Model):
    Stars = models.IntegerChoices("star", "one two three four five")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    restaurant = models.ForeignKey("Restaurant", on_delete=models.CASCADE)
    rating = models.IntegerField(choices=Stars.choices)
