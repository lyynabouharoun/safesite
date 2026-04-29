import cv2
import torch
from torchvision import transforms
from model_arch import SafeSiteModel

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CLASSES = ['Normal', 'Violence']

def run_app():
    model = SafeSiteModel(num_classes=2)
    model.load_state_dict(torch.load("safesite_brain_v2.pth", map_location=DEVICE))
    model.to(DEVICE).eval()

    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # 0 for webcam, or paste a video path
    cap = cv2.VideoCapture(0) 

    while True:
        ret, frame = cap.read()
        if not ret: break

        img_tensor = transform(frame).unsqueeze(0).unsqueeze(0).to(DEVICE)
        
        with torch.no_grad():
            output = model(img_tensor)
            prob = torch.nn.functional.softmax(output, dim=1)
            conf, pred = torch.max(prob, 1)
            label = CLASSES[pred.item()]

        # UI Overlay
        color = (0, 255, 0) if label == 'Normal' else (0, 0, 255)
        cv2.putText(frame, f"{label} ({conf.item()*100:.1f}%)", (20, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
        
        cv2.imshow("SafeSite Live", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run_app()