from rest_framework.decorators import api_view
from rest_framework.response import Response
from services.ai_client import get_ai_prediction

@api_view(['POST'])
def process_live_frame(request):
    """Process live video frame"""
    try:
        image_base64 = request.data.get('image_base64')
        camera_id = request.data.get('camera_id', 1)
        
        if not image_base64:
            return Response({"alert": False, "prediction": "Normal"})
        
        result = get_ai_prediction(
            frame_id=1,
            camera_id=camera_id,
            image_base64=image_base64
        )
        
        return Response(result)
        
    except Exception as e:
        print(f"Error: {e}")
        return Response({"alert": False, "prediction": "Normal", "error": str(e)})