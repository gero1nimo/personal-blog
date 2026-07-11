from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import ProjectModel
from db import db_dependency

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("/")
async def get_all_projects():
    return {"id": "1", "name": "projects1"}


@router.get("/{project_id}")
async def get_project_by_id(project_id: int):
    return {"id": f"{project_id}", "name": f"project{project_id}"}


@router.get("/{project}")
async def get_project(project:str, Session=Depends(db_dependency)):
    ...