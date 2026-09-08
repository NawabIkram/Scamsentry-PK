# ScamSentry PK

ScamSentry PK is a community-driven, AI-ready threat intelligence platform designed to help users in Pakistan identify, report, document, and analyze digital scams. This project provides a secure mechanism for users to submit suspicious activities—including malicious text messages, deceptive URLs, fraudulent QR codes, and screenshot evidence—and receive real-time AI threat analysis.

---

## 🚀 Features & Architecture

### Phase 1 (Foundation)
- **Authentication & Authorization**: Secure JWT-based authentication with Role-Based Access Control (RBAC) separating regular users and platform administrators.
- **Reporting Engine**: Dynamic multi-vector threat reporting form supporting Text, URL, Screenshot, and QR Code payloads.
- **Cloud Asset Management**: Direct-to-Cloudinary memory streaming for screenshot evidence, avoiding server disk clutter.
- **Admin Dashboard**: Secure administrative portal to monitor statistics, review community submissions, and moderate reports.
- **Security First**: Strict IDOR (Insecure Direct Object Reference) prevention, input validation schemas (`express-validator`), and environment secret management.
- **Modern Dark UI**: Cybersecurity-themed interface built with React 19, Tailwind CSS, Lucide React icons, and Framer Motion.

### 🤖 Phase 2 (AI Threat Intelligence Engine)
- **Google Gemini API Integration**: Leverages Google Gemini models (`@google/genai`) to parse raw threat payloads, classify scam intent, and output structured JSON intelligence.
- **Automated Risk Scoring**: Calculates real-time Risk Scores (0–100) and assigns threat severity tiers (`Critical`, `High`, `Medium`, `Low`).
- **Heuristic Threat Fallback Engine**: Built-in rule engine that analyzes Pakistan-specific scam patterns (JazzCash, EasyPaisa, HBL, BISP, OTP requests, fake lottery alerts, coercive urgency, unencrypted HTTP links) if an API key is unconfigured or AI service is unreachable.
- **Indicators of Compromise (IOC) Extraction**: Identifies and flags suspicious domain URLs, headers, financial references, and scam keywords.
- **Attack Vector & Tactics Identification**: Automatically categorizes cyber attack techniques (e.g., *Brand Impersonation*, *Urgency & Panic Creation*, *Credential Harvesting*).
- **Interactive Re-Scan & Automated Triggers**: Auto-triggers threat evaluation on report creation (`POST /api/reports`) and provides an on-demand re-scan endpoint (`POST /api/reports/:id/analyze`) with an interactive UI trigger button.
- **Zero-Config In-Memory DB Fallback**: Integrated `mongodb-memory-server` to automatically spin up a local in-memory MongoDB database whenever a local MongoDB service is unavailable.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v3, React Router DOM v6, Axios, Lucide React, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), `mongodb-memory-server`
- **AI & ML**: Google Gemini API (`@google/genai`), Heuristic Pattern Engine
- **Security**: bcryptjs, jsonwebtoken, express-validator, helmet, CORS
- **Storage**: Cloudinary, Multer (Memory Storage)

---

## ⚙️ Prerequisites

- Node.js (v18+)
- MongoDB (Local instance, Atlas URI, or automatic In-Memory fallback)
- Cloudinary Account (for image evidence uploads)
- Google Gemini API Key (Optional: Heuristic fallback engine will run automatically if omitted)

---

## 🔑 Environment Variables

Create a `.env` file in the `server` directory and `client` directory.

### `server/.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/scamsentry_pk
JWT_SECRET=super_secure_jwt_secret_key_12345
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI Config (Optional)
GEMINI_API_KEY=your_gemini_api_key
```

### `client/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📦 Installation & Running Locally

1. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd ../client && npm install
   ```

2. **Run both Backend & Frontend Concurrently**
   From the root directory:
   ```bash
   npm run dev
   ```
   - **Frontend GUI**: Available at `http://localhost:5173`
   - **Backend API**: Available at `http://localhost:5000`

---

## 🔒 Security Considerations Implemented

- **Password Hashing**: Bcrypt password salting and hashing.
- **Stateless Authentication**: JWT tokens issued on login/registration and validated via auth headers.
- **IDOR Protection**: Strict ownership checks ensuring users can only read, analyze, or delete their own reports.
- **Role-Based Access Control (RBAC)**: Admin-only routes strictly protected at the middleware level.
- **Input Validation**: `express-validator` rules sanitizing all incoming payloads.
- **Memory File Uploads**: Upload stream memory buffer limits with Cloudinary asset cleanup on deletion.

---

## 📄 License
MIT License - Developed as a threat intelligence portfolio project.
