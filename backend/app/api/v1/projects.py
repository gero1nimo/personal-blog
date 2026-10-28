from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import db_dependency
from app.repositories import ProjectRepository
from app.schemas import ProjectRead, Page

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=Page[ProjectRead])
async def get_all_projects(page: int = Query(1, ge=1),
                           size: int = Query(20, ge=1, le=100),
                           session: AsyncSession = Depends(db_dependency)
                           ):
    items, total = await ProjectRepository(session).get_page(page, size)
    return Page.create(items, total, page, size)


@router.get("/{project_id}", response_model=ProjectRead)
async def get_project_by_id(project_id: int,
                            session: AsyncSession = Depends(db_dependency)
                            ):
    repo = ProjectRepository(session=session)
    result = await repo.get_by_id(project_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id: {project_id} is not found"
        )
    return result


@router.get("/slug/{project_slug}", response_model=ProjectRead)
async def get_project_by_slug(project_slug: str,
                              session: AsyncSession = Depends(db_dependency)
                              ):
    repo = ProjectRepository(session=session)
    result = await repo.get_by_slug(project_slug)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with slug: {project_slug} is not found"
        )
    return result
