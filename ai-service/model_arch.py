import torch
import torch.nn as nn
from torchvision import models

class SafeSiteModel(nn.Module):
    """
    CNN-LSTM for video violence detection.
    Input:  (batch, seq_len, 3, 224, 224)
    Output: (batch, num_classes)
    """

    def __init__(self, num_classes=2, seq_len=10,
                 freeze_backbone=True):
        super(SafeSiteModel, self).__init__()

        # ── ResNet18 as frame encoder ──────────────────────────
        resnet = models.resnet18(weights='DEFAULT')

        if freeze_backbone:
            for param in resnet.parameters():
                param.requires_grad = False

        # Remove final FC — keep everything up to global avg pool
        # Output per frame: (batch, 512)
        self.cnn = nn.Sequential(*list(resnet.children())[:-1])

        # ── LSTM for temporal reasoning ────────────────────────
        # Input:  sequence of 512-d frame features
        # Output: hidden state capturing motion over time
        self.lstm = nn.LSTM(
            input_size  = 512,
            hidden_size = 256,
            num_layers  = 2,
            batch_first = True,
            dropout     = 0.3,
            bidirectional = False
        )

        # ── Classifier head ────────────────────────────────────
        self.classifier = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        # x: (batch, seq_len, 3, 224, 224)
        batch, seq_len, C, H, W = x.shape

        # ── Step 1: encode every frame with CNN ────────────────
        # Merge batch and seq dims to process all frames at once
        x = x.view(batch * seq_len, C, H, W)
        features = self.cnn(x)                    # (batch*seq, 512, 1, 1)
        features = features.view(batch, seq_len, 512)  # (batch, seq, 512)

        # ── Step 2: LSTM over the sequence ─────────────────────
        lstm_out, _ = self.lstm(features)         # (batch, seq, 256)

        # Take only the last timestep — it summarizes the full sequence
        last = lstm_out[:, -1, :]                 # (batch, 256)

        # ── Step 3: classify ───────────────────────────────────
        return self.classifier(last)              # (batch, num_classes)