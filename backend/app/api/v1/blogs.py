"""
Public Endpoint for the Blog Posts

Three endpoints:
GET / BlogPosts
GET /{blog_id} BlogPost
GET /{blog_slug} BlogPost
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import db_dependency
from app.repositories import BlogRepository
from app.schemas import BlogRead, BlogListItem, Page

router = APIRouter(prefix="/blogs", tags=["blogs"])


@router.get("/", response_model=Page[BlogListItem])
async def get_blog_posts_page(page: int = Query(1, ge=1),
                              size: int = Query(20, ge=1, le=100),
                              tag: str | None = Query(None, min_length=1, max_length=50),
                              session: AsyncSession = Depends(db_dependency)
                              ):
    items, total = await BlogRepository(session).get_published_page(page, size, tag)
    return Page.create(items, total, page, size)


@router.get("/{blog_id}", response_model=BlogRead)
async def get_blog_by_id(blog_id: int,
                         session: AsyncSession = Depends(db_dependency)
                         ):
    repo = BlogRepository(session=session)
    result = await repo.get_by_id(blog_id, published_only=True)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog with id: {blog_id} is not found"
        )
    return result


@router.get("/slug/{blog_slug}", response_model=BlogRead)
async def get_blog_by_slug(blog_slug: str,
                           session: AsyncSession = Depends(db_dependency)
                           ):
    repo = BlogRepository(session=session)
    result = await repo.get_by_slug(blog_slug, published_only=True)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog with slug: {blog_slug} is not found"
        )
    return result
