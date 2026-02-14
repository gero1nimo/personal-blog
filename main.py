from fastapi import FastAPI
from app.schemas.project import ProjectModel
from pydantic import BaseModel

class Urun(BaseModel):
    ad: str
    fiyat: float
    stok: bool = True
    
app = FastAPI()

fake_db = [
    {
        "id": 1,
        "name": "Sample Project",
        "description": "This is a sample project.",
        "techStack": ["FastAPI", "SQLModel"],
        "status": "In Progress",
        "link": "https://example.com",
        "githubLink": ""},
    {
        "id": 1,
        "name": "Sample Project",
        "description": "This is a sample project.",
        "techStack": ["FastAPI", "SQLModel"],
        "status": "In Progress",
        "link": "https://example.com",
        "githubLink": ""},
    {
        "id": 1,
        "name": "Sample Project",
        "description": "This is a sample project.",
        "techStack": ["FastAPI", "SQLModel"],
        "status": "In Progress",
        "link": "https://example.com",
        "githubLink": ""},
    {
        "id": 1,
        "name": "Sample Project",
        "description": "This is a sample project.",
        "techStack": ["FastAPI", "SQLModel"],
        "status": "In Progress",
        "link": "https://example.com",
        "githubLink": ""}]


@app.get("/")
async def root():
    return {"message": "Hello, World!"}

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}


@app.post("/projects/")
async def create_project(project: ProjectModel):
    project_dict = project.model_dump()
    if project.id:
        project_dict["id"] = 1
        
    return project_dict 

@app.get("/projects/")
async def read_projects(skip: int = 0, limit: int = 10):
    return fake_db[skip: skip + limit]

@app.get("/projects/{project_id}")
async def read_project(project_id: int):
    if project_id == 1:
        return {
            "id": 1,
            "name": "Sample Project",
            "description": "This is a sample project.",
            "techStack": ["FastAPI", "SQLModel"],
            "status": "In Progress",
            "link": "https://example.com",
            "githubLink": ""}
    else: 
        return {"error": "Project not found"}


@app.get("/urunler/{urun_id}")
async def read_urun(urun_id: int):
    return {"urun_id": urun_id}

@app.post("/urunler/")
async def create_urun(urun: Urun):
    return {"mesaj": f"Ürün '{urun.ad}' başarıyla oluşturuldu.", "fiyat": urun.fiyat, "stok": urun.stok}

@app.get("/ara")
async def ara(kelime: str, limit: int = 10):
    return {"kelime": kelime, "limit": limit}