from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import ProjectModel
from app.db import db_dependency
from app.repositories import BaseRepository

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("/", response_model=list[ProjectModel])
async def get_all_projects(session=Depends(db_dependency)):
    result = await BaseRepository(ProjectModel,session).get_all()
    return result

@router.get("/{project_id}", response_model=ProjectModel)
async def get_project_by_id(project_id: int,session=Depends(db_dependency)):
    repo = BaseRepository(ProjectModel, session)
    result = await repo.get_by_id(project_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Project with id: {project_id} is not found"
        )

    return result


@router.post("/")
async def create_project(project_data: ProjectModel, session= Depends(db_dependency)):
    repo = BaseRepository(ProjectModel, session)
    project = project_data.model_dump()
    result = repo.create(project)
    if not result:
        return f"Object {result} has not been created"

    return result