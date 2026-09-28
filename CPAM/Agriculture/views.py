from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Culture, Irrigation
from .serializers import CultureSerializer, IrrigationSerializer


class CultureViewSet(viewsets.ModelViewSet):
    queryset = Culture.objects.select_related('ferme').all().order_by('nom')
    serializer_class = CultureSerializer
    permission_classes = [IsAuthenticated]


class IrrigationViewSet(viewsets.ModelViewSet):
    queryset = Irrigation.objects.select_related('culture').all().order_by('id')
    serializer_class = IrrigationSerializer
    permission_classes = [IsAuthenticated]
