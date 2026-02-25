from pydantic import BaseModel
from typing import Optional 

class BlogPost(BaseModel):
    id: int
    title: str
    content: str
    tags: list[str] = []
    published: bool = True
    views: int = 0