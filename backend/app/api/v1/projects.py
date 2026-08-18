from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Project
from app.db import db_dependency
from app.schemas import ProjectBase
from app.repositories import BaseRepository

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("/", response_model=list[Project])
async def get_all_projects(session=Depends(db_dependency)):
    result = await BaseRepository(Project,session).get_all()
    return result

@router.get("/{project_id}", response_model=Project)
async def get_project_by_id(project_id: int,session=Depends(db_dependency)):
    repo = BaseRepository(Project, session)
    result = await repo.get_by_id(project_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Project with id: {project_id} is not found"
        )

    return result


@router.post("/")
async def create_project(project_data: ProjectBase, session: AsyncSession= Depends(db_dependency)):
    repo = BaseRepository(Project, session)
    result = await repo.create(project_data)
    if not result:
        raise HTTPException(
            status_code=400, 
            detail="Object has not been created"
        )

    return result