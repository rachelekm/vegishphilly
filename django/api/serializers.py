from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """Serializer for users"""

    class Meta:
        model = User
        fields = ["id", "username"]
        write_only_fields = ("password",)
        read_only_fields = ["id", "username"]
