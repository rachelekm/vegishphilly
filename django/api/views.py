from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from rest_framework_gis.filters import InBBoxFilter
from django.contrib.auth.models import User
from api.models import Restaurant
from api.serializers import UserSerializer, RestaurantSerializer


class UserViewSet(mixins.RetrieveModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class RestaurantList(generics.ListAPIView):
    queryset = (
        Restaurant.objects.get_queryset().filter(is_approved=True).order_by("name")
    )
    serializer_class = RestaurantSerializer
    bbox_filter_field = "loc"
    filter_backends = (InBBoxFilter,)
    bbox_filter_include_overlapping = True
