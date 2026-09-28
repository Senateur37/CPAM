from rest_framework.routers import DefaultRouter

from .views import FermeViewSet

router = DefaultRouter()
router.register('fermes', FermeViewSet, basename='ferme')

urlpatterns = router.urls
