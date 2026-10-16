from .base import APIModel, ReadModel
from typing import Optional, Literal
from pydantic import Field

ProjectStatus = Literal["planned", "in-progress", "completed", "archived"]


class ProjectBase(APIModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1)
    status: ProjectStatus
    tags: list[str] = Field(default_factory=list)
    tech_stack: list[str] = Field(default_factory=list)
    link: Optional[str] = Field(default=None, max_length=2048)
    github_link: Optional[str] = Field(default=None, max_length=2048)
    featured: bool = False



class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(APIModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, min_length=1)
    status: Optional[ProjectStatus] = None
    tags: Optional[list[str]] = None
    tech_stack: Optional[list[str]] = None
    link: Optional[str] = Field(default=None, max_length=2048)
    github_link: Optional[str] = Field(default=None, max_length=2048)
    featured: Optional[bool] = None

class ProjectRead(ProjectBase, ReadModel):
    slug: Optional[str] = Field(default=None, max_length=2048)