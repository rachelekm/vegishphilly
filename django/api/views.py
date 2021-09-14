from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.viewsets import GenericViewSet
from rest_framework_gis.filters import InBBoxFilter
from django.contrib.auth.models import User
from api.models import Restaurant
from api.serializers import UserSerializer, RestaurantSerializer
from api.permissions import IsAuthenticatedOrCreate

class UserList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticatedOrCreate,)
    model_class = User
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
    
    #pulled from CreateModelMixin - custom create to eventually handle restaurant data in request
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}


class RestaurantList(generics.ListAPIView):
    queryset = (
        Restaurant.objects.get_queryset().filter(is_approved=True).order_by("name")
    )
    serializer_class = RestaurantSerializer
    bbox_filter_field = "loc"
    filter_backends = (InBBoxFilter,)
    bbox_filter_include_overlapping = True


