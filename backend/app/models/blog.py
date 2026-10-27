from sqlmodel import Field
from typing import Optional
from sqlalchemy import Column,JSON, Text
from .base import BaseModel


class Blog(BaseModel, table=True):
    __tablename__ = "blogs"
    title: str = Field(index=True)
    slug: str = Field(index=True, unique=True)
    summary: str
    content: str = Field(sa_column=Column(Text, nullable=False))
    cover_img_url: Optional[str] = None
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    is_published: bool = Field(default=False, index=True)
    reading_time: int = Field(default=1)
    featured: bool = False

