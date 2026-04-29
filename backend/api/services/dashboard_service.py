from ..models import Event, Camera


def get_dashboard_summary():
    events = Event.objects.all()

    return {
        "total_events": events.count(),
        "danger": events.filter(severity="danger").count(),
        "warning": events.filter(severity="warning").count(),
        "safe": events.filter(severity="safe").count(),
        "active_cameras": Camera.objects.count()
    }