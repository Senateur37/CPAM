from rest_framework import serializers

from .models import Ferme


class FermeSerializer(serializers.ModelSerializer):
    proprietaire_nom = serializers.CharField(source='proprietaire.username', read_only=True)

    class Meta:
        model = Ferme
        fields = ['id', 'proprietaire', 'proprietaire_nom', 'nom', 'localisation', 'surface_totale', 'date_creation']
        read_only_fields = ['proprietaire', 'date_creation']
