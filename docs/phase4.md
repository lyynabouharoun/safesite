# 📩 PHASE 4 — EVENT SYSTEM (RABBITMQ + ASYNC ARCHITECTURE)

## 🎯 What we upgrade

We introduce asynchronous communication to make SafeSite event-driven.

We move from: synchronous API calls → event-based system

---

## 📩 RabbitMQ MESSAGE BROKER

We add a new service:

rabbitmq/

It acts as a central message queue between services.

---

## 🔄 EVENT FLOW SYSTEM

When AI detects something (weapon, suspicious behavior, etc.):

AI Service → sends event → RabbitMQ → Backend → processes event → Frontend notification

Example events:
- weapon detected
- suspicious behavior
- abandoned object

---

## ⚙️ BACKEND EVENT CONSUMER

Backend will:
- listen to RabbitMQ queues
- process incoming events
- store alerts in database
- forward updates to frontend

---

## 📡 REAL-TIME SYSTEM

Frontend receives:
- live alerts
- danger notifications
- system events

via WebSockets or polling

---

## 🧠 RESULT OF PHASE 4

✔ async communication system  
✔ event-driven architecture  
✔ real-time alert pipeline  
✔ decoupled microservices  

---

## 🚀 FINAL RESULT

SafeSite becomes a real-time AI event processing system
