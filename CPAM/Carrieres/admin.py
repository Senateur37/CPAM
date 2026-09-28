from django.contrib import admin

from .models import Candidature, Offre


@admin.register(Offre)
class OffreAdmin(admin.ModelAdmin):
    list_display = ('titre', 'categorie', 'lieu', 'active', 'date_publication')
    list_filter = ('categorie', 'active')
    search_fields = ('titre', 'description', 'lieu')


@admin.register(Candidature)
class CandidatureAdmin(admin.ModelAdmin):
    list_display = ('nom', 'email', 'offre', 'date_creation', 'statut')
    list_filter = ('statut', 'offre')
    search_fields = ('nom', 'email', 'message')
