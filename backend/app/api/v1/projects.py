from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import ProjectModel
from db import db_dependency
from repositories import BaseRepository

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("/", response_model=list[ProjectModel])
async def get_all_projects(session=Depends(db_dependency)):
    result = BaseRepository(ProjectModel,session).get_all()
    return result