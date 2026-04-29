import torch
import numpy as np
import os

from torch.utils.data import DataLoader
from torchvision import transforms

from model_arch import SafeSiteModel
from video_dataset import VideoSequenceDataset

from sklearn.metrics import confusion_matrix, classification_report
import seaborn as sns
import matplotlib.pyplot as plt


def main():

    # ─── CONFIG ─────────────────────────────────────
    DEVICE     = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    DATA_ROOT  = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\sequences"
    MODEL_PATH = "best_model.pth"
    SEQ_LEN    = 10
    BATCH_SIZE = 8

    print(f"Device: {DEVICE}")

    # ─── TRANSFORMS ────────────────────────────────
    test_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

    # ─── DATASET ───────────────────────────────────
    test_set = VideoSequenceDataset(
        os.path.join(DATA_ROOT, "test"),
        seq_len=SEQ_LEN,
        transform=test_transform
    )

    test_loader = DataLoader(
        test_set,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=4,   # ✅ now safe
        pin_memory=True
    )

    print(f"Test sequences: {len(test_set)}")

    # ─── MODEL ─────────────────────────────────────
    model = SafeSiteModel(
        num_classes=2,
        seq_len=SEQ_LEN,
        freeze_backbone=True
    ).to(DEVICE)

    model.load_state_dict(torch.load(MODEL_PATH))
    model.eval()

    print("Model loaded successfully.\n")

    # ─── EVALUATION ────────────────────────────────
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for seqs, labels in test_loader:
            seqs, labels = seqs.to(DEVICE), labels.to(DEVICE)

            outputs = model(seqs)
            _, preds = outputs.max(1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    # ─── METRICS ───────────────────────────────────
    acc = np.mean(np.array(all_preds) == np.array(all_labels)) * 100
    print(f"Test Accuracy: {acc:.2f}%")

    # Confusion Matrix
    cm = confusion_matrix(all_labels, all_preds)

    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d',
                xticklabels=['Normal', 'Violence'],
                yticklabels=['Normal', 'Violence'])
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title("Confusion Matrix")
    plt.tight_layout()
    plt.savefig("confusion_matrix.png")

    print("Confusion matrix saved → confusion_matrix.png")

    # Classification Report
    report = classification_report(
        all_labels, all_preds,
        target_names=['Normal', 'Violence']
    )

    print("\nClassification Report:\n")
    print(report)

    with open("classification_report.txt", "w") as f:
        f.write(report)

    print("Report saved → classification_report.txt")


# 🔥 THIS IS THE IMPORTANT PART
if __name__ == "__main__":
    main()