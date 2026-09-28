from django.contrib import admin

from .models import CategorieTransaction, Facture, Transaction


@admin.register(CategorieTransaction)
class CategorieTransactionAdmin(admin.ModelAdmin):
    list_display = ('nom', 'type')
    list_filter = ('type',)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('ferme', 'type', 'categorie', 'montant', 'date')
    list_filter = ('type', 'categorie', 'ferme')
    date_hierarchy = 'date'


@admin.register(Facture)
class FactureAdmin(admin.ModelAdmin):
    list_display = ('numero', 'ferme', 'date_emission', 'montant', 'payee')
    list_filter = ('payee', 'ferme')
    search_fields = ('numero',)
