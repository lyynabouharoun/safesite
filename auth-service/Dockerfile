FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN mkdir -p /db_sharing && chmod 777 /db_sharing

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install djangorestframework-simplejwt

COPY . /app/

EXPOSE 8002

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8002"]