from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.viewsets import GenericViewSet
from rest_framework_gis.filters import InBBoxFilter
from django.contrib.auth.models import User
from api.models import Restaurant
from django.db import transaction
from api.serializers import UserSerializer, RestaurantSerializer
from api.permissions import IsAuthenticatedOrCreate

class UserList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticatedOrCreate,)
    model_class = User

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.switch_serializer == 'restaurant':
            return RestaurantSerializer
        return UserSerializer

    #Modified CreateModelMixin
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        self.switch_serializer = 'user'
        user_serializer = self.get_serializer(data=request.data)
        if user_serializer.is_valid(raise_exception=True):
            user_serializer.save()
            if request.data.__contains__('restaurant_name'):
                pk = user_serializer.data['id']
                user = User.objects.get(pk=pk)
                #add restaurant instance
                self.switch_serializer = 'restaurant'
                restaurant_serializer = self.get_serializer(data=request.data)
                if restaurant_serializer.is_valid(raise_exception=True):
                    restaurant_serializer.save()
                    #find restaurant and add user as owner?
            headers = self.get_success_headers(user_serializer.data)
            return Response(user_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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


