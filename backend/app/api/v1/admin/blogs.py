from fastapi import APIRouter, Query, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import db_dependency
from app.dependencies import get_current_admin
from app.repositories import BlogRepository
from app.schemas import BlogRead, Page, BlogCreate, BlogUpdate

router = APIRouter(prefix="/admin/blogs", tags=["admin-blogs"], dependencies=[Depends(get_current_admin)])


# GET / Page

@router.get("/", response_model=Page[BlogRead])
async def get_all_blogs(page: int = Query(1, ge=1),
                        size: int = Query(20, ge=1, le=100),
                        session: AsyncSession = Depends(db_dependency)
                        ):
    repo = BlogRepository(session)
    items, total = await repo.get_page(page, size)
    return Page.create(items, total, page, size)


# GET /blog_id
@router.get("/{blog_id}", response_model=BlogRead)
async def get_blog_by_id(blog_id: int,
                         session: AsyncSession = Depends(db_dependency)
                         ):
    repo = BlogRepository(session)
    result = await repo.get_by_id(blog_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Blog with id {blog_id} Not Found")

    return result


# GET /slug/blog_slug
@router.get("/slug/{blog_slug}", response_model=BlogRead)
async def get_blog_by_slug(blog_slug: str,
                           session: AsyncSession = Depends(db_dependency)
                           ):
    repo = BlogRepository(session)
    result = await repo.get_by_slug(blog_slug)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Blog with slug {blog_slug} Not Found")

    return result


# Create Blog Post
@router.post("/", response_model=BlogRead)
async def create_blog(blog_data: BlogCreate,
                      session: AsyncSession = Depends(db_dependency)
                      ):
    repo = BlogRepository(session)
    result = await repo.create(blog_data)
    if not result:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Internal Server Error. Object could not be created")

    return result


# Delete Blog Post
@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(blog_id: int,
                      session: AsyncSession = Depends(db_dependency)
                      ):
    repo = BlogRepository(session)
    result = await repo.delete(blog_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return None


# PATCH & PUT endpoints using id
@router.patch("/{blog_id}", response_model=BlogRead)
async def patch_blog_by_id(blog_id: int,
                           blog_data: BlogUpdate,
                           session: AsyncSession = Depends(db_dependency)
                           ):
    repo = BlogRepository(session)
    result = await repo.patch(blog_id, blog_data)
    return result


@router.put("/{blog_id}", response_model=BlogRead)
async def put_blog_by_id(blog_id: int,
                         blog_data: BlogCreate,
                         session: AsyncSession = Depends(db_dependency)
                         ):
    repo = BlogRepository(session)
    result = await repo.put(blog_id, blog_data)
    return result


# PATCH & PUT endpoints using slug
@router.patch("/slug/{blog_slug}", response_model=BlogRead)
async def patch_blog_by_slug(blog_slug: str,
                             blog_data: BlogUpdate,
                             session: AsyncSession = Depends(db_dependency)
                             ):
    repo = BlogRepository(session)
    result = await repo.patch_by_slug(blog_slug, blog_data)
    return result


@router.put("/slug/{blog_slug}", response_model=BlogRead)
async def put_blog_by_slug(blog_slug: str,
                           blog_data: BlogCreate,
                           session: AsyncSession = Depends(db_dependency)
                           ):
    repo = BlogRepository(session)
    result = await repo.put_by_slug(blog_slug, blog_data)
    return result
