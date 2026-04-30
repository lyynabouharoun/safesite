from django.db import models
from django.conf import settings

class Camera(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=50, default="active")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name

class Alert(models.Model):
    ALERT_TYPES = [
        ("weapon", "Weapon"),
        ("suspicious", "Suspicious Behavior"),
        ("abandoned", "Abandoned Object"),
    ]

    type = models.CharField(max_length=50, choices=ALERT_TYPES)
    confidence = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.type} - {self.confidence}"


class Event(models.Model):
    camera = models.ForeignKey("Camera", on_delete=models.CASCADE, related_name="events", null=True, blank=True)
    severity = models.CharField(max_length=20, default="safe")
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.camera} - {self.severity}"