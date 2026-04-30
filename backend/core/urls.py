from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse  # 👈 ADD THIS IMPORT

from api.views.camera_views import CameraViewSet
from api.views.alert_views import AlertViewSet
from api.views.event_views import EventViewSet
from api.views.process_frame_view import process_frame
from api.views.dashboard_view import dashboard_summary
from api.test_ai import test_ai_connection
from api.test_image import test_with_image
from api.views.live_frame_view import process_live_frame
from api.views.video_upload_view import upload_video

# 👈 ADD THIS HEALTH CHECK FUNCTION
def health_check(request):
    return JsonResponse({"status": "healthy", "service": "backend"})

router = DefaultRouter()
router.register(r'cameras', CameraViewSet)
router.register(r'alerts', AlertViewSet, basename='alert')
router.register(r'events', EventViewSet)

urlpatterns = [
    path('health/', health_check),  
    path('health', health_check),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/process-frame/', process_frame),
    path('api/dashboard/summary/', dashboard_summary),
    path('test-ai/', test_ai_connection),
    path('api/test-image/', test_with_image),
    path('api/process-live-frame/', process_live_frame),
    path('api/upload-video/', upload_video),
    
]