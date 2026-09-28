from django.contrib import admin

from .models import Ferme


@admin.register(Ferme)
class FermeAdmin(admin.ModelAdmin):
    list_display = ('nom', 'proprietaire', 'localisation', 'surface_totale', 'date_creation')
    search_fields = ('nom', 'localisation')
    list_filter = ('proprietaire',)
