from sqlmodel import Field
from typing import Optional
from sqlalchemy import Column,JSON, Integer
from .base import BaseModel


class Project(BaseModel, table=True):
    __tablename__ = "projects"
    id: int = Field(primary_key=True, unique=True)
    name: str = Field(index=True)
    slug: str = Field(index=True, unique=True)
    description: str
    tags: list[str] = Field(default=[], sa_column=Column(JSON))
    techStack: list[str] = Field(default=[], sa_column=Column(JSON))
    status: str
    link: Optional[str] = None
    githubLink: Optional[str] = None
    liveDemo: Optional[str] = None
    featured: bool = False

