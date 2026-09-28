from django.contrib import admin

from .models import Bassin, Poisson, QualiteEau


@admin.register(Bassin)
class BassinAdmin(admin.ModelAdmin):
    list_display = ('nom', 'type', 'capacite', 'ferme')
    list_filter = ('type', 'ferme')
    search_fields = ('nom',)


@admin.register(Poisson)
class PoissonAdmin(admin.ModelAdmin):
    list_display = ('espece', 'bassin', 'date_ensemencement', 'poids_moyen')
    list_filter = ('espece', 'bassin')


@admin.register(QualiteEau)
class QualiteEauAdmin(admin.ModelAdmin):
    list_display = ('bassin', 'date_mesure', 'ph', 'temperature', 'oxygene')
    list_filter = ('bassin',)
