from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Animal, SanteAnimale
from .serializers import AnimalSerializer, SanteAnimaleSerializer


class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.select_related('ferme').all().order_by('espece')
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]


class SanteAnimaleViewSet(viewsets.ModelViewSet):
    queryset = SanteAnimale.objects.select_related('animal').all().order_by('-date_visite')
    serializer_class = SanteAnimaleSerializer
    permission_classes = [IsAuthenticated]
