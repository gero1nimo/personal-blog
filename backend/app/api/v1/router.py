from fastapi import APIRouter

from .admin import admin_blog_router, admin_project_router, admin_media_router, admin_contact_router
from .auth import router as auth_router
from .blogs import router as blog_router
from .contact import router as contact_router
from .projects import router as project_router

v1_router = APIRouter(prefix="/v1")
v1_router.include_router(project_router)
v1_router.include_router(blog_router)
v1_router.include_router(admin_blog_router)
v1_router.include_router(admin_project_router)
v1_router.include_router(admin_media_router)
v1_router.include_router(auth_router)
v1_router.include_router(contact_router)
v1_router.include_router(admin_contact_router)
