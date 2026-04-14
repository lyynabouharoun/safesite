# 🛡️ SafeSite — AI-Powered Smart Surveillance System

## 📌 Project Overview

SafeSite is a distributed AI surveillance platform built using a microservices architecture. It integrates real-time AI detection (YOLO), authentication (JWT), REST APIs, a React dashboard, message queues (RabbitMQ), service discovery (Consul), and reverse proxy routing (Traefik), all fully containerized with Docker Compose.

It simulates a real-world scalable AI monitoring system for smart cities, industrial safety, and security applications.

---

## 🧠 System Architecture

Frontend (React)
      ↓
Traefik (Reverse Proxy)
      ↓
Backend API (FastAPI)
      ↓
 ┌──────────────┬───────────────┐
 │              │               │
Auth Service   AI Service     RabbitMQ
(JWT Login)   (YOLO Detection) (Events)
      │              │
   Consul (Service Discovery)
      │
 PostgreSQL / Redis (future)

---

## 📁 PROJECT STRUCTURE

### 🤖 ai-service/
AI microservice (computer vision + YOLO detection)

ai-service/
├── models/ → trained YOLO weights
├── data/ → datasets (raw + processed)
├── inference/ → real-time detection logic
├── training/ → model training scripts
├── app.py → FastAPI AI service (port 8001)
├── requirements.txt → dependencies
├── Dockerfile → container setup

---

### 🔐 auth-service/
Dedicated authentication microservice (JWT)

auth-service/
├── main.py → login, register, JWT tokens
├── requirements.txt → FastAPI, bcrypt, PyJWT
├── Dockerfile → container setup

✔ Only handles authentication  
✔ Fully isolated microservice  

---

### ⚙️ backend/
Main API gateway (business logic)

backend/
├── auth/ → JWT validation & user context
├── core/ → configuration & env vars
├── db/ → database models (SQLAlchemy)
├── middleware/ → auth & logging
├── routers/ → REST endpoints (/alerts, /cameras, etc.)
├── services/ → AI + RabbitMQ integration
├── ws/ → WebSocket real-time system
├── main.py → FastAPI entry point
├── Dockerfile → container setup

---

### 🌐 frontend/
React dashboard UI

frontend/
├── src/
│   ├── components/ → LiveFeed, Alerts, Stats
│   ├── pages/ → Street, Industrial, Home modes
│   ├── hooks/ → WebSocket + alerts logic
│   ├── api/ → Axios backend client
│   └── App.jsx
├── public/ → static assets
├── .env.example → API URLs
├── Dockerfile
├── package.json

---

### 🐳 docker/
Infrastructure services

docker/
├── traefik/ → reverse proxy routing
├── consul/ → service discovery
├── rabbitmq/ → message queue system

---

### 📚 docs/
System documentation

- architecture.md → system design
- api-contract.yaml → API definitions
- websocket-spec.md → real-time format
- deployment.md → deployment guide

---

### 🧪 tests/
Integration and API tests

- backend API tests
- AI service tests
- full pipeline tests

---

## ⚙️ ROOT FILES

docker-compose.yml → runs full system  
.env.example → environment variables  
.gitignore → ignores node_modules, env, models  
README.md → project documentation  

---

## 🚀 SYSTEM GOAL

This project demonstrates:

✔ Microservices architecture  
✔ Real-time AI detection  
✔ Event-driven system (RabbitMQ)  
✔ Service discovery (Consul)  
✔ Reverse proxy routing (Traefik)  
✔ JWT authentication system  
✔ Scalable frontend-backend separation  

---

## 🧠 FINAL SUMMARY

SafeSite is a production-style distributed AI surveillance system built with modern cloud-native microservices architecture.
