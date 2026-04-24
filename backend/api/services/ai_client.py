import requests

AI_SERVICE_URL = "http://127.0.0.1:8001/predict"  # Docker URL


def get_ai_prediction(frame_id: int):
    try:
        response = requests.post(
            AI_SERVICE_URL,
            json={"frame_id": frame_id},
            timeout=5
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}