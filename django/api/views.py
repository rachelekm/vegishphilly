from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from rest_framework_gis.filters import InBBoxFilter
from rest_framework.pagination import PageNumberPagination
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
    pagination_class = PageNumberPagination
    page_size = 5


# todos:
# pagination get ~5-10 restaurants in bounding box
# get ratings of current users
# get restaurant rating average
