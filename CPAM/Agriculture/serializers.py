from rest_framework import serializers

from .models import Culture, Irrigation


class CultureSerializer(serializers.ModelSerializer):
    ferme_nom = serializers.CharField(source='ferme.nom', read_only=True)

    class Meta:
        model = Culture
        fields = [
            'id', 'nom', 'saison', 'sol_requis', 'rendement_moyen',
            'date_plantation', 'date_recolte', 'ferme', 'ferme_nom',
        ]


class IrrigationSerializer(serializers.ModelSerializer):
    culture_nom = serializers.CharField(source='culture.nom', read_only=True)

    class Meta:
        model = Irrigation
        fields = ['id', 'type', 'debit', 'culture', 'culture_nom']
