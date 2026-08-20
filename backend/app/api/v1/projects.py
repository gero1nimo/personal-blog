from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Project
from app.db import db_dependency
from app.schemas import  ProjectUpdate, ProjectCreate, ProjectRead
from app.repositories import BaseRepository, ProjectRepository

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("/", response_model=list[ProjectRead])
async def get_all_projects(offset:int = 0, limit: int= 1000 , session=Depends(db_dependency)):
    result = await BaseRepository(Project,session).get_all(offset, limit)
    return result

@router.get("/{project_id}", response_model=ProjectRead)
async def get_project_by_id(project_id: int, session=Depends(db_dependency)):
    repo = ProjectRepository(session=session)
    result = await repo.get_by_id(project_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id: {project_id} is not found"
        )

    return result


@router.post("/")
async def create_project(project_data: ProjectCreate, session: AsyncSession= Depends(db_dependency)):
    repo = BaseRepository(Project, session)
    result = await repo.create(project_data)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Object has not been created"
        )

    return result

@router.delete("/{project_id}")
async def delete_project(project_id: int, session: AsyncSession=Depends(db_dependency)):
    repo = BaseRepository(Project, session)

    result = await repo.delete(project_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} is not found!"
        )
    return None
    
@router.put("/{project_slug}")
async def update_project(project_id: int, project_data: ProjectUpdate, session: AsyncSession = Depends(db_dependency)):
    repo = BaseRepository(Project, session)

    result = await repo.update(project_id, project_data)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} is not found."
        )
    return result
        

@router.patch("/{project_id}")
async def patch_project(project_id: int, project_data: ProjectUpdate, session: AsyncSession = Depends(db_dependency)):
    repo = BaseRepository(Project, session)
    result = await repo.patch(project_id, project_data)
    if not result: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} is not found."
        )
    
    return result