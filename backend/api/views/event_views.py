from rest_framework import viewsets
from ..models import Event
from ..serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-created_at")
    serializer_class = EventSerializer

    # 🔥 FILTERING SUPPORT
    def get_queryset(self):
        queryset = super().get_queryset()

        severity = self.request.query_params.get("severity")
        camera_id = self.request.query_params.get("camera")

        if severity:
            queryset = queryset.filter(severity=severity)

        if camera_id:
            queryset = queryset.filter(camera_id=camera_id)

        return queryset