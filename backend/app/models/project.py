from sqlmodel import SQLModel, Field
from typing import Optional

class projectModel(SQLModel, table=True):
    __tablename__ = "projects"
    
    
    id: int = Field(primary_key=True, index=True)
    name: str = Field(index=True, unique=True)
    slug: str = Field(index=True, unique=True)
    description: str
    tags: list[str] = []
    techStack: list[str] = []
    status: str
    link: Optional[str] = None
    githubLink: Optional[str] = None
    liveDemo: Optional[str] = None
    featured: bool = False
    