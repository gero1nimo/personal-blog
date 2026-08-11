from fastapi import Depends, FastAPI, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import projects
from app.db import init_db, db_engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await db_engine.dispose()

app = FastAPI(lifespan=lifespan)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello, World!"}


app.include_router(projects.router)