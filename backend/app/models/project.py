from sqlmodel import SQLModel, Field
from typing import Optional
from sqlalchemy import Column, Integer, String, Text, Boolean, ARRAY

class ProjectModel(SQLModel, table=True):
    __tablename__ = "projects"
    
    
    id: int = Field(primary_key=True, index=True)
    name: str = Field(index=True, unique=True)
    slug: str = Field(index=True, unique=True)
    description: str
    tags: list[str] = Field(default=[], sa_column=Column(ARRAY(String)))
    techStack: list[str] = Field(default=[], sa_column=Column(ARRAY(String)))
    status: str
    link: Optional[str] = None
    githubLink: Optional[str] = None
    liveDemo: Optional[str] = None
    featured: bool = False
    