from rest_framework import serializers

from .models import Candidature, Offre


class OffreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offre
        fields = ['id', 'titre', 'categorie', 'description', 'lieu', 'active', 'date_publication']
        read_only_fields = ['date_publication']


class CandidatureSerializer(serializers.ModelSerializer):
    offre_titre = serializers.CharField(source='offre.titre', read_only=True)

    class Meta:
        model = Candidature
        fields = [
            'id', 'offre', 'offre_titre', 'nom', 'email', 'telephone', 'message',
            'cv', 'statut', 'date_creation',
        ]
        read_only_fields = ['date_creation']
