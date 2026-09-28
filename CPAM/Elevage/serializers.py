from rest_framework import serializers

from .models import Animal, SanteAnimale


class AnimalSerializer(serializers.ModelSerializer):
    ferme_nom = serializers.CharField(source='ferme.nom', read_only=True)

    class Meta:
        model = Animal
        fields = [
            'id', 'espece', 'race', 'age', 'poids', 'date_naissance',
            'ferme', 'ferme_nom',
        ]


class SanteAnimaleSerializer(serializers.ModelSerializer):
    animal_label = serializers.CharField(source='animal.__str__', read_only=True)

    class Meta:
        model = SanteAnimale
        fields = ['id', 'animal', 'animal_label', 'date_visite', 'diagnostic', 'traitement']
