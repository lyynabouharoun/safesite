
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-dri \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model and app files
COPY model/model_arch.py .
COPY model/best_model.pth .
COPY app.py .

EXPOSE 8001

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]