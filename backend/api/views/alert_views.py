from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import Alert
from ..serializers import AlertSerializer


class AlertViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AlertSerializer
    queryset = Alert.objects.all()
    
    def get_queryset(self):
        # Only return alerts for the currently logged-in user
        if self.request.user.is_authenticated:
            return Alert.objects.filter(user=self.request.user)
        return Alert.objects.none()
    
    def perform_create(self, serializer):
        # Automatically assign the alert to the logged-in user
        serializer.save(user=self.request.user)