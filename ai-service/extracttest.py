import os
import shutil

# Paths
PROCESSED_ROOT = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\processed_frames"
TRAIN_ROOT = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\train"
TEST_ROOT = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\test"

categories = ["Normal", "Violence"]

print("--- Extracting Clean Test Set (No Overlap with Train) ---")

for cat in categories:
    source_cat = os.path.join(PROCESSED_ROOT, cat)
    train_cat = os.path.join(TRAIN_ROOT, cat)
    test_cat = os.path.join(TEST_ROOT, cat)
    
    os.makedirs(test_cat, exist_ok=True)
    
    # 1. Get list of files already used for training
    trained_files = set(os.listdir(train_cat))
    # 2. Get all available files
    all_files = os.listdir(source_cat)
    
    # 3. Identify files that are NOT in training
    test_candidates = [f for f in all_files if f not in trained_files]
    
    print(f"Category {cat}: Found {len(test_candidates)} fresh frames for testing.")
    
    # 4. Move them to the test folder
    for f in test_candidates:
        shutil.copy(os.path.join(source_cat, f), os.path.join(test_cat, f))

print("\n✅ Test folder is now CLEAN and restricted to 2 classes.")