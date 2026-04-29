from django.contrib import admin
from .models import Camera, Alert, Event

admin.site.register(Camera)
admin.site.register(Alert)
admin.site.register(Event)