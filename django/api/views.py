from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
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
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    bbox_filter_field = "loc"
    filter_backends = (InBBoxFilter,)
    bbox_filter_include_overlapping = True  # Optional


"""We can then filter in the URL, using Bounding Box format (min Lon, min Lat, max Lon, max Lat), and we can search for instances within the bounding box, e.g.: /location/?in_bbox=-90,29,-89,35."""

# pagination get ~5-10 restaurants in bounding box
# get current user rating: Restaurant.users.get(id=USER_PK)?
# get restaurant rating average: Rating.restaurant.get(id=RESTAURANT_ID)? then average ratings?
