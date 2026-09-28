from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from Agriculture.models import Culture
from Comptes.models import Ferme
from Elevage.models import Animal
from Psciculture.models import Bassin


class PublicStatsView(APIView):
    """Compteurs agrégés, publics et non sensibles, pour le site vitrine."""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'fermes': Ferme.objects.count(),
            'cultures': Culture.objects.count(),
            'animaux': Animal.objects.count(),
            'bassins': Bassin.objects.count(),
        })
