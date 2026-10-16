from fastapi import HTTPException, status
from typing import Generic, TypeVar, Type, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from .base import BaseRepository
from app.models import Project
from app.utils.slug import slugify
from app.schemas import ProjectCreate


class ProjectRepository(BaseRepository[Project]):
    def __init__(self,  session):
        super().__init__(Project, session)

    async def get_by_slug(self, slug: str) -> Project | None:
        query = select(Project).where(Project.slug == slug)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def _unique_slug(self, name: str) -> str:
        base_slug = slugify(name, max_length=130)
        slug, n = base_slug, 2
        while await self.get_by_slug(slug):
            slug = f"{base_slug}-{n}"
            n += 1
        return slug

    async def create(self, obj_in: ProjectCreate) -> Project:
        data = self.model(**obj_in.model_dump())
        data.slug = await self._unique_slug(data.name)
        self.session.add(data)
        return await self._commit(data)
