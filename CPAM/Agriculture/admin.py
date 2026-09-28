from django.contrib import admin

from .models import Culture, Irrigation


@admin.register(Culture)
class CultureAdmin(admin.ModelAdmin):
    list_display = ('nom', 'saison', 'ferme', 'rendement_moyen', 'date_plantation', 'date_recolte')
    list_filter = ('saison', 'ferme')
    search_fields = ('nom',)


@admin.register(Irrigation)
class IrrigationAdmin(admin.ModelAdmin):
    list_display = ('type', 'debit', 'culture')
    list_filter = ('type',)
