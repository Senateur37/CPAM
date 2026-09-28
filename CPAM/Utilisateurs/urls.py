from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import MeView, ParametreSiteView, ProfilViewSet, UserManagementViewSet

router = DefaultRouter()
router.register('profils', ProfilViewSet, basename='profil')
router.register('users', UserManagementViewSet, basename='user-management')

urlpatterns = [
    path('me/', MeView.as_view(), name='me'),
    path('parametres/', ParametreSiteView.as_view(), name='parametres'),
] + router.urls
