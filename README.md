# File Upload App

A React frontend with login and CSV/Excel file upload that sends files to your backend.

## Features

- **Login** – Email/password auth with token storage
- **File upload** – CSV and Excel (.csv, .xlsx, .xls) via drag & drop or file picker
- **Backend integration** – Sends files to your API with Bearer token auth

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

**With backend** (recommended):
```bash
# Terminal 1 - backend
npm run server

# Terminal 2 - frontend
npm run dev
```

- **Demo mode**: If no backend is running, use any email/password to log in and test the UI. Upload will show a success message with backend connection instructions.

## Backend API

Configure your backend URL in `.env`:

```
VITE_API_URL=http://localhost:3001/api
```

Or use the built-in proxy: requests to `/api/*` are proxied to `http://localhost:3001` (see `vite.config.js`).

### Endpoints

**POST /api/auth/login**
```json
Request: { "email": "user@example.com", "password": "secret" }
Response: { "token": "jwt-token", "user": { "email": "..." } }
```

**POST /api/upload**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`
- Body: `file` (CSV or Excel file)

## Project Structure

```
src/
├── api/client.js      # API helpers (login, upload)
├── context/AuthContext.jsx
├── components/ProtectedRoute.jsx
├── pages/
│   ├── Login.jsx
│   └── Upload.jsx
├── App.jsx
├── main.jsx
└── index.css
```
