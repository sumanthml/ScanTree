# 🩺 ScanTrace AI

<div align="center">

### AI-Powered Healthcare Analytics Platform

Transforming medical reports into intelligent health insights using AI, biomarker analytics, longitudinal tracking, and predictive healthcare workflows.

<br/>

![Platform](https://img.shields.io/badge/Platform-FullStack-blue?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)
![React Native](https://img.shields.io/badge/Frontend-React_Native-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge\&logo=expo\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge\&logo=postgresql\&logoColor=white)
![AI](https://img.shields.io/badge/AI-Gemini_Vision-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

# 📌 Overview

**ScanTrace AI** is a next-generation healthcare analytics platform that converts raw medical reports into structured biomarker intelligence using AI-powered extraction, longitudinal health analytics, and predictive health insights.

The system is designed with a scalable enterprise-grade architecture using:

* **FastAPI** for backend APIs
* **React Native + Expo Router** for cross-platform frontend
* **PostgreSQL** for healthcare data persistence
* **Gemini Vision AI** for OCR and medical report understanding
* **JWT Authentication + OTP Verification** for secure access
* **Longitudinal Biomarker Analytics** for health trend analysis

---

# 🚀 Key Features

## 🔐 Authentication System

* JWT Authentication
* Email OTP Verification
* Secure Login/Register Flow
* Forgot Password & Reset Password
* Persistent Sessions using Zustand + AsyncStorage
* Protected Routes

---

## 🧠 AI-Powered Medical Intelligence

* AI Medical Report Extraction
* OCR-based Report Understanding
* Biomarker Classification
* AI-generated Health Insights
* Risk Severity Analysis
* Automated Health Score Calculation

---

## 📊 Healthcare Analytics

* Longitudinal Biomarker Tracking
* Biomarker Trend Detection
* Percentage Change Analysis
* Historical Health Comparisons
* Abnormal Biomarker Detection
* Dashboard Health Aggregation

---

## 📂 Medical Report Management

* PDF/Image Upload Support
* Secure File Storage
* Async Report Processing
* Report Comparison Engine
* Downloadable Reports
* Profile-Based Report Ownership

---

# 🏗️ System Architecture

```text
┌─────────────────────────────┐
│       React Native App      │
│      (Expo + Expo Router)   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         FastAPI API         │
│  JWT • OTP • Upload APIs    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       AI Processing Layer   │
│ Gemini Vision + OCR Engine  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        PostgreSQL DB        │
│ Reports • Biomarkers • AI   │
└─────────────────────────────┘
```

---

# 🛠️ Tech Stack

| Layer            | Technology                            |
| ---------------- | ------------------------------------- |
| Frontend         | React Native, Expo Router, TypeScript |
| Backend          | FastAPI, SQLAlchemy                   |
| Database         | PostgreSQL                            |
| AI Layer         | Gemini Vision AI                      |
| State Management | Zustand                               |
| Authentication   | JWT + OTP                             |
| ORM              | SQLAlchemy                            |
| Migrations       | Alembic                               |
| Storage          | Local Storage (Current)               |
| Styling          | React Native + Expo Linear Gradient   |

---

# 📱 Frontend Features

## Current Frontend Modules

```text
frontend/
│
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── verify-email.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   │
│   ├── (tabs)/
│   │   ├── dashboard.tsx
│   │   ├── reports.tsx
│   │   ├── scan.tsx
│   │   └── profile.tsx
│   │
│   └── index.tsx
│
├── services/
├── store/
├── hooks/
├── utils/
└── components/
```

---

# ⚙️ Backend Features

## Current Backend Modules

```text
backend/
│
├── api/
├── models/
├── schemas/
├── services/
├── dependencies/
├── db/
├── utils/
├── ai/
├── storage/
├── worker/
└── tests/
```

---

# 🧬 Core Healthcare Intelligence

## Biomarker Engine

ScanTrace AI performs:

* Biomarker normalization
* Reference range evaluation
* Severity classification
* Longitudinal trend analysis
* Clinical status comparison
* Health risk scoring

---

# 🔄 Current Authentication Flow

```text
Register
   ↓
Verify Email OTP
   ↓
Login
   ↓
Dashboard
```

### Password Recovery Flow

```text
Forgot Password
   ↓
Reset Password OTP
   ↓
Create New Password
   ↓
Login
```

---

# 📈 Dashboard Analytics

The dashboard currently supports:

* Health score aggregation
* Abnormal biomarker counts
* AI risk insights
* Recent report tracking
* Historical biomarker trends
* Clinical severity analysis

---

# 🔒 Security Features

* JWT Authentication
* OTP Email Verification
* Password Hashing
* Profile Ownership Validation
* Protected Routes
* Session Persistence
* Secure File Access

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/sumanthml/ScanTree.git
```

---

# ⚡ Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

## Start Backend

```bash
python -m uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger Docs:

```text
http://127.0.0.1:8000/docs
```

---

# 📱 Frontend Setup

```bash
cd frontend

npm install
```

## Start Frontend

```bash
npx expo start -c
```

---

# 🗄️ Database

Current Database:

```text
PostgreSQL
```

Main Entities:

```text
User
 └── Profile
      └── Report
           ├── Biomarker
           └── AIInsight
```

---

# 📌 API Highlights

## Authentication APIs

```http
POST /auth/register
POST /auth/login
POST /auth/verify-email
POST /auth/forgot-password
POST /auth/reset-password
```

---

## Report APIs

```http
GET /reports/{report_id}
GET /reports/{report_id}/comparison
DELETE /reports/{report_id}
```

---

## Dashboard APIs

```http
GET /dashboard/{profile_id}
```

---

## Biomarker APIs

```http
GET /biomarkers
GET /biomarkers/history/{biomarker_name}
```

---

# 🧪 Current Development Status

| Module                | Status         |
| --------------------- | -------------- |
| Authentication        | ✅ Completed    |
| OTP Verification      | ✅ Completed    |
| Session Persistence   | ✅ Completed    |
| Protected Routes      | ✅ Completed    |
| Backend APIs          | ✅ Completed    |
| Dashboard Integration | 🚧 In Progress |
| Report Upload         | 🚧 In Progress |
| AI Analytics          | 🚧 In Progress |
| Predictive Analytics  | 🔜 Planned     |
| Cloud Storage         | 🔜 Planned     |
| Redis/Celery Workers  | 🔜 Planned     |

---

# 🎯 Future Roadmap

## Planned Enterprise Features

* Predictive Health Analytics
* AI-powered Health Recommendations
* Cloud Object Storage
* Redis + Celery Workers
* Notification System
* Multi-profile Management
* PDF Report Export
* Real-time Analytics
* Medical Trend Forecasting
* Doctor Collaboration System

---

# 💡 Why ScanTrace AI?

Most healthcare systems only store reports.

**ScanTrace AI interprets them.**

The platform focuses on:

* AI-driven healthcare understanding
* longitudinal biomarker intelligence
* personalized health analytics
* scalable healthcare architecture
* enterprise-ready backend systems

---

# 👨‍💻 Developer

### Sumanth ML

Final Year Engineering Student • AI/ML Engineer • Full Stack Developer

Focused on:

* Artificial Intelligence
* Healthcare Analytics
* Machine Learning Systems
* Production-grade Backend Engineering
* Scalable Full Stack Applications

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project valuable:

* Star the repository
* Share feedback
* Contribute improvements

---

<div align="center">

## ScanTrace AI

### Transforming Medical Reports into Intelligent Healthcare Insights

</div>
