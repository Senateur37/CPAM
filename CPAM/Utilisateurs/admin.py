from django.contrib import admin

from .models import ParametreSite, Profil


@admin.register(Profil)
class ProfilAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'telephone')
    list_filter = ('role',)
    search_fields = ('user__username', 'telephone')


@admin.register(ParametreSite)
class ParametreSiteAdmin(admin.ModelAdmin):
    list_display = ('nom_application', 'slogan', 'email_contact', 'telephone', 'devise', 'date_mise_a_jour')

