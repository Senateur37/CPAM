from rest_framework.routers import DefaultRouter

from .views import CategorieTransactionViewSet, FactureViewSet, TransactionViewSet

router = DefaultRouter()
router.register('categories', CategorieTransactionViewSet, basename='categorie-transaction')
router.register('transactions', TransactionViewSet, basename='transaction')
router.register('factures', FactureViewSet, basename='facture')

urlpatterns = router.urls
