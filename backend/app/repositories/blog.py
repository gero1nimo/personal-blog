from typing import List, override

from sqlalchemy import select, func, cast, String

from app.models import Blog
from app.schemas import BlogCreate
from app.utils.reading_time import reading_time_calculator
from .base import BaseRepository


class BlogRepository(BaseRepository[Blog]):
    def __init__(self,
                 session
                 ):
        super().__init__(Blog, session)

    def _before_save(self,
                     obj: Blog,
                     changes: dict
                     ) -> None:
        if "content" in changes:
            obj.reading_time = reading_time_calculator(obj.content)

    async def create(self,
                     obj_in: BlogCreate
                     ) -> Blog:
        data = self.model(**obj_in.model_dump())
        data.slug = await self._unique_slug(data.title)
        data.reading_time = reading_time_calculator(data.content)
        self.session.add(data)
        return await self._commit(data)

    @override
    async def get_by_slug(self,
                          slug: str,
                          published_only: bool = False
                          ) -> Blog | None:
        query = select(Blog).where(Blog.slug == slug)
        if published_only:
            query = query.where(Blog.is_published == True)

        result = await self.session.execute(query)
        return result.scalars().first()

    async def get_by_id(self,
                        id: int,
                        published_only: bool = False
                        ) -> Blog | None:
        query = select(Blog).where(Blog.id == id)
        if published_only:
            query = query.where(Blog.is_published == True)

        result = await self.session.execute(query)
        return result.scalars().first()

    async def get_published_page(self,
                                 page: int,
                                 size: int,
                                 tag: str | None = None
                                 ) -> tuple[List[Blog], int]:
        conditions = [Blog.is_published == True]
        if tag is not None:
            conditions.append(cast(Blog.tags, String).like(f'%"{tag}"%'))

        total = (await self.session.execute(select(func.count()).select_from(Blog).where(*conditions))).scalar_one()
        query = (select(Blog)
                 .where(*conditions)
                 .order_by(Blog.created_at.desc())
                 .offset((page - 1) * size).limit(size))
        items = (await self.session.execute(query)).scalars().all()
        return items, total
