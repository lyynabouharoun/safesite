# from rest_framework import viewsets
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
#
# from .models import Camera, Alert, Event
# from .serializers import CameraSerializer, AlertSerializer, EventSerializer
# from .services.ai_client import get_ai_prediction
#
#
# # =========================
# # CRUD VIEWSETS (TP4 style)
# # =========================
#
# class CameraViewSet(viewsets.ModelViewSet):
#     queryset = Camera.objects.all()
#     serializer_class = CameraSerializer
#
#
# class AlertViewSet(viewsets.ModelViewSet):
#     queryset = Alert.objects.all()
#     serializer_class = AlertSerializer
#
#
# class EventViewSet(viewsets.ModelViewSet):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer
#
#
# # =========================
# # CUSTOM BUSINESS ENDPOINT
# # =========================
#
# @api_view(['POST'])
# def process_frame(request):
#     frame_id = request.data.get("frame_id", 1)
#
#     # Call AI service
#     ai_result = get_ai_prediction(frame_id)
#
#     if "error" in ai_result:
#         return Response(ai_result, status=500)
#
#     detections = ai_result.get("detections", [])
#
#     # Get camera (temporary logic for now)
#     camera = Camera.objects.first()
#
#     if not camera:
#         return Response(
#             {"error": "No camera found. Please create one first."},
#             status=400
#         )
#
#     created_alerts = []
#
#     # =========================
#     # MULTI-DETECTION HANDLING
#     # =========================
#
#     danger_classes = ["weapon", "suspicious_object"]
#
#     for det in detections:
#         obj_class = det.get("class")
#         confidence = det.get("confidence", 0)
#         bbox = det.get("bbox", None)
#
#         # Skip invalid data safely
#         if not obj_class:
#             continue
#
#         # Only process dangerous objects
#         if obj_class in danger_classes:
#
#             alert = Alert.objects.create(
#                 type=obj_class,
#                 confidence=confidence,
#                 camera=camera
#             )
#
#             created_alerts.append({
#                 "id": alert.id,
#                 "type": obj_class,
#                 "confidence": confidence,
#                 "bbox": bbox
#             })
#
#     return Response({
#         "ai_result": ai_result,
#         "alerts_created": created_alerts
#     })
#
#
# # =========================
# # NOTE FOR FUTURE (IMPORTANT)
# # =========================
#
# # NOTE:
# # Suspicious behavior detection is currently rule-based (Phase 1).
# # Will be replaced later with CNN-based classifier (Phase 2).