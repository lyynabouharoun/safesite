import os
import random
import shutil

# Where the thousands of JPGs are right now
SOURCE = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\processed_frames"
# Where they will be organized for training
TRAIN_DIR = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\train"
TEST_DIR = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\test"

# Make sure these match your exact folder names in processed_frames
categories = ["Normal", "Violence"]

print("--- Starting 80/20 Dataset Split ---")

for cat in categories:
    cat_source = os.path.join(SOURCE, cat)
    
    # If your frames are directly in SOURCE without the cat subfolder, 
    # we'd need to change this, but usually extract.py creates the subfolder.
    if not os.path.exists(cat_source):
        print(f"⚠️ Folder {cat_source} not found! Check your folder names.")
        continue

    os.makedirs(os.path.join(TRAIN_DIR, cat), exist_ok=True)
    os.makedirs(os.path.join(TEST_DIR, cat), exist_ok=True)
    
    # Get all jpg files in that category folder
    files = [f for f in os.listdir(cat_source) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    random.shuffle(files)
    
    split_idx = int(len(files) * 0.8)
    train_files = files[:split_idx]
    test_files = files[split_idx:]
    
    print(f"Processing {cat}: Moving {len(train_files)} to Train, {len(test_files)} to Test...")
    
    for f in train_files:
        shutil.copy(os.path.join(cat_source, f), os.path.join(TRAIN_DIR, cat, f))
    for f in test_files:
        shutil.copy(os.path.join(cat_source, f), os.path.join(TEST_DIR, cat, f))

print("\n✅ Dataset split successfully!")