from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Camera, Alert
from ..services.ai_client import get_ai_prediction
from ..services.event_service import create_event
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@api_view(['POST'])
def process_frame(request):
    frame_id = request.data.get("frame_id", 1)

    ai_result = get_ai_prediction(frame_id)

    if "error" in ai_result:
        return Response(ai_result, status=500)

    detections = ai_result.get("detections", [])
    camera = Camera.objects.first()

    if not camera:
        return Response({"error": "No camera found"}, status=400)

    created_alerts = []

    danger_classes = ["weapon", "suspicious_object"]

    # ✅ Initialize channel layer ONCE (not inside loop)
    channel_layer = get_channel_layer()

    for det in detections:
        obj_class = det.get("class")
        confidence = det.get("confidence", 0)
        bbox = det.get("bbox")

        if obj_class in danger_classes:

            alert = Alert.objects.create(
                type=obj_class,
                confidence=confidence,
                camera=camera
            )

            created_alerts.append({
                "id": alert.id,
                "type": obj_class,
                "confidence": confidence
            })

            # 🚀 SEND REAL-TIME ALERT HERE
            async_to_sync(channel_layer.group_send)(
                "alerts",
                {
                   "type": "alert_message",  # goes to consumer method
                    "data": {
                        "id": alert.id,
                        "type": obj_class,
                        "confidence": confidence,
                        "message": "New alert detected!"
                    }
                }
            )
            print("🔥 SENDING ALERT:", obj_class)

    # 🧠 Create event after processing
    event = create_event(camera, created_alerts)

    return Response({
        "ai_result": ai_result,
        "alerts_created": created_alerts,
        "event": {
            "id": event.id,
            "severity": event.severity
        }
    })