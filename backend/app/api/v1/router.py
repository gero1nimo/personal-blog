from fastapi import APIRouter

from .admin import admin_blog_router
from .blogs import router as blog_router
from .projects import router as project_router

v1_router = APIRouter(prefix="/v1")
v1_router.include_router(project_router)
v1_router.include_router(blog_router)
v1_router.include_router(admin_blog_router)
