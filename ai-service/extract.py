import cv2
import os

INPUT_ROOT = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\raw"
OUTPUT_ROOT = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\processed_frames"

# Since they are balanced (1000/1000), use the SAME rate for both
categories = ["Normal", "violence"] # Ensure names match your folder names exactly
FRAME_RATE = 10 

for cat in categories:
    target_path = os.path.join(OUTPUT_ROOT, cat.capitalize()) # Creates 'Normal' and 'Violence'
    os.makedirs(target_path, exist_ok=True)
    
    source_folder = os.path.join(INPUT_ROOT, cat)
    videos = [f for f in os.listdir(source_folder) if f.endswith(('.mp4', '.avi'))]
    
    print(f"Processing {cat}... found {len(videos)} videos.")
    for v_idx, v_name in enumerate(videos):
        cap = cv2.VideoCapture(os.path.join(source_folder, v_name))
        count = 0
        saved_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret: break
            if count % FRAME_RATE == 0:
                # Naming includes video index to avoid overwriting
                cv2.imwrite(os.path.join(target_path, f"v{v_idx}_f{count}.jpg"), frame)
                saved_count += 1
            count += 1
        cap.release()
    print(f"✅ Finished {cat}: Extracted {saved_count} frames total.")