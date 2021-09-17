from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.auth.models import User
from api.models import Restaurant


class UserSerializer(serializers.ModelSerializer):
    """Serializer for users"""

    class Meta:
        model = User
        fields = ["id", "username"]
        write_only_fields = ("password",)
        read_only_fields = ["id", "username"]


class RestaurantSerializer(GeoFeatureModelSerializer):
    """A class to serialize restaurants as GeoJSON compatible data"""

    average_rating = serializers.FloatField()

    class Meta:
        model = Restaurant
        geo_field = "loc"
        fields = ("id", "name", "address", "is_approved", "average_rating")
