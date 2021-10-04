from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.viewsets import GenericViewSet
from rest_framework_gis.filters import InBBoxFilter
from django.contrib.auth.models import User
from api.models import Restaurant
from api.serializers import UserSerializer, RestaurantReadSerializer, CreateUserWithRestaurantSerializer

class UserList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

#Create User and User as Restaurant owner with no permissions
class CreateUserView(generics.CreateAPIView):
    model_class = User

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.data.__contains__("restaurant"):
            return CreateUserWithRestaurantSerializer
        return UserSerializer

#Interact with User with permissions
class UserViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticated,)
    model_class = User

    def get_object(self):
        return self.request.user

class RestaurantList(generics.ListAPIView):
    queryset = (
        Restaurant.objects.get_queryset().filter(is_approved=True).order_by("name")
    )
    serializer_class = RestaurantReadSerializer
    bbox_filter_field = "loc"
    filter_backends = (InBBoxFilter,)
    bbox_filter_include_overlapping = True
