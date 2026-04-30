import torch
import torch.nn as nn
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import time
import base64
from PIL import Image
import io
import logging
from collections import deque
import os

# Import your model architecture
from model_arch import SafeSiteModel

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SafeSite AI Service - Violence Detection")

# Global variables
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None

# Frame buffer for each camera (stores last 10 frames)
camera_buffers: Dict[int, deque] = {}

# Configuration
SEQUENCE_LENGTH = 10
FRAME_SIZE = (224, 224)
CLASS_NAMES = ["Normal", "Violence"]
ALERT_THRESHOLD = 0.87


class FrameRequest(BaseModel):
    frame_id: int
    camera_id: int
    image_base64: Optional[str] = None
    timestamp: Optional[float] = None

class PredictionResponse(BaseModel):
    frame_id: Optional[int]
    camera_id: int
    prediction: str
    confidence: float
    alert: bool
    timestamp: float
    violence_probability: float

@app.on_event("startup")
async def load_model():
    global model
    try:
        # Initialize model
        model = SafeSiteModel(num_classes=2, seq_len=SEQUENCE_LENGTH, freeze_backbone=False)
        model.to(device)
        model.eval()
        
        # Try to load trained weights
        model_path = "model/best_model.pth"
        if os.path.exists(model_path):
            checkpoint = torch.load(model_path, map_location=device)
            if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
                model.load_state_dict(checkpoint['model_state_dict'])
            elif isinstance(checkpoint, dict):
                model.load_state_dict(checkpoint)
            else:
                model.load_state_dict(checkpoint.state_dict())
            logger.info(f"✅ Loaded trained model from {model_path}")
        else:
            logger.warning(f"⚠️ No trained model found at {model_path}, using untrained model")
        
        logger.info(f"✅ SafeSiteModel loaded on {device}")
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        model = None

def preprocess_image(image_base64: str) -> torch.Tensor:
    """Preprocess a single frame for the model"""
    try:
        # Decode base64 image
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        image_bytes = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize
        image = image.resize(FRAME_SIZE)
        
        # Convert to tensor and normalize
        img_array = np.array(image) / 255.0
        img_tensor = torch.FloatTensor(img_array).permute(2, 0, 1)
        
        # Normalize using ImageNet stats
        mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
        img_tensor = (img_tensor - mean) / std
        
        return img_tensor
    except Exception as e:
        logger.error(f"Preprocessing error: {e}")
        raise

def analyze_sequence(frame_sequence: List[torch.Tensor]) -> Dict[str, Any]:
    """Run inference on a sequence of frames"""
    if len(frame_sequence) != SEQUENCE_LENGTH:
        logger.warning(f"Expected {SEQUENCE_LENGTH} frames, got {len(frame_sequence)}")
    
    # Stack frames: (1, seq_len, 3, 224, 224)
    sequence_tensor = torch.stack(frame_sequence)
    sequence_tensor = sequence_tensor.unsqueeze(0)
    sequence_tensor = sequence_tensor.to(device)
    
    with torch.no_grad():
        outputs = model(sequence_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        
        # Get violence probability (class 1 is violence)
        violence_prob = probabilities[0][1].item()
        predicted_class = "Violence" if violence_prob > 0.5 else "Normal"
        confidence = violence_prob if predicted_class == "Violence" else 1 - violence_prob
        alert = violence_prob > ALERT_THRESHOLD
        
        logger.info(f"Analysis: {predicted_class} (prob: {violence_prob:.3f}), Alert: {alert}")
        
        return {
            "prediction": predicted_class,
            "confidence": confidence,
            "violence_probability": violence_prob,
            "alert": alert
        }

@app.post("/predict-frame")
async def predict_frame(data: FrameRequest):
    """Process a single frame (accumulates in buffer)"""
    global camera_buffers
    
    try:
        if model is None:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        if not data.image_base64:
            return PredictionResponse(
                frame_id=data.frame_id,
                camera_id=data.camera_id,
                prediction="Normal",
                confidence=0.0,
                alert=False,
                timestamp=data.timestamp or time.time(),
                violence_probability=0.0
            )
        
        # Initialize buffer for this camera
        if data.camera_id not in camera_buffers:
            camera_buffers[data.camera_id] = deque(maxlen=SEQUENCE_LENGTH)
            logger.info(f"Initialized buffer for camera {data.camera_id}")
        
        # Process frame
        frame_tensor = preprocess_image(data.image_base64)
        camera_buffers[data.camera_id].append(frame_tensor)
        
        # Check if we have enough frames
        if len(camera_buffers[data.camera_id]) < SEQUENCE_LENGTH:
            return PredictionResponse(
                frame_id=data.frame_id,
                camera_id=data.camera_id,
                prediction="Normal",
                confidence=0.0,
                alert=False,
                timestamp=data.timestamp or time.time(),
                violence_probability=0.0
            )
        
        # Analyze sequence
        current_sequence = list(camera_buffers[data.camera_id])
        result = analyze_sequence(current_sequence)
        
        return PredictionResponse(
            frame_id=data.frame_id,
            camera_id=data.camera_id,
            prediction=result['prediction'],
            confidence=result['confidence'],
            alert=result['alert'],
            timestamp=data.timestamp or time.time(),
            violence_probability=result['violence_probability']
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device),
        "sequence_length": SEQUENCE_LENGTH,
        "active_cameras": len(camera_buffers)
    }