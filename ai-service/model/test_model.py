import cv2
import torch
import torch.nn.functional as F
from torchvision import transforms
from model_arch import SafeSiteModel
from collections import deque
import os

# ─── SETTINGS ───────────────────────────────────────
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = "best_model.pth"
VIDEO_PATH = r"C:\Users\HP\Downloads\file_000827.avi"

CLASSES = ['Normal', 'Violence']
SEQ_LEN = 10
THRESHOLD = 0.85   # 0.99 is too strict, 0.90 is more realistic

def test_video():

    if not os.path.exists(MODEL_PATH):
        print(f"❌ Error: {MODEL_PATH} not found.")
        return

    # ─── LOAD MODEL ───────────────────────────────
    model = SafeSiteModel(
        num_classes=2,
        seq_len=SEQ_LEN,
        freeze_backbone=True
    )

    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.to(DEVICE).eval()

    print("✅ Model loaded")

    # ─── TRANSFORM ────────────────────────────────
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

    cap = cv2.VideoCapture(VIDEO_PATH)

    # 🔥 Frame buffer (for sequence input)
    frame_buffer = deque(maxlen=SEQ_LEN)

    # 🔥 Prediction smoothing buffer
    preds_buffer = deque(maxlen=15)

    print(f"🚀 Running sequence-based inference on: {VIDEO_PATH}")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Preprocess frame
        img_tensor = transform(frame)
        frame_buffer.append(img_tensor)

        # Wait until we have full sequence
        if len(frame_buffer) == SEQ_LEN:

            # Stack into (seq_len, 3, H, W)
            seq = torch.stack(list(frame_buffer))

            # Add batch dimension → (1, seq_len, 3, H, W)
            seq = seq.unsqueeze(0).to(DEVICE)

            with torch.no_grad():
                output = model(seq)
                prob = F.softmax(output, dim=1)

                norm_conf = prob[0][0].item()
                viol_conf = prob[0][1].item()

                # Decision logic
                if viol_conf > THRESHOLD:
                    current_label = 'Violence'
                    active_conf = viol_conf
                else:
                    current_label = 'Normal'
                    active_conf = norm_conf

                preds_buffer.append(current_label)

            # Majority smoothing
            final_label = max(set(preds_buffer), key=preds_buffer.count)

        else:
            final_label = "Loading..."

        # ─── UI ────────────────────────────────────
        color = (0, 255, 0) if final_label == 'Normal' else (0, 0, 255)

        cv2.rectangle(frame, (10, 10), (550, 90), (0, 0, 0), -1)

        cv2.putText(frame, f"SYSTEM: {final_label}", (30, 45),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.1, color, 3)

        if len(frame_buffer) == SEQ_LEN:
            debug_text = f"N: {norm_conf:.2f} | V: {viol_conf:.2f}"
            cv2.putText(frame, debug_text, (30, 75),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)

        cv2.imshow("SafeSite - Sequence Inference", frame)

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    test_video()