import factory
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from api.models import Restaurant


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    first_name = "Testing"
    last_name = "Person"
    username = factory.Sequence(lambda n: "testperson{}".format(n))
    password = "testtest1234"


class RestaurantFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Restaurant

    id = factory.Sequence(lambda n: n)
    name = factory.Sequence(lambda n: "Test Restaurant {}".format(n))
    address = "123 Street St. Place, PA 12345"
    loc = Point(0, 0)
    is_approved = True

    @factory.post_generation
    def owner(self, create, extracted, **kwargs):
        if not create or not extracted:
            # Simple build, or nothing to add, do nothing.
            return

        if extracted:
            # A list of owners were passed in, use them
            for owner in extracted:
                self.owner.add(owner)
