# 🩺 ScanTrace AI — Intelligent Medical Biomarker Platform

<div align="center">

### Transforming Medical Reports into Longitudinal Biomarker Insights & AI-Driven Predictive Health Analytics

<br/>

[![Demo Link](https://img.shields.io/badge/Live_Demo-Demo_Preview-4ADE80?style=for-the-badge&logo=vercel&logoColor=black)](https://scantrace-preview.netlify.app)
[![Platform](https://img.shields.io/badge/Platform-Cross_Platform-3B82F6?style=for-the-badge)](https://expo.dev)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React Native](https://img.shields.io/badge/Frontend-React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-55.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Firebase](https://img.shields.io/badge/Auth-Firebase_Admin_SDK-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![AI](https://img.shields.io/badge/AI-Gemini_2.5_Flash-F43F5E?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-059669?style=for-the-badge)](LICENSE)

</div>

---

# 📌 Project Overview

**ScanTrace AI** is a state-of-the-art, full-stack medical intelligence platform that converts raw, unstructured medical lab reports (PDFs, scans, camera images) into structured, actionable biomarker insights. 

Most health applications only act as digital filing cabinets for reports. **ScanTrace AI interprets them.** By combining advanced computer vision (Gemini 2.5 Flash), structured medical data parsing, and a longitudinal analysis engine, the platform tracks medical trends over time, warns users of abnormal health shifts, and compiles AI-driven health evaluations.

---

# 🗺️ System Architecture & Data Flow

ScanTrace AI separates client interactions, business logic, asynchronous task execution, and AI intelligence layers to maintain high reliability and performance under load.

### Request Pipeline & Token Verification
```mermaid
sequenceDiagram
    autonumber
    actor User as React Native App
    participant FB as Firebase Auth
    participant API as FastAPI Backend
    participant DB as Supabase (Postgres)
    participant Gemini as Gemini AI API

    User->>FB: Authenticate (Password/Custom Token)
    FB-->>User: Return JWT ID Token
    User->>API: API Request (Bearer JWT ID Token)
    API->>API: Locally verify JWT signature using cached Google Certs
    Note over API: 0-network overhead verification
    API->>DB: Query/Sync User Profiles
    DB-->>API: User Context loaded
    API-->>User: Succeeded Response
```

### Report Upload and Processing Flow
```mermaid
flowchart TD
    A[User uploads Image/PDF] --> B[React Native App]
    B -->|Post to /scans/upload| C[FastAPI Server]
    C -->|Store original report| D[(Supabase Storage Bucket)]
    C -->|Init Database Record| E[(PostgreSQL)]
    C -->|Send payload to| F[Gemini 2.5 Flash Vision API]
    F -->|OCR + Structure extraction| G[JSON Parser & Validator]
    G -->|Extract Biomarkers| H[Biomarker Engine]
    H -->|Calculate Ref Ranges| E
    H -->|Compute Health Score| E
    C -->|Async Background Task| I[Send Push/Email Notification]
    C -->|Return Response| B
```

---

# 🚀 Core Feature Modules

### 🔐 1. Bulletproof Authentication & Sync
* **Dual-Authentication Architecture:** Utilizes client-side Firebase REST APIs for authentication (signing in, exchanging custom tokens), completely avoiding CORS and DNS blockages.
* **Instant Token Verification:** FastAPI backend validates Firebase JWT tokens locally using cached public keys from Google, preventing any external API overhead during routine requests.
* **Graceful Account Sync:** On first login, backend automatically syncs the Firebase user profile into the PostgreSQL database, provisioning a default medical profile seamlessly.
* **Background Password Recovery:** Sends verification and password reset links through transactional Gmail SMTP queues handled asynchronously via `BackgroundTasks` to ensure requests complete in under 2 seconds.

### 🧠 2. AI-Powered Vision & OCR Engine
* **Gemini 2.5 Flash Vision Pipeline:** Converts multi-page PDF files and low-light camera images of lab reports into raw text.
* **Structured Medical Parsing:** AI extracts values, units, and categories for each biomarker and maps them to unified medical schemas (e.g., matching "HGB", "Hb", and "Hemoglobin" to a standard entry).
* **Reference Range Checker:** Cross-references values against age-and-gender-adjusted standard clinical reference ranges to flag items as `Low`, `Normal`, or `High`.

### 📊 3. Longitudinal Biomarker Analytics
* **Historical Tracking:** Displays user biomarker trends over months or years.
* **Trend Analysis Engine:** Computes percentage change velocities ($\Delta\%$) across consecutive tests to detect incremental health shifts before they exit the normal range.
* **Rich Data Visualization:** Interactive charts and progression indicators powered by `react-native-chart-kit` and `victory` charts.

### 👥 4. Shared Caregiver & Family Access
* **Granular Permission Level:** Users can delegate `View` or `Edit` access to doctors, family members, or caregivers.
* **Delegation Verification:** Access invitations are processed via database states and triggered via asynchronous emails. Caregivers sign up using the invited email to instantly view the shared profile.

---

# 🛠️ Tech Stack Specification

| Tier | Technology | Rationale / Usage |
| :--- | :--- | :--- |
| **Frontend** | React Native, Expo Router v55, TypeScript | True native performance with cross-platform code reuse and file-system routing. |
| **Backend** | FastAPI (Python 3.11), Uvicorn | High-performance asynchronous API layer with automatic OpenAPI docs generation. |
| **Database** | PostgreSQL (Supabase Hosting) | Relational architecture with UUID keys, foreign key constraints, and index optimizations. |
| **Authentication** | Firebase Admin SDK + Auth REST | Secure user management, token rotation, and identity mapping. |
| **AI Layer** | Google Gemini Generative AI SDK | Multimodal intelligence for document scanning and diagnostic interpretation. |
| **State Management** | Zustand | Lightweight, hooks-based global state storage. |
| **Storage** | Supabase Storage (Object Store) | Secure, encrypted cloud bucket hosting for raw PDF/Image reports. |
| **Caching / Transport**| HTTPX, Axios, AsyncStorage | Optimized networking with request/response interceptors. |
| **Async Operations** | FastAPI BackgroundTasks | Non-blocking offloading of slow SMTP email and analytics processes. |

---

# 🏗️ Repository Directory Anatomy

### Frontend Application Structure
```text
frontend/
├── app/                           # Expo Router navigation root
│   ├── (auth)/                    # User authentication screens
│   │   ├── login.tsx              # Secure Sign-In interface
│   │   ├── register.tsx           # User Account Registration
│   │   ├── forgot-password.tsx    # Password reset initiator
│   │   └── reset-password.tsx     # OTP password code applier
│   ├── (tabs)/                    # Main tab bar navigation
│   │   ├── dashboard.tsx          # Health score overview and abnormal alerts
│   │   ├── reports.tsx            # Historical PDF list & comparison launcher
│   │   ├── scan.tsx               # Report camera capture & PDF uploader
│   │   └── profile.tsx            # Personal information & sharing access
│   ├── profile/                   # Sub-navigation for profile adjustments
│   └── _layout.tsx                # Context provider, theme, and authentication guard
├── components/                    # Reusable visual components (Cards, Charts, Modals)
├── services/                      # Axios client instance and API query handlers
├── store/                         # Zustand global states (auth, reports, alert states)
├── theme/                         # Harmonious color tokens and dark/light palettes
└── utils/                         # Health score mathematics and biomarker parsers
```

### Backend Server Structure
```text
backend/
├── api/                           # Endpoint controller routes
│   ├── analytics.py               # Biomarker delta calculations and trend data
│   ├── biomarkers.py              # Normalized history & range validators
│   ├── insights.py                # AI generation trigger controllers
│   └── scans.py                   # Upload handlers & OCR extraction endpoints
├── core/                          # Core system initializations
│   ├── firebase.py                # Firebase Admin SDK credentials loader
│   └── firebase_auth.py           # JWT Bearer token decrypter & local validator
├── db/                            # Database connection setup
│   ├── client.py                  # Supabase PostgreSQL engine builder
│   └── base.py                    # SQLAlchemy ORM declarative models base
├── models/                        # Declarative database entities
│   ├── user.py                    # User account configurations
│   ├── profile.py                 # Multi-profile patient records
│   ├── report.py                  # Raw scanned report documents
│   ├── biomarker.py               # Extracted biomarker values
│   ├── shared_access.py           # Caregiver permissions ledger
│   └── notification.py            # Notification logs table
├── routes/                        # Session operations
│   ├── auth.py                    # Registration sync, sign-in token generators
│   └── access.py                  # Shared-access invitation senders
├── utils/                         # Helper utilities
│   ├── email.py                   # SMTP mail connections (TLS/SSL)
│   └── ocr.py                     # Medical PDF structure converters
└── main.py                        # FastAPI Application Bootstrap & global middleware
```

---

# ⚙️ Configuration & Environment Secrets

Create a `.env` file in the `backend/` directory based on the following template:

```ini
# App Configuration
APP_NAME=ScanTrace
APP_ENV=development
DEBUG=true
HOST=0.0.0.0
PORT=8000
FRONTEND_URL=http://localhost:8081

# Database Configuration (Supabase PostgreSQL URL)
DATABASE_URL=postgresql://<username>:<password>@<pooler-host>:5432/postgres?sslmode=require

# Supabase Storage Configuration
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET_NAME=reports

# Firebase Admin SDK Credentials (JSON String)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CREDENTIALS_JSON={"type": "service_account", "project_id": "...", "private_key_id": "...", "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n", "client_email": "...", ...}
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Gemini AI Platform Credentials
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
AI_PROVIDER=gemini

# SMTP Credentials for Transactional Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_gmail_address@gmail.com
SMTP_PASSWORD=your_app_specific_gmail_password
SMTP_FROM=your_gmail_address@gmail.com
SMTP_FROM_NAME=ScanTrace
```

---

# 🚀 Installation & Setup Guide

### Prerequisites
* Python 3.11+
* Node.js v18+ & npm
* Expo CLI & EAS CLI
* PostgreSQL database instance

### 1. Clone the Repository
```bash
git clone https://github.com/sumanthml/ScanTree.git
cd ScanTree
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Create and activate python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install required packages
pip install -r requirements.txt

# Run migrations / Database tables generation
# (The application runs Base.metadata.create_all on startup automatically)

# Run the Uvicorn local development server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
* Backend API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup
```bash
# Navigate back and open frontend
cd ../frontend

# Install node dependencies
npm install

# Start the Expo developer client
npx expo start -c
```
* Press `w` to run on web, `a` for Android Emulator, or `i` for iOS Simulator.

### 4. Build Standalone Android APK (EAS)
```bash
# Login to your Expo account
npx eas login

# Run a preview build to generate an installable APK file
npx eas build --platform android --profile preview
```

---

# 📌 Core API Endpoint Catalog

All routes require a valid Firebase ID Token passed as a Bearer token in the `Authorization` header (`Authorization: Bearer <token>`), unless specified as public.

### Authentication Endpoints
* `POST /auth/register` (Public) - Register new user credentials, initialize them in Firebase, sync the profile to PostgreSQL, and return a custom JWT token.
* `POST /auth/sync` - Syncs a freshly authenticated user's Firebase details into the local PostgreSQL database.
* `POST /auth/forgot-password` (Public) - Triggers an asynchronous email containing a secure password reset link.
* `GET /auth/me` - Resolves the currently authenticated user's profile and database identifier.

### Report & Scan Endpoints
* `POST /scans/upload` - Stream a raw PDF or image file into Supabase Storage, schedule the Gemini extraction engine, and save parsed biomarkers.
* `GET /reports` - List all reports associated with the authenticated profile.
* `DELETE /reports/{report_id}` - Deletes a report record and its associated biomarkers from the database, and deletes the file asset from Supabase Storage.
* `GET /reports/{report_id}/comparison` - Run a comparative analytics delta between the target report and the preceding report.

### Biomarker & Health Analytics Endpoints
* `GET /biomarkers` - Fetches all extracted biomarkers grouped by clinical category.
* `GET /biomarkers/history/{biomarker_name}` - Returns historical data points, timestamps, and reference status for a specific biomarker to feed chart visualizations.
* `GET /dashboard/{profile_id}` - Aggregates health score indicators, alerts, and abnormal biomarker counts.

---

# 🔬 Diagnostic Resolution Logs (Local Environment)

### Resolved DNS / IPv6 Handshake Hangs
During local development on macOS, the backend would frequently encounter `timeout of 30000ms exceeded` during user registration or forgot-password checks. 
* **The Root Cause:** macOS `mDNSResponder` prioritizes IPv6 address lookups (`AAAA` records). When requesting Google API gateways (`identitytoolkit.googleapis.com`), Python attempted connection over IPv6. Since the local ISP network didn't route IPv6 traffic, it hung for ~75 seconds waiting for the TCP handshake to fail before falling back to IPv4.
* **The Resolution:** Added a global socket monkeypatch in the application's startup code:
```python
import socket
orig_getaddrinfo = socket.getaddrinfo
def ipv4_only_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    return orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = ipv4_only_getaddrinfo
```
This forces Python to only resolve and connect over IPv4, reducing request latencies from **84.6 seconds** down to **0.76 seconds**.

---

# 👨‍💻 Primary Architect

### **Sumanth ML**
**AI/ML Engineer & Full-Stack Developer**
* **Focus:** Deep Learning, Healthcare Informatics, Distributed Systems, Asynchronous Architectures.
* **Portfolio / Contact:** [sumanthml18@gmail.com](mailto:sumanthml18@gmail.com)

---

# 📜 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
