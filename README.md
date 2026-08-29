# ScamSentry PK

ScamSentry PK is a community-driven, AI-ready threat intelligence platform designed to help users in Pakistan identify, report, and analyze digital scams. This project provides a secure mechanism for users to document suspicious activities—including malicious text messages, deceptive URLs, fraudulent QR codes, and screenshot evidence.

## Phase 1 (Foundation)
This repository currently contains the **Phase 1** foundation of the project. It is a robust MERN-stack application featuring:
- **Authentication & Authorization**: Secure JWT-based auth with Role-Based Access Control (RBAC) separating regular users and admins.
- **Reporting Engine**: A dynamic form supporting multiple threat types (Text, URL, Screenshot, QR Code).
- **Cloud Asset Management**: Direct-to-Cloudinary memory streaming for image evidence, ensuring the server disk remains uncluttered.
- **Admin Dashboard**: A secure portal for administrators to review all platform statistics and reports.
- **Security First**: Strict IDOR (Insecure Direct Object Reference) prevention, validation schemas, and environment secret management.
- **Modern UI**: A responsive, dark-mode cybersecurity-themed interface built with Tailwind CSS and Lucide React icons.

*(Note: Phase 2 will introduce AI-powered threat analysis using Gemini/OpenAI).*

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v3, React Router DOM v6, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Security**: bcryptjs, jsonwebtoken, express-validator
- **Storage**: Cloudinary, Multer (Memory Storage)

## Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Cloudinary Account (for image uploads)

## Environment Variables
Create a `.env` file in the `server` directory and `client` directory.

### `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/scamsentry
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   # Install root dependencies (concurrently)
   npm install

   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd ../client && npm install
   ```

2. **Run the Application**
   From the root directory, you can start both the client and server concurrently:
   ```bash
   npm run dev
   ```
   - Frontend will be available at `http://localhost:5173`
   - Backend will be available at `http://localhost:5000`

## Security Considerations Implemented
- **Password Hashing**: Bcrypt with salt rounds.
- **Token Security**: Stateless JWT authentication via HTTP headers.
- **IDOR Protection**: Users can only modify/delete their own reports.
- **Role Middleware**: Admin-only routes are strictly protected at the API level.
- **Input Validation**: Extensive checks on all incoming payloads using `express-validator`.
- **Upload Limits**: Hard limits on file sizes and MIME types via Multer.

## License
MIT License - Developed as a portfolio internship project.
