from fastapi import FastAPI, HTTPException
from app.schemas.project import ProjectModel
from app.schemas.blog import BlogPost
from pydantic import BaseModel

    
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

@app.post("/blogposts/")
async def create_blog_post(blog_post: BlogPost):
    blog_post_dict = blog_post.model_dump()
    if blog_post.id:
        blog_post_dict["id"] = 1
        
    return blog_post_dict

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

fake_db = [
    {"urun_id": 1, "ad": "Laptop", "fiyat": 999.99, "stok": True}, 
    {"urun_id": 2, "ad": "Telefon", "fiyat": 499.99, "stok": True}, 
    {"urun_id": 3, "ad": "Tablet", "fiyat": 299.99, "stok": False}, 
    {"urun_id": 4, "ad": "Kulaklık", "fiyat": 199.99, "stok": True}
]


@app.get("/ara")
async def ara(kelime: str, limit: int = 10):
    return {"kelime": kelime, "limit": limit}

class Makale(BaseModel):
    baslik: str
    icerik: str


@app.put("/makaleler/{makale_id}")
async def makale_guncelle(makale_id: int, makale: Makale, yayinla: bool = False):
    return {"mesaj": "Makale başarıyla güncellendi", "hedef_id": makale_id, "veri": makale, "hemen_yayinla": yayinla}