# TaskPlanet Social Feed Clone

A production-ready, full-stack MERN (MongoDB, Express.js, React.js, Node.js) Social Feed application built from scratch. Inspired by the **TaskPlanet Android App Social Page**, this project delivers a premium mobile-first community feed experience with rounded cards, soft shadows, text/image post composer, real-time likes, nested comments, owner post editing/deletion, JWT authentication, and pagination.

---

## Key Features

- **JWT Authentication**: User Signup and Login with bcrypt password hashing and session persistence across page refreshes.
- **TaskPlanet Inspired UI**: Mobile-first responsive layout (max-width 620px desktop feed container), 16px rounded white cards, indigo accents, and clean typography.
- **Rich Post Composer**: Support for text-only, image-only, or text+image posts with instant dropzone preview and remove capability.
- **File Uploads**: Image processing powered by `multer` with unique filename generation and static file serving.
- **Realtime Interaction**: Toggle post likes and expand embedded comment sections with instant state updates.
- **Owner Post Actions**: Contextual 3-dot menu allowing post owners to edit text/media or delete posts with Material UI confirmation dialogs.
- **Feed Pagination**: Efficient backend pagination (`GET /api/posts?page=1&limit=10`) with a frontend "Load More" button.
- **Strict 2 Collections Architecture**: Optimized MongoDB Atlas schema using only `users` and `posts` collections.
- **Delightful UX**: Material UI skeleton loading states, empty feed illustration, snackbar notifications, and smooth hover transitions.

---

## Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM (v6)
- **UI Components & Icons**: Material UI (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`)
- **HTTP Client**: Axios with Authorization Bearer Interceptors
- **Typography & Styling**: Google Plus Jakarta Sans & Custom CSS (No Tailwind)

### Backend
- **Runtime**: Node.js & Express.js
- **Database ORM**: Mongoose (MongoDB Atlas)
- **Security**: bcryptjs & jsonwebtoken (JWT)
- **File Uploads**: Multer
- **Middleware**: CORS & Dotenv

---

## Folder Structure

```text
taskplanet-social-clone/
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
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── assets/
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

---

## Database Design

The project strictly uses **two MongoDB collections**:

### 1. `users` Collection
| Field | Type | Options |
|---|---|---|
| `username` | String | Required, Trim |
| `email` | String | Required, Unique, Lowercase |
| `password` | String | Required (Hashed via bcryptjs) |
| `createdAt` | Date | Auto Timestamps |

### 2. `posts` Collection
| Field | Type | Options |
|---|---|---|
| `user` | ObjectId | Ref to `User` collection |
| `text` | String | Default `""` |
| `image` | String | File path (`/uploads/...`) |
| `likes` | Array of Strings | Usernames of likers |
| `comments` | Array of Objects | Embedded `[{ username, text, createdAt }]` |
| `createdAt` | Date | Auto Timestamps |

---

## API Endpoints Table

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/posts?page=1&limit=10` | Public | Fetch paginated posts (newest first) |
| `POST` | `/api/posts` | Protected | Create post with optional image upload |
| `GET` | `/api/posts/:id` | Public | Fetch single post by ID |
| `PUT` | `/api/posts/:id` | Protected | Update post text/media (Owner only) |
| `DELETE` | `/api/posts/:id` | Protected | Delete post (Owner only) |
| `POST` | `/api/posts/:id/like` | Protected | Toggle post like/unlike state |
| `POST` | `/api/posts/:id/comment` | Protected | Add new comment to post |

---

## Standard API Response Format

All backend endpoints return standardized JSON responses:

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {}
}
```

---

## Environment Variables Setup

### Backend Environment Variables (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskplanet_social?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

### Frontend Environment Variables (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## Local Installation & Setup

### Prerequisites
- Node.js (v16+ or v18+)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone & Setup Backend
```bash
cd backend
npm install
npm run dev
```
Backend will start on `http://localhost:5000`.

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will launch on `http://localhost:3000`.

---

## Deployment Guide

### Backend Deployment on Render

1. Push code to GitHub repository.
2. Log into [Render Dashboard](https://dashboard.render.com/) and create a **New Web Service**.
3. Connect your GitHub repository and specify the **Root Directory** as `backend`.
4. Set Build Command: `npm install`
5. Set Start Command: `node server.js`
6. Under **Environment Variables**, add:
   - `PORT` = `5000`
   - `MONGO_URI` = `<your_mongodb_atlas_uri>`
   - `JWT_SECRET` = `<your_jwt_secret>`
7. Deploy Web Service and copy your public Render backend URL.

### Frontend Deployment on Vercel

1. Log into [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
2. Select your GitHub repository and set **Framework Preset** to `Vite`.
3. Set **Root Directory** to `frontend`.
4. Under **Environment Variables**, set:
   - `VITE_API_URL` = `<your_deployed_render_backend_url>`
5. Deploy project. Routing rules in `vercel.json` will automatically handle SPA client routing.

---

## Push to GitHub

```bash
git init
git branch -M main
git add .
git status
git commit -m "Initial commit - Mini Social Post App"
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
