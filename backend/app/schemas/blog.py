from typing import Optional

from pydantic import Field

from .base import APIModel, ReadModel


class BlogBase(APIModel):
    title: str = Field(min_length=1, max_length=120)
    summary: str = Field(min_length=1)
    content: str = Field(min_length=1)
    cover_img_url: Optional[str] = Field(default=None, max_length=2048)
    tags: list[str] = Field(default_factory=list)
    is_published: bool = Field(default=False)
    featured: bool = False


class BlogCreate(BlogBase):
    pass


class BlogUpdate(APIModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    summary: Optional[str] = Field(default=None, min_length=1)
    content: Optional[str] = Field(default=None, min_length=1)
    cover_img_url: Optional[str] = Field(default=None, max_length=2048)
    tags: Optional[list[str]] = None
    is_published: Optional[bool] = None
    featured: Optional[bool] = None


class BlogRead(BlogBase, ReadModel):
    slug: Optional[str] = Field(default=None, max_length=2048)
    reading_time: int


class BlogListItem(ReadModel):
    title: str
    slug: str
    summary: str
    cover_img_url: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    featured: bool
    reading_time: int
