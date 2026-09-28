from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import ParametreSite, Profil

User = get_user_model()


class ParametreSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParametreSite
        fields = [
            'id',
            'nom_application',
            'slogan',
            'description',
            'logo_url',
            'email_contact',
            'telephone',
            'adresse',
            'devise',
            'site_web',
            'facebook',
            'linkedin',
            'whatsapp',
            'date_mise_a_jour',
        ]
        read_only_fields = ['id', 'date_mise_a_jour']


class ProfilSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profil
        fields = ['id', 'user', 'username', 'role', 'telephone']
        read_only_fields = ['user']


class MeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField(allow_blank=True, required=False)
    last_name = serializers.CharField(allow_blank=True, required=False)
    is_staff = serializers.BooleanField()
    role = serializers.CharField(allow_null=True)
    telephone = serializers.CharField(allow_blank=True, required=False, default='')


class UserManagementSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=Profil.ROLE_CHOICES, required=False)
    telephone = serializers.CharField(max_length=20, allow_blank=True, required=False)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True, min_length=6)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'is_staff',
            'date_joined',
            'role',
            'telephone',
            'password',
        ]
        read_only_fields = ['id', 'date_joined']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        profil = getattr(instance, 'profil', None)
        data['role'] = profil.role if profil else ('admin' if instance.is_staff else 'exploitant')
        data['telephone'] = profil.telephone if profil else ''
        return data

    def validate_password(self, value):
        if self.instance is None and not value:
            raise serializers.ValidationError("Le mot de passe est obligatoire pour créer un nouvel utilisateur.")
        return value

    def create(self, validated_data):
        role = validated_data.pop('role', 'exploitant')
        telephone = validated_data.pop('telephone', '')
        password = validated_data.pop('password')

        is_staff = (role == 'admin')
        user = User.objects.create_user(
            username=validated_data.get('username'),
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=password,
            is_active=validated_data.get('is_active', True),
            is_staff=is_staff,
        )

        profil, _ = Profil.objects.update_or_create(
            user=user,
            defaults={'role': role, 'telephone': telephone},
        )
        user.profil = profil
        return user

    def update(self, instance, validated_data):
        role = validated_data.pop('role', None)
        telephone = validated_data.pop('telephone', None)
        password = validated_data.pop('password', None)

        for attr, val in validated_data.items():
            setattr(instance, attr, val)

        if password:
            instance.set_password(password)

        if role is not None and not instance.is_superuser:
            instance.is_staff = (role == 'admin')

        instance.save()

        # Update Profil
        profil, _ = Profil.objects.get_or_create(user=instance)
        if role is not None:
            profil.role = role
        if telephone is not None:
            profil.telephone = telephone
        profil.save()

        instance.profil = profil
        return instance

