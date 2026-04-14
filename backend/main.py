from fastapi import FastAPI # LIBRARY BRK
import requests #hna backend rah y3yt ll ia servic 

app = FastAPI(title="SafeSite Backend") # creat a server ll backend

AI_SERVICE_URL = "http://ai-service:8001" # this only works in docker tsma y9olo win jay ia service prot (url) "ai-service = Docker service name" 8001 = AI port"

@app.get("/") # just to check the backend is runing 
def home():
    return {"status": "Backend running"}

@app.get("/test-ai") # This endpoint lets YOU test whole system
def test_ai():

    payload = {"frame_id": 1}

    response = requests.post(  # Backend sends request to AI
        f"{AI_SERVICE_URL}/predict",  #POST http://ai-service:8001/predict
        json=payload
    )

    return {
        "message": "AI response received",
        "data": response.json()   #backend sends AI result back to user
    }