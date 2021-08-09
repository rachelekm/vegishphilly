from django.contrib.gis.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=User)
def on_user_save(sender, instance=None, raw=None, created=None, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    loc = models.PointField()
    is_approved = models.BooleanField(default=False)


class Rating(models.Model):
    class Stars(models.IntegerChoices):
        one_star = 1
        two_star = 2
        three_star = 3
        four_star = 4
        five_star = 5

    user = models.ForeignKey("User", on_delete=models.CASCADE)
    restaurant = models.ForeignKey("Restaurant", on_delete=models.CASCADE)
    rating = models.IntegerField(choices=Stars.choices)
