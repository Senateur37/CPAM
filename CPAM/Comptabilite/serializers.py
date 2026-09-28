from rest_framework import serializers

from .models import CategorieTransaction, Facture, Transaction


class CategorieTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategorieTransaction
        fields = ['id', 'nom', 'type']


class TransactionSerializer(serializers.ModelSerializer):
    ferme_nom = serializers.CharField(source='ferme.nom', read_only=True)
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'ferme', 'ferme_nom', 'categorie', 'categorie_nom',
            'type', 'montant', 'date', 'description',
        ]


class FactureSerializer(serializers.ModelSerializer):
    ferme_nom = serializers.CharField(source='ferme.nom', read_only=True)

    class Meta:
        model = Facture
        fields = ['id', 'ferme', 'ferme_nom', 'numero', 'date_emission', 'montant', 'payee', 'description']
