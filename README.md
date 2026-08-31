# Mini Social Post App

A production-ready full-stack MERN social feed application inspired by the TaskPlanet Social Page, featuring JWT authentication, image uploads, likes, comments, and a responsive Material UI interface.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-Backend-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Material UI](https://img.shields.io/badge/Material--UI-MUI-007FFF?style=flat-square&logo=mui&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=flat-square&logo=vite&logoColor=white)

---

## Live Demo

- **Frontend**: [Coming Soon]
- **Backend**: [Coming Soon]

---

## Overview

**Mini Social Post App** is an original full-stack web application designed and built for the 3W Full Stack Internship Assignment. Inspired by the clean user experience of the **TaskPlanet Android App Social Page**, it delivers a modern community feed experience with rounded cards, soft drop-shadows, image uploads, instant like triggers, embedded comments, owner-based edit/delete capabilities, and secure JWT authentication.

---

## Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **UI Components**: Material UI (`@mui/material`, `@mui/icons-material`)
- **HTTP Client**: Axios with Authorization Bearer interceptors
- **Routing**: React Router DOM (v6)
- **Styling**: Material UI & Custom CSS (No Tailwind CSS)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas via Mongoose ORM
- **Authentication**: JWT (`jsonwebtoken`) & Password Hashing (`bcryptjs`)
- **File Uploads**: Multer
- **Middleware**: CORS & Dotenv

---

## Core Features

- **User Authentication**: Secure Signup and Login with bcrypt password hashing and persistent JWT sessions.
- **Public Community Feed**: Paginated feed listing posts in reverse chronological order (newest first).
- **Flexible Post Composer**: Create text-only, image-only, or text+image posts with real-time dropzone image thumbnail previews.
- **Like Interaction**: Instant like/unlike toggle with animated state changes and real-time like counters.
- **Nested Comments**: Expandable comments section on each post displaying commenter username, timestamp, and comment body.
- **Owner Controls**: Contextual 3-dot menu enabling post creators to edit text/media or delete posts with confirmation dialogs.
- **Data Integrity**: Usernames are stored directly within post likes and embedded comment sub-documents.
- **Responsive Layout**: Mobile-first centered feed (max 620px width) optimized for mobile, tablet, and desktop screens.

---

## Database Architecture

The application strictly uses **two MongoDB collections**:

### 1. `users` Collection
Stores user credentials and profile metadata.
```json
{
  "_id": "ObjectId",
  "username": "Anshika Pathak",
  "email": "anshika@example.com",
  "password": "hashed_bcrypt_password",
  "createdAt": "ISODate"
}
```

### 2. `posts` Collection
Stores post content, liker usernames, and embedded comments.
```json
{
  "_id": "ObjectId",
  "user": "ObjectId(User)",
  "text": "Finally set up the local dev environment!",
  "image": "/uploads/1788186402790-swhcvd.png",
  "likes": ["Anshika Pathak", "Rohan Sharma"],
  "comments": [
    {
      "username": "Rohan Sharma",
      "text": "Looks great! Ready to start!",
      "createdAt": "ISODate"
    }
  ],
  "createdAt": "ISODate"
}
```

> **Note**: Comments are embedded directly inside post documents and likes store an array of usernames. No additional database collections exist.

---

## Folder Structure

```text
mini-social-post-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── uploads/
│   │   └── .gitkeep
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Feed.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   └── theme.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
└── README.md
```

> **Best Practice Note**: Create a local `.env` file inside `backend/` using `backend/.env.example` before starting the backend server.

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskplanet_social?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

> 🔒 **Security Notice**: Never commit `.env` files or expose sensitive database credentials in public repositories. `.env` is ignored via `.gitignore`.

---

## Local Installation & Setup

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB Atlas cluster or local MongoDB instance

### 1. Setup Backend
```bash
cd backend
npm install
npm run dev
```
The backend server runs at `http://localhost:5000`.

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
The frontend runs on the Vite development server (typically `http://localhost:3000` or `http://localhost:5173`).

---

## API Documentation

All API endpoints return standard JSON responses:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/posts?page=1&limit=10` | Public | Fetch paginated feed (newest first) |
| `POST` | `/api/posts` | Protected | Create post with text & optional image |
| `GET` | `/api/posts/:id` | Public | Fetch single post details |
| `PUT` | `/api/posts/:id` | Protected | Update post text/media (Owner only) |
| `DELETE` | `/api/posts/:id` | Protected | Delete post (Owner only) |
| `POST` | `/api/posts/:id/like` | Protected | Toggle post like/unlike state |
| `POST` | `/api/posts/:id/comment` | Protected | Add comment to post |

---

## Screenshots

- **Login Screen**: `[Insert Login Screenshot]`
- **Signup Screen**: `[Insert Signup Screenshot]`
- **Community Feed**: `[Insert Feed Screenshot]`
- **Create Post Composer**: `[Insert Create Post Screenshot]`
- **Comments Drawer**: `[Insert Comments Screenshot]`
- **Mobile View**: `[Insert Mobile View Screenshot]`

---

## Deployment Guide

### Backend Deployment (Render)
1. Push repository to GitHub.
2. Create a new **Web Service** on Render pointing to the `backend` folder.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Configure environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`).

### Frontend Deployment (Vercel)
1. Connect repository on Vercel and set root directory to `frontend`.
2. Framework preset: **Vite**.
3. Configure environment variable: `VITE_API_URL` = `<your_render_backend_url>`.
4. Deploy (`vercel.json` will automatically handle SPA client routing).

---

## Push to GitHub

```bash
git init
git branch -M main
git add .
git status
git commit -m "Initial commit - Mini Social Post App"
git remote add origin https://github.com/Anshika366/mini-social-post-app.git
git push -u origin main
```
