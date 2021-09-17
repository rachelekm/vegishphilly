from collections import OrderedDict
from django.test import TestCase, Client
from django.contrib.gis.geos import Point
from rest_framework_gis.fields import GeoJsonDict
from api.models import Restaurant, Rating
from api.serializers import RestaurantSerializer
from api.factories import UserFactory, RestaurantFactory


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
