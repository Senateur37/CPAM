from rest_framework import serializers

from .models import Bassin, Poisson, QualiteEau


class BassinSerializer(serializers.ModelSerializer):
    ferme_nom = serializers.CharField(source='ferme.nom', read_only=True)

    class Meta:
        model = Bassin
        fields = ['id', 'nom', 'capacite', 'type', 'ferme', 'ferme_nom']


class PoissonSerializer(serializers.ModelSerializer):
    bassin_nom = serializers.CharField(source='bassin.nom', read_only=True)

    class Meta:
        model = Poisson
        fields = ['id', 'espece', 'date_ensemencement', 'poids_moyen', 'bassin', 'bassin_nom']


class QualiteEauSerializer(serializers.ModelSerializer):
    bassin_nom = serializers.CharField(source='bassin.nom', read_only=True)

    class Meta:
        model = QualiteEau
        fields = ['id', 'bassin', 'bassin_nom', 'date_mesure', 'ph', 'temperature', 'oxygene']
        read_only_fields = ['date_mesure']
