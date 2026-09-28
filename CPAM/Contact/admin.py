from django.contrib import admin

from .models import MessageContact


@admin.register(MessageContact)
class MessageContactAdmin(admin.ModelAdmin):
    list_display = ('sujet', 'nom', 'email', 'date_creation', 'lu')
    list_filter = ('lu', 'date_creation')
    search_fields = ('nom', 'email', 'sujet', 'message')
