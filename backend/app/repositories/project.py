from fastapi import HTTPException, status
from typing import Generic, TypeVar, Type, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from .base import BaseRepository
from app.models import Project


class ProjectRepository(BaseRepository[Project]):
    def __init__(self,  session):
        super().__init__(Project, session)

    async def get_by_slug(self, slug: str) -> Project | None:
        query = select(Project).where(Project.slug == slug)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def get_by_id(self, id):
        query = select(Project).where(Project.id == id)
        result = await self.session.execute(query)
        return result