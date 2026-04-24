from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from api.views.camera_views import CameraViewSet
from api.views.alert_views import AlertViewSet
from api.views.event_views import EventViewSet
from api.views.process_frame_view import process_frame
from api.views.dashboard_view import dashboard_summary

router = DefaultRouter()
router.register(r'cameras', CameraViewSet)
router.register(r'alerts', AlertViewSet)
router.register(r'events', EventViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),

    # REST API routes
    path('api/', include(router.urls)),

    # AI endpoint (custom business logic)
    path('api/process-frame/', process_frame),

     path('api/dashboard/summary/', dashboard_summary),
]