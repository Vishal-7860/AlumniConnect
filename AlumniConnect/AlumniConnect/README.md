# 🎓 AlumniConnect — Alumni Management Platform

A full stack Alumni Data Management & Engagement Platform built for **Smart India Hackathon (SIH) 2025**.

---

## 📌 SIH Problem Statement

| Field | Details |
|-------|---------|
| PS Number | SIH25017 |
| Theme | Smart Education |
| Organization | Government of Punjab |
| Title | Digital Platform for Centralized Alumni Data Management and Engagement |

---

## 🚀 Features

- 🗂 **Alumni Directory** — Search & filter by branch, batch, company
- 📅 **Events** — Upcoming alumni events with one-click registration
- 💼 **Job Board** — Job & internship listings posted by alumni
- ✍️ **Join Form** — Register as alumni, instantly saved to MongoDB
- 📊 **Dashboard** — Live network stats
- 🔐 **Login/Register** — JWT Authentication

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Pure CSS |

---

## 📁 Project Structure

```
AlumniConnect/
├── alumni-platform/        ← Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx         ← Main UI component
│   │   ├── api.js          ← API calls to backend
│   │   ├── index.css       ← Reset styles
│   │   └── main.jsx        ← Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── alumni-backend/         ← Backend (Node.js + Express)
    ├── config/db.js        ← MongoDB connection
    ├── middleware/auth.js  ← JWT middleware
    ├── models/             ← User, Alumni, Event, Job schemas
    ├── routes/             ← API routes
    ├── server.js           ← Entry point
    ├── .env.example        ← Environment variables template
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB installed and running

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/AlumniConnect.git
cd AlumniConnect
```

### 2. Setup Backend
```bash
cd alumni-backend
npm install
# Create .env file from .env.example
cp .env.example .env
npm run dev
```
Backend runs at: **http://localhost:5000**

### 3. Setup Frontend
```bash
cd alumni-platform
npm install
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/alumni | Get all alumni |
| POST | /api/alumni | Add alumni |
| GET | /api/events | Get all events |
| POST | /api/events | Create event |
| GET | /api/jobs | Get all jobs |
| POST | /api/jobs | Post a job |

---

## 👨‍💻 Author

Made with ❤️ for **Smart India Hackathon 2025**
