from rest_framework.decorators import api_view
from rest_framework.response import Response
import sys
import os

# Add the services path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'services'))

try:
    from services.ai_client import get_ai_prediction
except ImportError:
    def get_ai_prediction(frame_id, image_base64=None, camera_id=1):
        return {"error": "AI client not found", "alert": False}

@api_view(['GET', 'POST'])
def test_ai_connection(request):
    """Test if AI service is connected"""
    frame_id = request.GET.get('frame_id', 1)
    camera_id = request.GET.get('camera_id', 1)
    
    result = get_ai_prediction(frame_id=int(frame_id), camera_id=int(camera_id))
    
    return Response({
        "status": "success",
        "ai_service": "connected" if "error" not in result else "error",
        "prediction": result
    })