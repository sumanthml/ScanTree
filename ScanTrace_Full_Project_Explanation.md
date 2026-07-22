# 🔬 ScanTrace — AI-Powered Medical Report Analysis Platform
### Complete Project Stack, Architecture, and Step-by-Step Flow

ScanTrace is an advanced, production-grade digital health technology platform that automates the extraction, categorization, clinical analysis, and longitudinal tracking of biomarkers from medical lab reports (PDF/images) using artificial intelligence.

---

## ⚡ 1. The Technology Stack

### 📱 Frontend (Mobile & Web)
* **Core Framework**: React Native (via Expo SDK 55 & React 19) for cross-platform iOS, Android, and Web compatibility.
* **Routing & Navigation**: `expo-router` using file-based routing. It utilizes a custom responsive layout wrapper (`ResponsiveLayout`) to render a desktop-friendly sidebar navigation menu on large screens, and a mobile bottom-bar navigation menu on smaller screens.
* **State Management**: `zustand` for lightweight, hook-based, global reactive states (e.g., auth session, profile selection, toast/alert models, app loading, and notifications).
* **Data Fetching**: `axios` with global request/response interceptors to attach Firebase Bearer tokens automatically, dynamically resolve local vs. production API endpoints, and handle unauthorized 401 token expirations by clearing the session and redirecting to the login screen.
* **Design & Styling**: Custom stylesheets with Vanilla React Native `StyleSheet` structures, featuring vibrant colors, smooth LinearGradients, glassmorphism card panels, dynamic hover animations, and a cohesive dark mode theme.
* **Icons**: `lucide-react-native` for high-quality SVG vector icons.
* **Storage Hydration**: `@react-native-async-storage/async-storage` for persisting user sessions, API configurations, and profile selection.

### ⚡ Backend API Service
* **Language & Runtime**: Python (version 3.10+) for fast, type-safe execution.
* **Web Framework**: FastAPI for high-performance asynchronous REST endpoints, integrated with Pydantic v2 schemas for robust request/response validation.
* **Application Server**: Uvicorn standard ASGI server.
* **ORM & Database Clients**: SQLAlchemy ORM for relational queries, `psycopg2-binary` (synchronous PostgreSQL driver), and `asyncpg` (asynchronous driver support).
* **Database Migrations**: Alembic for managing versioned SQL schema changes.

### ☁️ Databases, Storage, & Third-Party Services
* **Authentication**: Firebase Authentication. It handles user credentials, sign-in validation, password-reset emails, and JSON Web Tokens (JWT) safely.
* **Primary Database**: Supabase PostgreSQL with custom row-level security (RLS) policies.
* **Blob Storage**: Supabase Storage buckets for storing uploaded PDF and image lab reports securely.
* **AI/LLM Core**: Google Gemini API via the official `google-genai` Python library, using the `gemini-2.5-flash` model for structured JSON OCR extraction and clinical severity analysis.
* **File & Document Processing**:
  * **PyMuPDF (`fitz`)**: For opening PDF files and rendering their pages into high-resolution PNG images.
  * **Pillow (`PIL`)**: For image manipulation prior to LLM analysis.
  * **ReportLab**: For programmatic generation of medical summary PDF documents.

---

## 🗄️ 2. Database Schema & Data Models

### 1. User (`users` table)
Tracks primary app users verified by Firebase Auth.
* `id`: UUID (Primary Key, unique identifier)
* `firebase_uid`: String (Firebase Unique User ID, indexed)
* `name`: String (User Display Name)
* `email`: String (Unique email, indexed)
* `avatar_url`: String (Optional profile photo link)
* `active_profile_id`: UUID (Foreign key pointing to `profiles.id` currently selected)
* `is_email_verified`: Boolean (Tracks verification state)
* `created_at` / `updated_at`: Timestamps

