from sqlmodel import SQLModel, Field
from datetime import datetime 



class BlogPost(SQLModel, table=True):
    __tablename__ = "blog_posts"
    
    id: int
    slug: str = Field(index=True, unique=True)
    title: str = Field(index=True)
    content: str
    tags: list[str] = []
    published: bool = True
    views: int = 0
    created_at: datetime = Field(default_factory=datetime.now())

        
    
