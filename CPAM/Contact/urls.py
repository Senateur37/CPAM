from rest_framework.routers import DefaultRouter

from .views import MessageContactViewSet

router = DefaultRouter()
router.register('messages', MessageContactViewSet, basename='message-contact')

urlpatterns = router.urls
