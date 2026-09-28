from rest_framework import serializers

from .models import MessageContact


class MessageContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageContact
        fields = ['id', 'nom', 'email', 'sujet', 'message', 'date_creation', 'lu']
        read_only_fields = ['date_creation']
