from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from CPAM.throttles import SubmissionRateThrottle

from .models import MessageContact
from .serializers import MessageContactSerializer


class MessageContactViewSet(viewsets.ModelViewSet):
    queryset = MessageContact.objects.all()
    serializer_class = MessageContactSerializer
    throttle_classes = [SubmissionRateThrottle]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
