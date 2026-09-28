from rest_framework.routers import DefaultRouter

from .views import CultureViewSet, IrrigationViewSet

router = DefaultRouter()
router.register('cultures', CultureViewSet, basename='culture')
router.register('irrigations', IrrigationViewSet, basename='irrigation')

urlpatterns = router.urls
