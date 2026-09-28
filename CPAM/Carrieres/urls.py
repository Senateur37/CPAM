from rest_framework.routers import DefaultRouter

from .views import CandidatureViewSet, OffreViewSet

router = DefaultRouter()
router.register('offres', OffreViewSet, basename='offre')
router.register('candidatures', CandidatureViewSet, basename='candidature')

urlpatterns = router.urls
