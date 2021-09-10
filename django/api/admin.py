from django.contrib import admin
from api.models import Restaurant, Rating

class RestaurantAdmin(admin.ModelAdmin):
    filter_horizontal = ('owner',)

admin.site.register(Restaurant, RestaurantAdmin)
admin.site.register(Rating)
