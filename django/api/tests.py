from django.contrib.auth.models import User
from django.test import TestCase
from api.models import Restaurant, Rating
from api.serializers import RestaurantSerializer
from django.contrib.gis.geos import Point


class RestaurantSerializerTestCase(TestCase):
    def setUp(self):
        test_user = User.objects.create(
            first_name="Testing",
            last_name="Person",
            username="testperson",
            password="testtest1234",
        )
        test_restaurant = Restaurant.objects.create(
            name="Test Restaurant",
            address="123 Street St. Place, PA 12345",
            loc=Point(0, 0),
            is_approved=True,
        )
        test_ratings = Rating.objects.create(
            user=test_user, restaurant=test_restaurant, rating=3
        )

    def test_restaurant_average_rating(self):
        restaurant = Restaurant.objects.get(name="Test Restaurant")
        data = RestaurantSerializer(restaurant).data
        self.assertEqual(3, data["properties"]["average_rating"])
