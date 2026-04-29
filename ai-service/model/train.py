if __name__ == "__main__":

    import torch
    import torch.nn as nn
    import torch.optim as optim
    from torch.utils.data import DataLoader
    from torchvision import transforms
    from model_arch import SafeSiteModel
    from video_dataset import VideoSequenceDataset
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    import os

    # ─── CONFIG ───────────────────────────────────────────────
    DEVICE     = torch.device("cuda")
    DATA_ROOT  = r"C:\Users\HP\Desktop\AP\safesite\ai-service\data\sequences"
    SAVE_PATH  = "best_model.pth"
    SEQ_LEN    = 10
    BATCH_SIZE = 8
    EPOCHS     = 20
    LR         = 1e-3
    PATIENCE   = 4

    # dataset stats
    N_VIOLENCE = 1000
    N_NORMAL   = 654
    TOTAL      = N_VIOLENCE + N_NORMAL

    print(f"Device : {DEVICE}")
    print(f"GPU    : {torch.cuda.get_device_name(0)}\n")

    # ─── TRANSFORMS ───────────────────────────────────────────
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.3, contrast=0.3),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

    # ─── DATASETS ─────────────────────────────────────────────
    train_set = VideoSequenceDataset(
        os.path.join(DATA_ROOT, "train"),
        seq_len=SEQ_LEN, transform=train_transform
    )

    val_set = VideoSequenceDataset(
        os.path.join(DATA_ROOT, "val"),
        seq_len=SEQ_LEN, transform=val_transform
    )

    # 🔥 CHANGED HERE → num_workers = 4
    train_loader = DataLoader(
        train_set,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=4,
        pin_memory=True
    )

    val_loader = DataLoader(
        val_set,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=4,
        pin_memory=True
    )

    print(f"Train sequences : {len(train_set)}")
    print(f"Val sequences   : {len(val_set)}\n")

    # ─── MODEL ────────────────────────────────────────────────
    model = SafeSiteModel(
        num_classes=2,
        seq_len=SEQ_LEN,
        freeze_backbone=True
    ).to(DEVICE)

    trainable = sum(p.numel() for p in model.parameters()
                    if p.requires_grad)

    print(f"Trainable params: {trainable:,}\n")

    # ─── CLASS WEIGHTS ────────────────────────────────────────
    weight_normal   = TOTAL / (2 * N_NORMAL)
    weight_violence = TOTAL / (2 * N_VIOLENCE)

    class_weights = torch.tensor(
        [weight_normal, weight_violence]
    ).to(DEVICE)

    print(f"Class weights → Normal: {weight_normal:.3f} | "
          f"Violence: {weight_violence:.3f}\n")

    criterion = nn.CrossEntropyLoss(
        weight=class_weights,
        label_smoothing=0.1
    )

    optimizer = optim.AdamW(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=LR,
        weight_decay=1e-3
    )

    scheduler = optim.lr_scheduler.CosineAnnealingLR(
        optimizer, T_max=EPOCHS
    )

    # ─── TRAINING LOOP ───────────────────────────────────────
    train_losses, val_losses = [], []
    train_accs, val_accs = [], []
    best_val_acc = 0.0
    no_improve = 0

    for epoch in range(EPOCHS):

        # ── TRAIN ─────────────────────────────────────────────
        model.train()
        t_loss = t_correct = t_total = 0

        for seqs, labels in train_loader:
            seqs, labels = seqs.to(DEVICE), labels.to(DEVICE)

            optimizer.zero_grad()
            outputs = model(seqs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            t_loss += loss.item()
            _, preds = outputs.max(1)
            t_correct += preds.eq(labels).sum().item()
            t_total += labels.size(0)

        # ── VALIDATION ───────────────────────────────────────
        model.eval()
        v_loss = v_correct = v_total = 0

        with torch.no_grad():
            for seqs, labels in val_loader:
                seqs, labels = seqs.to(DEVICE), labels.to(DEVICE)
                outputs = model(seqs)
                loss = criterion(outputs, labels)

                v_loss += loss.item()
                _, preds = outputs.max(1)
                v_correct += preds.eq(labels).sum().item()
                v_total += labels.size(0)

        avg_tl = t_loss / len(train_loader)
        avg_vl = v_loss / len(val_loader)
        t_acc = 100.0 * t_correct / t_total
        v_acc = 100.0 * v_correct / v_total

        train_losses.append(avg_tl)
        val_losses.append(avg_vl)
        train_accs.append(t_acc)
        val_accs.append(v_acc)

        scheduler.step()

        tag = ""
        if v_acc > best_val_acc:
            best_val_acc = v_acc
            no_improve = 0
            torch.save(model.state_dict(), SAVE_PATH)
            tag = " ← saved"
        else:
            no_improve += 1
            tag = f" (no improve {no_improve}/{PATIENCE})"

        print(
            f"Epoch {epoch+1:>2}/{EPOCHS} | "
            f"Train {avg_tl:.4f} / {t_acc:.1f}% | "
            f"Val {avg_vl:.4f} / {v_acc:.1f}%"
            f"{tag}"
        )

        if no_improve >= PATIENCE:
            print("Early stopping triggered.")
            break

    print(f"\nBest val accuracy : {best_val_acc:.2f}%")
    print(f"Model saved       → {SAVE_PATH}")

    # ─── PLOTS ───────────────────────────────────────────────
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
    ep = range(1, len(train_losses) + 1)

    ax1.plot(ep, train_losses, 'b-o', ms=4, label='Train')
    ax1.plot(ep, val_losses, 'r-o', ms=4, label='Val')
    ax1.set_title('Loss')
    ax1.set_xlabel('Epoch')
    ax1.legend()
    ax1.grid(alpha=0.3)

    ax2.plot(ep, train_accs, 'b-o', ms=4, label='Train')
    ax2.plot(ep, val_accs, 'r-o', ms=4, label='Val')
    ax2.set_title('Accuracy (%)')
    ax2.set_xlabel('Epoch')
    ax2.legend()
    ax2.grid(alpha=0.3)

    plt.suptitle('OmniGuard — CNN+LSTM Training (1000 Violence / 654 Normal)')
    plt.tight_layout()
    plt.savefig('training_curves.png', dpi=150)
    print("Curves saved → training_curves.png")