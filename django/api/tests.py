from collections import OrderedDict
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from rest_framework_gis.fields import GeoJsonDict
from api.models import Restaurant, Rating
from api.serializers import RestaurantSerializer, UserSerializer
from api.factories import UserFactory, RestaurantFactory
import json

class RestaurantSerializerTestCase(TestCase):
    def setUp(self):
        test_user = UserFactory()
        test_restaurant_1 = RestaurantFactory(__sequence=1)
        # make known average rating for test_restaurant_1
        sum = 0.0
        create_averages_range = 5
        for i in range(create_averages_range):
            stars = 1 if i < 4 else 5
            sum += stars
            Rating.objects.create(
                user=test_user, restaurant=test_restaurant_1, rating=stars
            )
        self.test_restaurant_average_rating = sum / create_averages_range

    def test_restaurant_geojson_object(self):
        restaurant = Restaurant.objects.get(name="Test Restaurant 1")
        data = RestaurantSerializer(restaurant).data
        id = data["id"]
        restaurant_properies = OrderedDict(
            [
                ("name", "Test Restaurant 1"),
                ("address", "123 Street St. Place, PA 12345"),
                ("is_approved", True),
                ("average_rating", 1.8),
                #add owner as field value=serialized testUser
            ]
        )
        restaurant_geojson = {
            "id": id,
            "type": "Feature",
            "geometry": GeoJsonDict([("type", "Point"), ("coordinates", [0.0, 0.0])]),
            "properties": restaurant_properies,
        }
        self.assertEqual(restaurant_geojson, data)

    def test_restaurant_average_rating(self):
        restaurant = Restaurant.objects.get(name="Test Restaurant 1")
        data = RestaurantSerializer(restaurant).data
        self.assertAlmostEqual(
            self.test_restaurant_average_rating, data["properties"]["average_rating"]
        )


class RestaurantViewsetTestCase(TestCase):
    def setUp(self):
        # create 4 restaurants with different properties
        RestaurantFactory()
        RestaurantFactory()
        RestaurantFactory(loc=Point(4, 3))
        RestaurantFactory(loc=Point(0, 1), is_approved=False)
        self.c = Client()

    # Test Views
    def test_api_restaurants_response(self):
        response = self.c.get("/api/restaurants/")
        self.assertEqual(response.status_code, 200)

    def test_restaurant_only_is_approved(self):
        response = self.c.get("/api/restaurants/")
        self.assertEqual(response.data["count"], 3)

    def test_restaurants_default_order_by_name(self):
        response = self.c.get("/api/restaurants/")
        restaurants = Restaurant.objects.all().filter(is_approved=True).order_by("name")
        restaurant_data = RestaurantSerializer(restaurants, many=True).data
        self.assertEqual(response.data["results"], restaurant_data)

    def test_restaurant_filter_boundingbox(self):
        response = self.c.get("/api/restaurants/?in_bbox=-2,-2,2,2")
        self.assertEqual(response.data["count"], 2)

class UserSerializerTestCase(TestCase):
    def setUp(self):
        self.test_user = UserFactory()
        self.test_restaurant_1 = RestaurantFactory.create(
            __sequence=1, owner=(self.test_user,)
        )
        self.test_restaurant_2 = RestaurantFactory.create(
            __sequence=2, owner=(self.test_user,)
        )

    def test_user_owns_multiple_restaurants(self):
        user = User.objects.get(username=self.test_user.username)
        restaurants = Restaurant.objects.filter(owner=user)
        self.assertEqual(2, len(restaurants))

    def test_user_is_owner(self):
        user = User.objects.get(username=self.test_user.username)
        user_data = UserSerializer(user).data
        restaurants = Restaurant.objects.filter(owner=user)
        is_owner = True
        for restaurant in restaurants:
            owner = dict(
                RestaurantSerializer(restaurant).data["properties"].pop("owner")[0]
            )
            if owner != user_data:
                is_owner = False
        self.assertEqual(True, is_owner)


class UserViewsetTestCase(TestCase):
    def setUp(self):
        self.c = Client()
        self.userdata_owner_1 = {
            "user": {"username": "testOwner1", "password": "testOwner1234"},
            "restaurant_name": "testOwner1s Pizza Joint",
            "restaurant_address": "1 Pizza Plaza Philadelphia, PA 12345",
            "restaurant_loc": {"type": "Point", "coordinates": [125.6, 10.1]},
        }
        self.userdata_owner_2 = {
            "user": {"username": "testOwner2", "password": "testOwner1234"},
            "restaurant_name": "testOwner2s Pizza Joint",
            "restaurant_address": "2 Pizza Plaza Philadelphia, PA 12345",
            "restaurant_loc": {"type": "Point", "coordinates": [125.6, 10.1]},
        }
        self.userdata_not_owner = {
            "user": {"username": "testNotAnOwner1", "password": "testOwner1234"}
        }

    def test_user_creation_not_owner(self):
        response = self.c.post(
            "/api/user/", self.userdata_not_owner, content_type="application/json"
        )
        # check created status
        self.assertEqual(response.status_code, 201)
        # check user exists
        does_user_exist = User.objects.filter(
            username=self.userdata_not_owner["user"]["username"]
        ).exists()
        self.assertEqual(True, does_user_exist)

    def test_user_creation_is_owner(self):
        response = self.c.post(
            "/api/user/", self.userdata_owner_1, content_type="application/json"
        )
        # check created status
        self.assertEqual(response.status_code, 201)
        # check user exists
        does_user_exist = User.objects.filter(
            username=self.userdata_owner_1["user"]["username"]
        ).exists()
        self.assertEqual(True, does_user_exist)
        # check restaurant exists
        does_restaurant_exist = Restaurant.objects.filter(
            name=self.userdata_owner_1["restaurant_name"]
        ).exists()
        self.assertEqual(True, does_restaurant_exist)

    def test_restaurant_owner_field_set(self):
        self.c.post(
            "/api/user/", self.userdata_owner_2, content_type="application/json"
        )
        restaurant = Restaurant.objects.get(
            name=self.userdata_owner_2["restaurant_name"]
        )
        restaurant_owner = dict(
            RestaurantSerializer(restaurant).data["properties"].pop("owner")[0]
        )
        user = User.objects.get(username=self.userdata_owner_2["user"]["username"])
        owner = UserSerializer(user).data
        self.assertEqual(owner, restaurant_owner)

class RestaurantOwnerSerializerTestCase(TestCase):
    def setUp(self):
        self.test_user_1 = UserFactory()
        self.test_user_2 = UserFactory()
        RestaurantFactory.create(
            __sequence=1, owner=(self.test_user_1, self.test_user_2)
        )

    def test_restaurant__multiple_owners(self):
        restaurant = Restaurant.objects.get(name="Test Restaurant 1")
        data = RestaurantSerializer(restaurant).data
        self.assertEqual(2, len(data["properties"]["owner"]))

    def test_restaurant_owner(self):
        restaurant = Restaurant.objects.get(name="Test Restaurant 1")
        data = RestaurantSerializer(restaurant).data
        self.assertEqual(self.test_user_1.id, data["properties"]["owner"][0]["id"])
