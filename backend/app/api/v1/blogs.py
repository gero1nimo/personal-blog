from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import BlogPost


router = APIRouter(prefix="/api/blogs", tags=["blogs"])


@router.get("/")
async def get_all_blogs():
    return [{"blog_name": "Merhaba Dünya"}]

@router.get("/{blog_id}")
async def get_blog_by_id(blog_id: int):
    return {"id":f"blog_id", "name": f"blog{blog_id}"}