from sqlmodel import Field
from typing import Optional
from sqlalchemy import Column,JSON, Integer
from .base import BaseModel


class Project(BaseModel, table=True):
    __tablename__ = "projects"
    name: str = Field(index=True)
    slug: str = Field(index=True, unique=True)
    description: str
    tags: list[str] = Field(default=[], sa_column=Column(JSON))
    tech_stack: list[str] = Field(default=[], sa_column=Column(JSON)) 
    status: str 
    link: Optional[str] = None
    github_link: Optional[str] = None
    featured: bool = False

