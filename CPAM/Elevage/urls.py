from rest_framework.routers import DefaultRouter

from .views import AnimalViewSet, SanteAnimaleViewSet

router = DefaultRouter()
router.register('animaux', AnimalViewSet, basename='animal')
router.register('sante', SanteAnimaleViewSet, basename='sante-animale')

urlpatterns = router.urls
