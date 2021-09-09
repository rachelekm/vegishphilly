from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Restaurant
from api.serializers import RestaurantSerializer, UserSerializer
from api.factories import UserFactory, RestaurantFactory


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
        data = UserSerializer(user).data
        self.assertEqual(2, len(data["is_owner"]))

    def test_user_is_owner(self):
        user = User.objects.get(username=self.test_user.username)
        data = UserSerializer(user).data
        self.assertQuerysetEqual(
            [self.test_restaurant_1, self.test_restaurant_2], data["is_owner"]
        )


class RestaurantSerializerTestCase(TestCase):
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
