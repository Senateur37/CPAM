from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import CategorieTransaction, Facture, Transaction
from .serializers import CategorieTransactionSerializer, FactureSerializer, TransactionSerializer


class CategorieTransactionViewSet(viewsets.ModelViewSet):
    queryset = CategorieTransaction.objects.all().order_by('nom')
    serializer_class = CategorieTransactionSerializer
    permission_classes = [IsAuthenticated]


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.select_related('ferme', 'categorie').all().order_by('-date')
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]


class FactureViewSet(viewsets.ModelViewSet):
    queryset = Facture.objects.select_related('ferme').all().order_by('-date_emission')
    serializer_class = FactureSerializer
    permission_classes = [IsAuthenticated]
