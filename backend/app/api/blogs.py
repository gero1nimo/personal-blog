from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import BlogPost


router = APIRouter(prefix="/api/blogs", tags=["blogs"])


@router.get("/")
async def get_all_blogs():
    return [{"blog_name": "Merhaba Dünya"}]