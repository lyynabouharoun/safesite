
 # import tae librarires brk 
from fastapi import FastAPI 
from pydantic import BaseModel
import time
import random

app = FastAPI(title="SafeSite AI Service") #Creates your AI server 

class FrameRequest(BaseModel):
    frame_id: int


#n endpoint is a specific URL (address) in your backend or service where you can send a request and get a response.
# exemple hada endpoint POST http://localhost:8001/predict   z3ma ydir post w ywlilo reply mn hadak url


@app.get("/") # A simple test route to check service is alive (bach nsyiw brk bli service raho kayn)
def home():
    return {"status": "AI Service running"}

@app.post("/predict") #predicat howa asm endpoint  
def predict(data: FrameRequest): # hadi fonction tae wash ysra ki n#ytolo w ndiro had post hadik frame request hiya z3ma data li raho he expecting it logiquement hiya class hadik li mdifinya lfo9

    # 🔥 DUMMY AI LOGIC (no YOLO yet)
    labels = ["normal", "weapon", "suspicious_object", "person"]

    detections = [
        {
            "class": random.choice(labels), # fake data ytiri brk since mazal madrnach model 
            "confidence": round(random.uniform(0.6, 0.99), 2),
            "bbox": [100, 120, 200, 300]
        }
    ]

    result = {
        "frame_id": data.frame_id,
        "detections": detections,
        "scene_score": random.choice(["safe", "dangerous"]), ## NOTE: Suspicious behavior detection is currently rule-based (Phase 1). Will be replaced later with CNN-based context classifier in Phase 2 for advanced behavior understanding.
        "timestamp": time.time()
    }

    return result