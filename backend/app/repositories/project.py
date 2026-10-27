from sqlalchemy import select
from .base import BaseRepository
from app.models import Project
from app.schemas import ProjectCreate


class ProjectRepository(BaseRepository[Project]):
    def __init__(self,  session):
        super().__init__(Project, session)

    async def get_by_slug(self, slug: str) -> Project | None:
        query = select(Project).where(Project.slug == slug)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def create(self, obj_in: ProjectCreate) -> Project:
        data = self.model(**obj_in.model_dump())
        data.slug = await self._unique_slug(data.name)
        self.session.add(data)
        return await self._commit(data)
