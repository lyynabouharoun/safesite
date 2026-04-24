from ..models import Event

def create_event(camera, alerts):
    """
    Create structured event from alerts
    """

    if not alerts:
        severity = "safe"
        description = "No threats detected"
    else:
        alert_types = [a["type"] for a in alerts]

        if "weapon" in alert_types:
            severity = "danger"
            description = "Weapon detected"
        elif "suspicious_object" in alert_types:
            severity = "warning"
            description = "Suspicious object detected"
        else:
            severity = "safe"
            description = "Normal activity"

    event = Event.objects.create(
        camera=camera,
        severity=severity,
        description=description
    )

    return event