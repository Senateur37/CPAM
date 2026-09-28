from rest_framework.routers import DefaultRouter

from .views import BassinViewSet, PoissonViewSet, QualiteEauViewSet

router = DefaultRouter()
router.register('bassins', BassinViewSet, basename='bassin')
router.register('poissons', PoissonViewSet, basename='poisson')
router.register('qualite-eau', QualiteEauViewSet, basename='qualite-eau')

urlpatterns = router.urls
