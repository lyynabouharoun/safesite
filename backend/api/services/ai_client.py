import requests
import time

AI_SERVICE_URL = "http://ai-service:8001"

def get_ai_prediction(frame_id, image_base64=None, camera_id=1):
    try:
        url = f"{AI_SERVICE_URL}/predict-frame"
        
        payload = {
            "frame_id": frame_id,
            "camera_id": camera_id,
            "image_base64": image_base64 or "",
            "timestamp": time.time()
        }
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"HTTP {response.status_code}", "alert": False, "prediction": "Normal"}
            
    except Exception as e:
        return {"error": str(e), "alert": False, "prediction": "Normal"}