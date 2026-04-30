from rest_framework.decorators import api_view
from rest_framework.response import Response
from services.ai_client import get_ai_prediction
import time

@api_view(['POST'])
def process_live_frame(request):
    try:
        image_base64 = request.data.get('image_base64')
        
        if not image_base64:
            return Response({"alert": False, "prediction": "Normal", "confidence": 0})
        
        result = get_ai_prediction(
            frame_id=int(time.time()),
            camera_id=1,
            image_base64=image_base64
        )
        
        return Response(result)
        
    except Exception as e:
        print(f"Live frame error: {e}")
        return Response({"alert": False, "prediction": "Normal", "confidence": 0})