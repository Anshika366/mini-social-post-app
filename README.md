# Mini Social Post App

A full-stack MERN social feed application inspired by the TaskPlanet Social Page.

---

## Tech Stack

- **Frontend**: React.js, Material UI, Axios, React Router DOM (Vite)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose ORM)
- **Authentication**: JSON Web Token (JWT) & bcryptjs
- **File Uploads**: Multer

---

## Features

- **User Authentication**: Secure Signup and Login with hashed passwords & persistent JWT sessions.
- **Public Feed**: Reverse chronological community feed with infinite scroll / load more.
- **Post Composer**: Create text-only, image-only, or text+image posts with image preview.
- **Interactions**: Toggle like/unlike with real-time counters and embedded comment sections.
- **Owner Controls**: Contextual 3-dot menu allowing post owners to edit or delete posts.
- **Database Optimization**: Uses **exactly two MongoDB collections** (`users` and `posts`) with embedded comments.
- **Responsive UI**: Clean Material UI card interface optimized for desktop and mobile devices.

---

## Project Structure

```text
mini-social-post-app/
├── backend/
├── frontend/
└── README.md
```

---

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
> Copy `backend/.env.example` to `backend/.env` before running.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)
- `PORT` = 5000
- `MONGO_URI` = your_mongodb_atlas_connection_string
- `JWT_SECRET` = your_jwt_secret_key

### Frontend (`frontend/.env`)
- `VITE_API_URL` = http://localhost:5000

---

## Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## Screenshots

- **Login**: `[Insert Login Screenshot]`
- **Signup**: `[Insert Signup Screenshot]`
- **Feed**: `[Insert Feed Screenshot]`
- **Create Post**: `[Insert Create Post Screenshot]`
- **Comments**: `[Insert Comments Screenshot]`
- **Mobile View**: `[Insert Mobile View Screenshot]`

---

## Assignment Checklist

| Requirement | Tech / Architecture | Status |
|---|---|---|
| React.js Frontend | React 18 + Vite | ✅ |
| Node.js + Express | Express.js REST API | ✅ |
| MongoDB Database | MongoDB Atlas (2 Collections) | ✅ |
| Material UI Styling | Material UI + Custom CSS | ✅ |
| Authentication | Signup / Login with JWT | ✅ |
| Social Feed & Composer | Text, Image, or Both | ✅ |
| Interactions | Like, Comment, Edit, Delete | ✅ |
| Deployment Ready | Render + Vercel + Atlas | ✅ |
