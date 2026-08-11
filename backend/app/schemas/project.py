from .base import BaseSchema, BaseDBMetadata
from typing import Optional


class ProjectBase(BaseSchema):
    slug: str
    description: str
    tags: list[str] = []
    techStack: list[str] = []
    status: str
    link: Optional[str] = None
    githubLink: Optional[str] = None
    liveDemo: Optional[str] = None
    featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class ProjectRead(ProjectBase, BaseDBMetadata):
    pass