from fastapi import APIRouter
from .projects import router

v1_router = APIRouter(prefix="/v1")
v1_router.include_router(router)
