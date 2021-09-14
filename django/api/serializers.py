from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.auth.models import User
from api.models import Restaurant


class UserSerializer(serializers.ModelSerializer):
    """Serializer for users"""

    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "is_owner")
        write_only_fields = ("password",)

    def get_is_owner(self, instance):
        return Restaurant.objects.filter(owner__username=instance.username)


class RestaurantSerializer(GeoFeatureModelSerializer):
    """A class to serialize restaurants as GeoJSON compatible data"""

    average_rating = serializers.FloatField()
    owner = UserSerializer(read_only=True, many=True)

    class Meta:
        model = Restaurant
        geo_field = "loc"
        fields = ("id", "name", "address", "is_approved", "average_rating", "owner")
