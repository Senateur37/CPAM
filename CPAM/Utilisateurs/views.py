from django.contrib.auth import get_user_model
from rest_framework import permissions, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ParametreSite, Profil
from .serializers import (
    MeSerializer,
    ParametreSiteSerializer,
    ProfilSerializer,
    UserManagementSerializer,
)

User = get_user_model()


class IsAdminUserOrAdminRole(permissions.BasePermission):
    """
    Permet l'accès uniquement aux utilisateurs ayant le statut staff ou le rôle 'admin'.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_staff or request.user.is_superuser:
            return True
        profil = getattr(request.user, 'profil', None)
        return profil is not None and profil.role == 'admin'


class ParametreSiteView(APIView):
    """
    Lecture publique ou authentifiée des paramètres du site.
    Mise à jour réservée aux administrateurs.
    """

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminUserOrAdminRole()]

    def get(self, request):
        obj = ParametreSite.get_solo()
        serializer = ParametreSiteSerializer(obj)
        return Response(serializer.data)

    def put(self, request):
        obj = ParametreSite.get_solo()
        serializer = ParametreSiteSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)


class UserManagementViewSet(viewsets.ModelViewSet):
    """
    CRUD complet des utilisateurs réservé aux administrateurs.
    """

    queryset = User.objects.all().select_related('profil').order_by('-date_joined')
    serializer_class = UserManagementSerializer
    permission_classes = [IsAuthenticated, IsAdminUserOrAdminRole]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.id == request.user.id:
            return Response(
                {"detail": "Vous ne pouvez pas supprimer votre propre compte utilisateur."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Ne pas autoriser la suppression du dernier administrateur actif
        admin_count = User.objects.filter(is_active=True).filter(
            models_or_staff=True
        ) if hasattr(self, 'models_or_staff') else User.objects.filter(is_staff=True, is_active=True).count()
        if (instance.is_staff or getattr(getattr(instance, 'profil', None), 'role', None) == 'admin') and admin_count <= 1:
            return Response(
                {"detail": "Impossible de supprimer le dernier administrateur du système."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


class ProfilViewSet(viewsets.ModelViewSet):
    queryset = Profil.objects.select_related('user').all().order_by('user__username')
    serializer_class = ProfilSerializer
    permission_classes = [IsAuthenticated]


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profil = getattr(user, 'profil', None)
        role = profil.role if profil else ('admin' if user.is_staff or user.is_superuser else 'exploitant')
        telephone = profil.telephone if profil else ''

        # Auto-create admin profile for superuser if missing
        if not profil and (user.is_superuser or user.is_staff):
            Profil.objects.get_or_create(user=user, defaults={'role': 'admin', 'telephone': ''})

        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'role': role,
            'telephone': telephone,
        }
        return Response(MeSerializer(data).data)
