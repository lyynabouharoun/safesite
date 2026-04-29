import os
import torch
from torch.utils.data import Dataset
from torchvision import transforms
from PIL import Image


class VideoSequenceDataset(Dataset):
    """
    Dataset for loading video frame sequences for CNN + LSTM.

    Expected structure:

    root/
        Normal/
            vid_0/
                seq_0/
                    frame_000.jpg ... frame_009.jpg
                seq_1/
            vid_1/
        Violence/
            vid_0/
                seq_0/
                seq_1/

    Each sequence must contain EXACTLY seq_len frames.
    """

    def __init__(self, root_dir, seq_len=10, transform=None):
        self.root_dir = root_dir
        self.seq_len = seq_len
        self.transform = transform
        self.samples = []

        # Get class names (Normal / Violence)
        classes = sorted(os.listdir(root_dir))
        self.classes = classes
        self.class_to_idx = {cls_name: idx for idx, cls_name in enumerate(classes)}

        print(f"\n📂 Scanning dataset at: {root_dir}")

        # Walk through dataset
        for cls in classes:
            cls_path = os.path.join(root_dir, cls)
            if not os.path.isdir(cls_path):
                continue

            label = self.class_to_idx[cls]

            for vid_folder in sorted(os.listdir(cls_path)):
                vid_path = os.path.join(cls_path, vid_folder)
                if not os.path.isdir(vid_path):
                    continue

                for seq_folder in sorted(os.listdir(vid_path)):
                    seq_path = os.path.join(vid_path, seq_folder)
                    if not os.path.isdir(seq_path):
                        continue

                    frames = sorted([
                        f for f in os.listdir(seq_path)
                        if f.endswith('.jpg')
                    ])

                    # Only keep valid sequences
                    if len(frames) == self.seq_len:
                        self.samples.append((seq_path, label))

        print(f"✅ Loaded {len(self.samples)} sequences")
        print(f"📊 Classes: {self.classes}\n")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        seq_path, label = self.samples[idx]

        frame_files = sorted([
            f for f in os.listdir(seq_path)
            if f.endswith('.jpg')
        ])

        frames = []
        for fname in frame_files[:self.seq_len]:
            img_path = os.path.join(seq_path, fname)

            img = Image.open(img_path).convert("RGB")

            if self.transform:
                img = self.transform(img)

            frames.append(img)

        # Shape: (seq_len, 3, 224, 224)
        frames_tensor = torch.stack(frames)

        return frames_tensor, label