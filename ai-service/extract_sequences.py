import cv2
import os
import random

# ─── CONFIG ───────────────────────────────────────────────────
RAW_ROOT    = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\raw"
OUT_ROOT    = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\sequences"
SEQ_LEN     = 10
FRAME_SKIP  = 3
TRAIN_RATIO = 0.70
VAL_RATIO   = 0.15
# TEST = remaining 0.15 automatically
CATEGORIES  = ["Violence", "Normal"]  # match your exact folder names

random.seed(42)

def extract_sequences_from_video(video_path, out_folder, seq_len, frame_skip):
    cap    = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return 0

    frames = []
    count  = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if count % frame_skip == 0:
            frames.append(frame)
        count += 1
    cap.release()

    if len(frames) < seq_len:
        return 0

    num_seqs = len(frames) // seq_len
    saved    = 0

    for i in range(num_seqs):
        seq_frames = frames[i * seq_len : (i + 1) * seq_len]
        seq_folder = os.path.join(out_folder, f"seq_{i}")
        os.makedirs(seq_folder, exist_ok=True)

        for j, frame in enumerate(seq_frames):
            cv2.imwrite(
                os.path.join(seq_folder, f"frame_{j:03d}.jpg"),
                frame
            )
        saved += 1

    return saved


# ─── MAIN ─────────────────────────────────────────────────────
print("Starting extraction...\n")

for category in CATEGORIES:
    src_folder = os.path.join(RAW_ROOT, category)
    if not os.path.exists(src_folder):
        print(f"ERROR: folder not found → {src_folder}")
        continue

    videos = [f for f in os.listdir(src_folder)
              if f.lower().endswith(('.mp4', '.avi', '.mov'))]

    random.shuffle(videos)
    n       = len(videos)
    n_train = int(n * TRAIN_RATIO)
    n_val   = int(n * VAL_RATIO)

    splits = {
        "train" : videos[:n_train],
        "val"   : videos[n_train : n_train + n_val],
        "test"  : videos[n_train + n_val:]
    }

    print(f"{category} — {n} videos")
    print(f"  train: {len(splits['train'])} videos")
    print(f"  val  : {len(splits['val'])} videos")
    print(f"  test : {len(splits['test'])} videos")

    for split_name, split_videos in splits.items():
        out_cat    = os.path.join(OUT_ROOT, split_name, category)
        split_seqs = 0

        for v_idx, vname in enumerate(split_videos):
            vpath      = os.path.join(src_folder, vname)
            out_folder = os.path.join(out_cat, f"vid_{v_idx}")
            seqs       = extract_sequences_from_video(
                vpath, out_folder, SEQ_LEN, FRAME_SKIP
            )
            split_seqs += seqs

        print(f"  → {split_name}: {split_seqs} sequences extracted")

    print()

print("Done.")