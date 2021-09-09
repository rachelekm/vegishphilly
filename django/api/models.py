from django.contrib.gis.db import models
from django.conf import settings


class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    loc = models.PointField()
    is_approved = models.BooleanField(default=False)
    owner = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="owner")

    def __str__(self):
        return self.name


class Rating(models.Model):
    Stars = models.IntegerChoices("star", "one two three four five")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    restaurant = models.ForeignKey("Restaurant", on_delete=models.CASCADE)
    rating = models.IntegerField(choices=Stars.choices)

    def __str__(self):
        rating_string = (
            str(self.rating)
            + " stars: "
            + self.restaurant.name
            + ", rated by "
            + self.user.username
        )
        return rating_string
