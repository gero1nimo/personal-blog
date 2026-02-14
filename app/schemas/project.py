from pydantic import BaseModel
from fastapi import FastAPI
from typing import Optional

app = FastAPI()

class ProjectModel(BaseModel):
    id: int
    name: str
    description: str
    techStack: list[str] = []
    status: str
    link: Optional[str] = None
    githubLink: Optional[str] = None
    liveDemo: Optional[str] = None
    featured: bool = False
