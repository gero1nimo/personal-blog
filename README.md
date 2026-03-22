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

Base URL: `http://localhost:8000`

- `GET /` -> health/welcome response
- `GET /profile/` -> read profile data
- `PUT /profile/` -> update profile
- `GET /projects/` -> list projects
- `POST /projects/` -> create project
- `GET /projects/{project_id}` -> get project by id
- `DELETE /projects/{project_id}` -> delete project by id
- `GET /blogs/` -> list blog posts
- `POST /blogs/` -> create blog post
- `GET /blogs/{slug}` -> get blog post by slug
- `DELETE /blogs/{slug}` -> delete blog post by slug

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

- `frontend/src/services/api.js` uses `/blogposts/` endpoints, but backend currently defines `/blogs/` endpoints.
- Backend uses SQLModel with a PostgreSQL Psycopg driver in `backend/app/db.py`; if runtime import errors occur, ensure required packages such as `sqlmodel` and `psycopg` are installed in the backend environment.

## Tech Stack

- Python, FastAPI, SQLModel, SQLAlchemy, PostgreSQL
- JavaScript, React, Vite, Tailwind CSS, Axios, React Router
