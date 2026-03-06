from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.project import ProjectModelSchema
from app.schemas.blog import BlogPostSchema
from app.schemas.profile import ProfileModelSchema
from app.models import ProjectModel, BlogPost
from pydantic import BaseModel
from app.db import db_dependency
from sqlmodel import select

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
async def update_profile(profile: ProfileModelSchema):
    global profile_data
    profile_data = profile.model_dump()
    profile_data["id"] = 1
    return profile_data

@app.get("/projects/", response_model=list[ProjectModelSchema])
async def get_projects(session = Depends(db_dependency)):
    results = session.exec(select(ProjectModel)).all()
    return results

@app.post("/projects/", response_model=ProjectModelSchema)
async def create_project(project: ProjectModelSchema, session=Depends(db_dependency)):
    new_project = project.model_dump()
    db_project = ProjectModel(**new_project)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project

@app.get("/projects/{project_id}", response_model=ProjectModelSchema)
async def get_project_by_id(project_id: int, session = Depends(db_dependency)):
    project = session.exec(select(ProjectModel).where(ProjectModel.id == project_id)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.delete("/projects/{project_id}", response_model=dict)
async def delete_project_by_id(project_id: int, session=Depends(db_dependency)):
    project = session.exec(select(ProjectModel).where(ProjectModel.id==project_id)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projects is not found.")
    session.delete(project)
    session.commit()
    return {"message": f"Project with ID {project_id} has been successfully deleted."}

@app.get("/blogs/", response_model=list[BlogPostSchema])
async def get_blogs(session = Depends(db_dependency)):
    results = session.exec(select(BlogPost)).all()
    return results

@app.post("/blogs/", response_model=BlogPostSchema)
async def create_blog(blog: BlogPostSchema, session=Depends(db_dependency)):
    new_blog = blog.model_dump()
    db_blog = BlogPost(**new_blog)
    session.add(db_blog)
    session.commit()
    session.refresh(db_blog)
    return db_blog    


@app.get("/blogs/{slug}", response_model=BlogPostSchema)
async def get_blog_by_slug(slug: str, session = Depends(db_dependency)):
    blog_post = session.exec(select(BlogPost).where(BlogPost.slug == slug)).first()
    if not blog_post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog_post

@app.delete("/blogs/{slug}", response_model=dict)
async def delete_blog_by_slug(slug: str, session= Depends(db_dependency)):
    blog = session.exec(select(BlogPost).where(BlogPost.slug == slug)).first()
    if not blog: 
        raise HTTPException(status_code=404, detail="Blog is not found.")
    
    session.delete(blog)
    session.commit()
    return {"message": f"Blog with slug of {slug} has been succesfully deleted."}


