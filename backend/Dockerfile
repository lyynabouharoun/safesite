FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install djangorestframework-simplejwt

COPY . .

# Migrations run automatically on startup
CMD ["sh", "-c", "python manage.py migrate && daphne -b 0.0.0.0 -p 8000 core.asgi:application"]