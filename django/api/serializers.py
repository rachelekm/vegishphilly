from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.auth.models import User
from api.models import Restaurant
from django.contrib.gis.geos import Point
from django.db import transaction


class UserSerializer(serializers.ModelSerializer):
    """Serializer for users"""

    class Meta:
        model = User
        fields = ("id", "username")
        write_only_fields = ("password",)

    def to_internal_value(self, data):
        if data.__contains__("user"):
            user_data = {
                "username": data["user"]["username"],
                "password": data["user"]["password"],
            }
            return super().to_internal_value(user_data)
        else:
            return super().to_internal_value(data)


class RestaurantSerializer(GeoFeatureModelSerializer):
    """A class to serialize restaurants as GeoJSON compatible data"""

    average_rating = serializers.FloatField()
    owner = UserSerializer(many=True)

    class Meta:
        model = Restaurant
        geo_field = "loc"
        fields = ("id", "name", "address", "is_approved", "average_rating", "owner")

    def to_internal_value(self, data):
        user_data = data.pop("user")
        lat = int(data["restaurant_loc"]["coordinates"][0])
        lng = int(data["restaurant_loc"]["coordinates"][1])
        restaurant_data = {
            "name": data["restaurant_name"],
            "address": data["restaurant_address"],
            "loc": Point(lat, lng),
            "owner": [user_data],
        }
        return super().to_internal_value(restaurant_data)

    @transaction.atomic
    def create(self, validated_data):
        owners = validated_data.pop("owner")
        restaurant = Restaurant.objects.create(**validated_data)
        for owner in owners:
            new_user, created = User.objects.get_or_create(username=owner["username"])
            restaurant.owner.add(new_user)
        return restaurant

    def update(self, instance, validated_data):
        pass
