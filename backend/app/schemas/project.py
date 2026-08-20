from .base import BaseSchema, BaseDBMetadata
from typing import Optional


class ProjectBase(BaseSchema):
    name: str
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

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseSchema):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[list[str]] = None
    techStack: list[str] = None
    status: str = None
    link: Optional[str] = None 
    githubLink: Optional[str] = None
    featured: bool = None

class ProjectRead(ProjectBase, BaseSchema):
    id: int
    