"""
URL configuration for CPAM project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from Utilisateurs.views import ParametreSiteView
from .public_views import PublicStatsView
from .stats_views import StatsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/public/stats/', PublicStatsView.as_view(), name='public-stats'),
    path('api/public/parametres/', ParametreSiteView.as_view(), name='public-parametres'),

    path('api/stats/', StatsView.as_view(), name='stats'),
    path('api/comptes/', include('Comptes.urls')),
    path('api/utilisateurs/', include('Utilisateurs.urls')),
    path('api/agriculture/', include('Agriculture.urls')),
    path('api/elevage/', include('Elevage.urls')),
    path('api/psciculture/', include('Psciculture.urls')),
    path('api/comptabilite/', include('Comptabilite.urls')),
    path('api/contact/', include('Contact.urls')),
    path('api/carrieres/', include('Carrieres.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
