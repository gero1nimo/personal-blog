from pydantic import BaseModel
from typing import Optional


class ProjectModelSchema(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    tags: list[str] = []
    techStack: list[str] = []
    status: str
    link: Optional[str] = None
    githubLink: Optional[str] = None
    liveDemo: Optional[str] = None
    featured: bool = False
