from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from CPAM.throttles import SubmissionRateThrottle

from .models import Candidature, Offre
from .serializers import CandidatureSerializer, OffreSerializer


class OffreViewSet(viewsets.ModelViewSet):
    serializer_class = OffreSerializer

    def get_queryset(self):
        qs = Offre.objects.all()
        if not self.request.user.is_authenticated:
            qs = qs.filter(active=True)
        return qs

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated()]


class CandidatureViewSet(viewsets.ModelViewSet):
    queryset = Candidature.objects.select_related('offre').all()
    serializer_class = CandidatureSerializer
    throttle_classes = [SubmissionRateThrottle]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
