from fastapi import APIRouter, HTTPException, Query, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import db_dependency
from app.dependencies import get_current_admin
from app.repositories import ProjectRepository
from app.schemas import Page, ProjectRead, ProjectCreate, ProjectUpdate

router = APIRouter(prefix="/admin/projects", tags=["admin-projects"], dependencies=[Depends(get_current_admin)])


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
            detail=f"Admin_Project with id: {project_id} is not found"
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
            detail=f"Admin_Project with slug: {project_slug} is not found"
        )
    return result


@router.post("/", response_model=ProjectRead)
async def create_project(project_data: ProjectCreate,
                         session: AsyncSession = Depends(db_dependency)
                         ):
    repo = ProjectRepository(session)
    result = await repo.create(project_data)
    return result


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int,
                         session: AsyncSession = Depends(db_dependency)
                         ):
    repo = ProjectRepository(session)
    result = await repo.delete(project_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Admin_Project with id {project_id} is not found!"
        )
    return None


@router.put("/{project_id}", response_model=ProjectRead)
async def put_project_by_id(project_id: int,
                            project_data: ProjectCreate,
                            session: AsyncSession = Depends(db_dependency)
                            ):
    repo = ProjectRepository(session)
    result = await repo.put(project_id, project_data)
    return result


@router.put("/slug/{project_slug}", response_model=ProjectRead)
async def put_project_by_slug(project_slug: str,
                              project_data: ProjectCreate,
                              session: AsyncSession = Depends(db_dependency)
                              ):
    repo = ProjectRepository(session)
    result = await repo.put_by_slug(project_slug, project_data)
    return result


@router.patch("/{project_id}", response_model=ProjectRead)
async def patch_by_id(project_id: int,
                      project_data: ProjectUpdate,
                      session: AsyncSession = Depends(db_dependency)
                      ):
    repo = ProjectRepository(session)
    result = await repo.patch(project_id, project_data)

    return result


@router.patch("/slug/{project_slug}", response_model=ProjectRead)
async def patch_by_slug(project_slug: str,
                        project_data: ProjectUpdate,
                        session: AsyncSession = Depends(db_dependency)
                        ):
    repo = ProjectRepository(session)
    result = await repo.patch_by_slug(project_slug, project_data)

    return result
