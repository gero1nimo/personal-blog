from .base import BaseSchema, BaseDBMetadata
from typing import Optional


class ProjectBase(BaseSchema):
    
    id: int
    slug: str
    description: str
    tags: Optional[list[str]] = []
    techStack: list[str] = []
    status: str
    link: Optional[str] = None
    githubLink: Optional[str] = None
    featured: bool = False

    class Config:
        from_attributes = True

class ProjectCreate(BaseSchema):
    description: str
    tags: list[str] = []
    techStack: list[str] = []
    status: str

