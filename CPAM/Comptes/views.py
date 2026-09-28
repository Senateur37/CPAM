from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Ferme
from .serializers import FermeSerializer


class FermeViewSet(viewsets.ModelViewSet):
    queryset = Ferme.objects.all().order_by('nom')
    serializer_class = FermeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(proprietaire=self.request.user)
