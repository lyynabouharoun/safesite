from rest_framework.decorators import api_view
from rest_framework.response import Response
import tempfile
import os
import base64
import cv2
from services.ai_client import get_ai_prediction
from api.models import Alert, Camera
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@api_view(['POST'])
def upload_video(request):
    print("=" * 50)
    print("VIDEO UPLOAD STARTED")
    print("=" * 50)
    
    try:
        video_file = request.FILES.get('video')
        
        if not video_file:
            return Response({'error': 'No video file provided'}, status=400)
        
        # Get or create camera
        camera, _ = Camera.objects.get_or_create(
            id=1, 
            defaults={'name': 'Upload Camera', 'location': 'Unknown', 'status': 'active'}
        )
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_file:
            for chunk in video_file.chunks():
                tmp_file.write(chunk)
            video_path = tmp_file.name
        
        cap = cv2.VideoCapture(video_path)
        
        MAX_FRAMES = 20
        MIN_CONFIDENCE = 0.4
        MIN_FRAMES_FOR_ALERT = 2
        
        violence_frames = 0
        frame_count = 0
        all_confidences = []
        
        while cap.isOpened() and frame_count < MAX_FRAMES:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame = cv2.resize(frame, (224, 224))
            _, buffer = cv2.imencode('.jpg', frame)
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            
            result = get_ai_prediction(
                frame_id=frame_count,
                camera_id=1,
                image_base64=frame_base64
            )
            
            confidence = result.get('confidence', 0)
            is_alert = result.get('alert', False)
            all_confidences.append(confidence)
            
            print(f"Frame {frame_count}: {result.get('prediction')} - conf:{confidence:.2f} alert:{is_alert}")
            
            if is_alert and confidence >= MIN_CONFIDENCE:
                violence_frames += 1
                print(f"  ✅ COUNTED as violence frame!")
            
            frame_count += 1
        
        cap.release()
        os.unlink(video_path)
        
        avg_confidence = sum(all_confidences) / len(all_confidences) if all_confidences else 0
        is_violence = violence_frames >= MIN_FRAMES_FOR_ALERT
        
        print(f"Results: {violence_frames}/{frame_count} violence frames")
        print(f"Average confidence: {avg_confidence:.3f}")
        print(f"Violence detected: {is_violence}")
        
        channel_layer = get_channel_layer()
        
        if is_violence:
            # IMPORTANT: Save alert with the logged-in user
            alert = Alert.objects.create(
                type='suspicious',
                confidence=avg_confidence,
                camera=camera,
                user=request.user  # ✅ ADD THIS - assigns alert to logged-in user
            )
            
            print(f"🚨 ALERT CREATED for user {request.user.username}! ID: {alert.id}")
            
            alert_ws = {
                'id': alert.id,
                'prediction': 'Violence',
                'confidence': avg_confidence,
                'timestamp': alert.timestamp.isoformat(),
                'camera': camera.id,
                'type': 'violence',
                'frames_detected': violence_frames,
                'user_id': request.user.id
            }
            
            print(f"📤 Sending WebSocket alert: {alert_ws}")
            
            async_to_sync(channel_layer.group_send)(
                'alerts_group',
                {
                    'type': 'alert_message',
                    'alert': alert_ws
                }
            )
        else:
            print(f"✅ No alert - only {violence_frames} frames detected")
        
        return Response({
            'status': 'completed',
            'total_frames': frame_count,
            'violence_frames': violence_frames,
            'avg_confidence': round(avg_confidence, 3),
            'alert_created': 1 if is_violence else 0,
            'alert_id': alert.id if is_violence else None
        })
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)