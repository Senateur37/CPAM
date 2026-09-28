from django.contrib import admin

from .models import Animal, SanteAnimale


@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ('espece', 'race', 'age', 'poids', 'date_naissance', 'ferme')
    list_filter = ('espece', 'ferme')
    search_fields = ('espece', 'race')


@admin.register(SanteAnimale)
class SanteAnimaleAdmin(admin.ModelAdmin):
    list_display = ('animal', 'date_visite', 'diagnostic')
    list_filter = ('date_visite',)
