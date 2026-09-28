from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Bassin, Poisson, QualiteEau
from .serializers import BassinSerializer, PoissonSerializer, QualiteEauSerializer


class BassinViewSet(viewsets.ModelViewSet):
    queryset = Bassin.objects.select_related('ferme').all().order_by('nom')
    serializer_class = BassinSerializer
    permission_classes = [IsAuthenticated]


class PoissonViewSet(viewsets.ModelViewSet):
    queryset = Poisson.objects.select_related('bassin').all().order_by('espece')
    serializer_class = PoissonSerializer
    permission_classes = [IsAuthenticated]


class QualiteEauViewSet(viewsets.ModelViewSet):
    queryset = QualiteEau.objects.select_related('bassin').all().order_by('-date_mesure')
    serializer_class = QualiteEauSerializer
    permission_classes = [IsAuthenticated]
