from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.project import ProjectModel
from app.schemas.blog import BlogPost
from app.schemas.profile import ProfileModel
from pydantic import BaseModel

app = FastAPI()


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default profile data (in production, this would come from a database)
profile_data = {
    "id": 1,
    "name": "Mehmet Akif",
    "title": "Backend Developer & DevOps Enthusiast",
    "profile_image": None,  # URL to profile image
    "years_experience": 3,
    "projects_count": 15,
    "available_for_hire": True,
    "github_url": "https://github.com",
    "linkedin_url": "https://linkedin.com",
    "email": "mehmetayzit351@gmail.com"
}


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


@app.get("/profile/")
async def get_profile():
    return profile_data

@app.put("/profile/")
async def update_profile(profile: ProfileModel):
    global profile_data
    profile_data = profile.model_dump()
    profile_data["id"] = 1
    return profile_data

@app.get("/projects/")
async def get_projects():
    return projects_data