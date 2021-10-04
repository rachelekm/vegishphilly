from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.auth.models import User
from api.models import Restaurant
from django.db import transaction


class UserSerializer(serializers.ModelSerializer):
    """Serializer for users"""

    class Meta:
        model = User
        fields = ("id", "username")
        write_only_fields = ("password",)


class RestaurantReadSerializer(GeoFeatureModelSerializer):
    """A class to serialize restaurants as GeoJSON compatible data
    with average rating and owner fields"""

    average_rating = serializers.FloatField(required=False, allow_null=True)
    owner = UserSerializer(many=True)

    class Meta:
        model = Restaurant
        geo_field = "loc"
        fields = (
            "id",
            "name",
            "address",
            "is_approved",
            "average_rating",
            "owner",
        )


class RestaurantWriteSerializer(GeoFeatureModelSerializer):
    """A class to serialize and write restaurants as GeoJSON compatible data"""

    class Meta:
        model = Restaurant
        geo_field = "loc"
        fields = ("id", "name", "address", "is_approved")


class CreateUserWithRestaurantSerializer(serializers.Serializer):
    """Serializer for users and restaurant with user as owner"""

    owner = UserSerializer()
    restaurant = RestaurantWriteSerializer()

    def to_representation(self, instance):
        fields = self.get_fields()
        owner = fields["owner"].to_representation(instance.owner.first())
        restaurant = fields["restaurant"].to_representation(instance)
        return dict(owner=owner, restaurant=restaurant)

    @transaction.atomic
    def create(self, validated_data):
        fields = self.get_fields()
        owner = fields["owner"].create(validated_data["owner"])
        restaurant = fields["restaurant"].create(validated_data["restaurant"])
        restaurant.owner.add(owner)
        return restaurant

    def update(self, instance, validated_data):
        pass
