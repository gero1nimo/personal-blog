from sqlmodel import SQLModel, Field
from datetime import datetime 
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ARRAY



class BlogPost(SQLModel, table=True):
    __tablename__ = "blog_posts"
    
    id: int = Field(primary_key=True, index=True)
    slug: str = Field(index=True, unique=True)
    title: str = Field(index=True)
    content: str    
    tags: list[str] = Field(default=[], sa_column=Column(ARRAY(String)))
    published: bool = True
    views: int = 0
    created_at: datetime = Field(default_factory=datetime.now)

        
    