### 2. Profile (`profiles` table)
Allows multi-patient tracking (e.g., User's own health, Spouse, Children, or Parents).
* `id`: UUID (Primary Key)
* `user_id`: UUID (Foreign Key linking to `users.id`)
* `firebase_uid`: String (Firebase UID)
* `full_name`: String (Patient's full name)
* `gender`: String (Patient's gender, e.g., Male, Female)
* `date_of_birth`: Date (Patient's birthdate)
* `blood_group`: String (Blood type, e.g., A+, O-)
* `relationship_type`: String (Relationship to the user: "Self", "Spouse", "Child", "Parent")
* `photo_path`: Text (Storage location of profile photo)

### 3. ScanJob (`scan_jobs` table)
Tracks the status and progress of uploaded files during background AI processing.
* `id`: UUID (Primary Key)
* `user_id`: UUID (Foreign Key linking to `users.id`)
* `profile_id`: UUID (Foreign Key linking to `profiles.id`)
* `original_filename`: String (Uploaded filename)
* `stored_filename`: String (UUID-based storage filename)
* `file_path`: Text (Supabase storage path)
* `file_size`: Integer (Size in bytes)
* `mime_type`: String (e.g., `application/pdf`, `image/png`)
* `status`: String (`UPLOADED`, `PROCESSING`, `COMPLETED`, `FAILED`)
* `progress`: Integer (Percent completion: 0 to 100)
* `current_stage`: String (Human-readable stage description, e.g. "Analyzing medical report")
* `error_message`: Text (Populated if the scan fails)

### 4. Report (`reports` table)
Saves metadata of completed reports.
* `id`: UUID (Primary Key)
* `profile_id`: UUID (Foreign Key linking to `profiles.id`)
* `scan_job_id`: UUID (Foreign Key linking to `scan_jobs.id`)
* `firebase_uid`: String (Firebase User ID)
* `report_type`: String (Defaults to "LAB_REPORT")
* `original_filename` / `stored_filename` / `file_path` / `mime_type` / `file_size`: Copy of file metadata
* `hospital_name`: String (Name of the hospital/laboratory extracted by AI)
* `report_date`: Date (Date the report was issued)
* `health_score`: Integer (AI-calculated overall wellness score, 0 to 100)
* `summary`: Text (Comprehensive summary of the report results)

### 5. Biomarker (`biomarkers` table)
Stores individual chemical and physiological readings extracted from the report.
* `id`: UUID (Primary Key)
* `report_id`: UUID (Foreign Key linking to `reports.id`)
* `name`: String (Name of the biomarker, e.g., "Hemoglobin", "HbA1c", "Glucose")
* `value`: String (Extracted numeric reading stored as text to accommodate ranges/non-standard results)
* `unit`: String (Measurement unit, e.g., "g/dL", "mg/dL", "%")
* `reference_range`: String (Standard biological reference range, e.g., "70-100", "< 5.7")
* `severity`: String (Clinical severity rating: `NORMAL`, `LOW`, `HIGH`, `CRITICAL`, `UNKNOWN`)
* `category`: String (Biological system, e.g., "Blood Sugar", "Lipid Panel", "Liver Function")
* `clinical_significance`: Text (Short medical note about the reading's implications)
* `confidence_score`: Float (Extraction confidence score from 0.0 to 1.0)

### 6. AIInsight (`ai_insights` table)
Tracks macro recommendations and wellness reports for a report.
* `id`: UUID (Primary Key)
* `report_id`: UUID (Foreign Key linking to `reports.id`)
* `title`: String (e.g., "AI Clinical Summary")
* `description`: Text (General patient summary)
* `severity`: String (Risk level: `LOW`, `MODERATE`, `HIGH`, `CRITICAL`)
* `recommendation`: Text (Actionable health and lifestyle recommendations)
* `confidence_score`: Float (AI overall confidence)
* `provider`: String (e.g., "gemini")

### 7. SharedAccess (`shared_access` table)
Manages permissions for medical record sharing between users.
* `id`: UUID (Primary Key)
* `owner_user_id`: UUID (Owner's User ID)
* `shared_user_email`: String (Recipient's email address)
* `permission_level`: String (`read` or `write` access)
* `status`: String (`pending`, `accepted`, `declined`)
* `expires_at`: Timestamp (Default 1-year lifespan)

---

## 🔄 3. Point-to-Point Execution Flow (Sequence of Events)

### 🔐 Part A: Registration & Authentication Sync
```
[Frontend App]                                                [FastAPI Backend]                              [Firebase Auth]
  |                                                                   |                                             |
  |--- 1. Register Request (Name, Email, Password) ------------------>|                                             |
  |                                                                   |--- 2. Create User in Firebase ------------->|
  |                                                                   |<-- 3. Return UID & user metadata -----------|
  |                                                                   |                                             |
  |                                                                   |--- 4. Insert User & Profile in DB ----------|
  |                                                                   |--- 5. Generate Custom Token --------------->|
  |                                                                   |<-- 6. Return Custom Token String -----------|
  |                                                                   |                                             |
  |                                                                   |                                             |
  |<-- 7. Return Account Success + Custom Token ----------------------|                                             |
  |                                                                   |                                             |
  |--- 8. Exchange Custom Token for ID Token -------------------------|-------------------------------------------->|
  |<-- 9. Return JWT ID Token ----------------------------------------|---------------------------------------------|
  |                                                                   |                                             |
  |--- 10. Store ID Token in AsyncStorage & set Axios headers         |                                             |
  |--- 11. Redirect User to Dashboard                                 |                                             |
```

* **Login Flow**:
  1. Frontend submits Email & Password directly to Firebase REST API:
     `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=FIREBASE_API_KEY`
  2. Firebase returns an ID token (JWT).
  3. Frontend sends a `POST` request containing the Bearer token in the header to backend `/auth/sync`.
  4. Backend verifies the token signature via the Firebase Admin SDK, loads user profile details from PostgreSQL (or inserts a fallback profile if missing), and returns synchronized user parameters.

---

### 📤 Part B: Report Upload & Background AI Pipeline
When a user uploads a PDF or image lab report:

```
[Frontend Client]                      [FastAPI Backend API]                 [Supabase Storage]              [Background Thread]
  |                                             |                                    |                                |
  |-- 1. POST /scans/upload (File, Profile) --->|                                    |                                |
  |                                             |-- 2. Validate file type & ext      |                                |
  |                                             |-- 3. Save file content ----------->|                                |
  |                                             |<-- 4. Return stored filename ------|                                |
  |                                             |                                    |                                |
  |                                             |-- 5. Create ScanJob (status=UPLOADED)|                               |
  |                                             |-- 6. Dispatch Background Thread ----|------------------------------->|
  |                                             |                                    |                                |
  |<-- 7. Returns 201 Created (ScanJob ID) -----|                                    |                                |
  |                                             |                                    |                                |
  |                                             |                                    |-- 8. Fetch raw file bytes ---->|
  |                                             |                                    |                                |
  |                                             |                                    |-- 9. Convert PDF pages to PNG  |
  |                                             |                                    |-- 10. Call Gemini Vision API   |
  |                                             |                                    |    (model: gemini-2.5-flash)   |
  |                                             |                                    |-- 11. Parse & Validate JSON    |
  |                                             |                                    |-- 12. Create Report & Insights |
  |                                             |                                    |-- 13. Analyze severity per bio |
  |                                             |                                    |-- 14. Calculate Health Score   |
  |                                             |                                    |-- 15. Set ScanJob COMPLETED    |
```

#### Detailed Worker Processing Pipeline (Steps 8-15 in Thread):
1. **Download Document**: Downloads the file bytes from Supabase Storage and writes them to a temporary file locally.
2. **Page Conversion**: If it is a PDF, PyMuPDF (`fitz`) parses each page and renders it to a PNG image inside a temporary directory. If it is an image, it is read directly.
3. **Structured Gemini Vision OCR**: Passes the pages of images to the Gemini API (`gemini-2.5-flash`) using a strict JSON output instruction format.
   * Gemini performs image-to-text OCR, identifies the laboratory parameters, reads their values, normalizes the units, and recognizes reference ranges.
4. **Pydantic Validation**: Backend cleans the response of code block fences and parses the JSON. It validates the output against the `AIResponseSchema` schema:
   * Attributes: `patient_summary`, `risk_level` (LOW, MODERATE, HIGH, CRITICAL), `overall_confidence_score`, `biomarkers` array, and `recommendations` list.
5. **Database Models Insertion**: Resolves the target Profile ID, then inserts the `Report` and its associated `AIInsight` records in a single database transaction.
6. **Clinical Severity Scoring**: For each extracted biomarker, the thread runs `ClinicalSeverityService.analyze_biomarker()`. This fires a lightweight classification call to Gemini, feeding the biomarker name, value, unit, and reference range.
   * Gemini determines a clinical severity class: `LOW`, `NORMAL`, `HIGH`, `CRITICAL`, or `UNKNOWN`, along with a logical reason.
7. **Wellness Score Aggregator**: Runs the `HealthScoreService.calculate_health_score(report)` algorithm:
   * Begins at a score of **100**.
   * Penalizes the score based on abnormal biomarkers and their severity weights:
     * **NORMAL**: 0 penalty points
     * **LOW**: 5 penalty points
     * **HIGH**: 12 penalty points
     * **CRITICAL**: 25 penalty points
   * High-priority biomarkers (e.g., *Troponin, Creatinine, HbA1c, Glucose, LDL, Cholesterol*) are calculated with a **1.5x penalty multiplier**.
   * Aggregated penalties are subtracted from 100 (bounded from 0 to 100) to yield the final report `health_score`.
8. **Finalize Job**: The ScanJob record is updated to `COMPLETED` (progress `100`).

---

### 📈 Part C: Historical Trend Analysis
When the user views a report's details screen (`frontend/app/report/[id].tsx`), the app requests `/reports/{report_id}/comparison`.
1. The backend retrieves the current report metadata and biomarkers.
2. It executes a query to find the *immediate chronologically preceding report* belonging to the same Profile ID.
3. If found, it runs `ComparisonService.compare_reports()`:
   * Maps common biomarkers by lowercase names.
   * Calculates difference (`current_value - previous_value`) and percent change.
   * Computes the trend (`INCREASED`, `DECREASED`, or `UNCHANGED`).
   * Evaluates the severity shift (e.g., `NORMAL -> HIGH`).
   * Classifies clinical status (`IMPROVED`, `WORSENED`, or `STABLE`) by comparing relative ranks of severity statuses:
     * `LOW` = 0, `NORMAL` = 1, `HIGH` = 2, `CRITICAL` = 3.
4. Returns comparison records to the client, which dynamically renders trend metrics and directional status indicators in the user interface.

---

### 👨‍⚕️ Part D: Access Sharing System
```
[Owner App]                         [FastAPI Backend]                     [Database]                       [Recipient App]
     |                                      |                                 |                                   |
     |-- 1. Invite (Email, Permission) ---->|                                 |                                   |
     |                                      |-- 2. Insert SharedAccess -------|                                   |
     |                                      |      (status='pending')         |                                   |
     |                                      |-- 3. Send Invitation Email      |                                   |
     |                                                                        |                                   |
     |                                                                        |-- 4. Get Requests -------------->|
     |                                                                        |                                   |<-- 5. Accepts invite
     |                                      |<-- 6. POST accept --------------|-----------------------------------|
     |                                      |-- 7. Update status='accepted' --|                                   |
     |                                      |                                 |                                   |
     |                                      |<-- 8. Can view shared reports---|-----------------------------------|
```

1. **Invite**: The owner inputs the target email address and chooses a role level (`read` or `write`).
2. **Pending Share**: The API creates a `SharedAccess` record with state `pending`, and queues an asynchronous email invitation.
3. **Acceptance**: The recipient logs in, requests pending incoming invites from `/access/requests`, and clicks Accept.
4. **Active Share**: The API updates the status to `accepted`. The recipient can now retrieve the owner's medical records because queries include a validation check against active `SharedAccess` records.
5. **Revocation**: The owner can revoke access at any time via a `DELETE /access/members/{member_id}` command.

---

## 🧪 4. Testing & CI/CD Pipelines

ScanTrace has an extensive test harness containing over **500 total test cases** to guarantee stability, type-safety, and secure code execution.

### Test Categories
1. **Authentication API (45 tests)**: Register, Login, JWT validation, custom token, password resets, and session recovery.
2. **User Profile API (35 tests)**: Profile creation, demographics validation, active profile assignment, and multi-profile checks.
3. **Reports API (50 tests)**: CRUD operations, clinical summaries, sorting, search, filtering, and PDF exports.
4. **File Upload API (40 tests)**: Validating file extensions, max file size bounds, mock Supabase uploads, and progress tracking.
5. **Analytics API (35 tests)**: Trend algorithms, health score calculations, and biomarker priority weighting.
6. **Notifications API (30 tests)**: Digest triggers, push settings, and unread badges.
7. **Access Management (30 tests)**: Invites, status changes, privilege checks, and revocation.
8. **OWASP Top 10 Security (50 tests)**: SQL Injection (SQLi), Cross-Site Scripting (XSS), Insecure Direct Object References (IDOR), Path Traversal, Command Injection, Null Byte injection, JWT tampering, and CORS header constraints.
9. **Data Validation (40 tests)**: Pydantic parsing limits, out-of-range bounds, and malformed emails.
10. **Error Handling (35 tests)**: Simulating DB downtime, storage disconnections, and invalid LLM JSON payloads.
11. **Integration Flows (30 tests)**: Multi-step end-to-end user flows.
12. **Performance & Load (15 tests)**: Response latency assertions under high concurrent workloads.
13. **Settings & Health (30 tests)**: Dynamic backend configuration changes, database ping readiness, and timezones.
14. **Boundary & Edge Cases (31 tests)**: Special character filters, empty strings, and numeric overflows.

### Automation Pipelines (GitHub Actions)
Four automated workflows run on every `git push` to the `main` branch:
1. **🔬 Comprehensive Test Pipeline (`comprehensive-tests.yml`)**: Installs Python dependencies, starts a temporary database, runs all 500 API test cases, and compiles results into an HTML report and Excel spreadsheet published to GitHub Pages.
2. **🚀 Deploy & End-to-End (`deploy-and-test.yml`)**: Builds the Expo web application, deploys it to GitHub Pages, spins up Selenium, executes 14 E2E browser test flows (Login, Upload, Chart render, Dashboard, Logout), and launches a concurrent load test.
3. **🛡️ Security Assessment (`security-review.yml`)**: Runs SAST static code scanning, scans `requirements.txt` for known CVE vulnerabilities, inventories API endpoints, and launches a dynamic pentest attacking the authentication, IDOR vulnerabilities, and input sanitization layers.
4. **📱 Android Appium (`android-e2e.yml`)**: Bundles and loads the Android client on an emulator to run Appium E2E gesture and flow tests, capturing screenshots of screen states automatically.
