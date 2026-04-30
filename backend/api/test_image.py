from rest_framework.decorators import api_view
from rest_framework.response import Response
from services.ai_client import get_ai_prediction
import base64

@api_view(['POST'])
def test_with_image(request):
    """Test AI with an actual image"""
    try:
        image_base64 = request.data.get('image_base64')
        camera_id = request.data.get('camera_id', 1)
        
        if not image_base64:
            return Response({"error": "No image provided"}, status=400)
        
        result = get_ai_prediction(
            frame_id=1,
            camera_id=camera_id,
            image_base64=image_base64
        )
        
        return Response({
            "success": True,
            "prediction": result
        })
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)