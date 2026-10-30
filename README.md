# Personal Portfolio Platform (FastAPI + React)

This repository is a full-stack personal portfolio and blog platform.

- Backend: FastAPI + SQLModel + PostgreSQL
- Frontend: React (Vite) + Tailwind CSS + Axios
- Scope: Public portfolio pages and admin management screens

## Project Architecture

- The backend exposes REST endpoints for profile, projects, and blogs.
- The frontend consumes backend APIs and provides:
  - Public pages: Home, About, Portfolio, Blog, Project detail
  - Admin pages: Dashboard, project manager, blog manager (protected routes)

## Directory Structure

```text
fastapi/
|- backend/
|  |- main.py                  # Entrypoint (imports FastAPI app)
|  |- requirements.txt         # Python dependencies
|  |- README.md
|  |- app/
|     |- app.py                # FastAPI routes and CORS setup
|     |- db.py                 # SQLModel engine and DB session dependency
|     |- models/
|     |  |- project.py         # Project SQLModel table
|     |  |- blog.py            # Blog SQLModel table
|     |- schemas/
|        |- project.py         # Project request/response schema
|        |- blog.py            # Blog request/response schema
|        |- profile.py         # Profile schema
|
|- frontend/
|  |- package.json             # Node scripts and dependencies
|  |- vite.config.js
|  |- eslint.config.js
|  |- index.html
|  |- README.md
|  |- src/
|     |- App.jsx               # Route map
|     |- main.jsx              # React entrypoint
|     |- services/
|     |  |- api.js             # Axios client and API wrappers
|     |- layouts/
|     |  |- PublicLayout.jsx
|     |  |- AdminLayout.jsx
|     |- pages/
|     |  |- Home.jsx
|     |  |- About.jsx
|     |  |- Portfolio.jsx
|     |  |- Blog.jsx
|     |  |- ProjectDetail.jsx
|     |  |- admin/
|     |     |- Login.jsx
|     |     |- Dashboard.jsx
|     |     |- ProjectManager.jsx
|     |     |- BlogManager.jsx
|     |- components/
|        |- admin/
|           |- ProtectedRoute.jsx
|
|- PROMPT2.md
|- PROMPT3.md
```

## Backend API Summary

Base URL: `http://localhost:8000/api/v1`

All JSON is camelCase. List endpoints are paginated: `{ items, total, page, size, pages }` (max `size` 100).

### Auth
- `POST /auth/login` -> form-urlencoded (`username` = email), returns `{ access_token, token_type }` (token lifetime 15 min, no refresh)
- `GET /auth/me` -> current user (Bearer required)

### Public
- `GET /projects/?page&size` -> paginated projects
- `GET /projects/{id}` / `GET /projects/slug/{slug}`
- `GET /blogs/?page&size&tag` -> paginated published posts (list item has no `content`)
- `GET /blogs/{id}` / `GET /blogs/slug/{slug}` -> full post (adds `content`, `isPublished`)
- `POST /contact/` -> `{ name, email, subject, message, website }` (`website` is a honeypot); rate limited (5/min, 30/hour)

### Admin (Bearer required)
- `/admin/projects` and `/admin/blogs` -> `GET` list / `GET {id}` / `GET slug/{slug}` / `POST` / `PUT` / `PATCH` / `DELETE`
- `/admin/contact` -> `GET ?is_read` / `GET {id}` / `PATCH { isRead }` / `DELETE`
- `GET /admin/media/auth` / `DELETE /admin/media/{fileId}` -> ImageKit signed-upload auth / delete

Project `status` is one of: `planned` | `in-progress` | `completed` | `archived`.
The client never sends `id`, `slug`, `createdAt`, `updatedAt`, `readingTime` (the server generates `slug` and `readingTime`).

## Quick Start

### 1. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend dev server: `http://localhost:5173`

## Current Integration Notes

- `frontend/src/services/api.js` targets `/api/v1` and is aligned with the contract above (camelCase, paginated lists, Bearer token, ImageKit signed upload).
- The API base URL is set via `VITE_API_URL` (see `frontend/.env.example`); it defaults to `http://localhost:8000/api/v1`.
- Backend `CORS_ORIGINS` must include `http://localhost:5173` for the Vite dev server to call the API.

## Tech Stack

- Python, FastAPI, SQLModel, SQLAlchemy, PostgreSQL
- JavaScript, React, Vite, Tailwind CSS, Axios, React Router
