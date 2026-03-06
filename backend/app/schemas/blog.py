from pydantic import BaseModel
from typing import Optional 
from datetime import datetime

class BlogPostSchema(BaseModel):
    id: int
    slug: str
    title: str
    content: str
    tags: list[str] = []
    published: bool = True
    views: int = 0
    created_at: datetime = datetime.now().isoformat()