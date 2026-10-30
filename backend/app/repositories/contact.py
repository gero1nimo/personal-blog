from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreate
from .base import BaseRepository


class ContactRepository(BaseRepository[ContactMessage]):
    def __init__(self,
                 session: AsyncSession
                 ):
        super().__init__(ContactMessage, session)

    async def get_page_filtered(self,
                                page: int,
                                size: int,
                                is_read: bool | None = None
                                ) -> tuple[list[ContactMessage], int]:
        conditions = []
        if is_read is not None:
            conditions.append(ContactMessage.is_read == is_read)

        total = (await self.session.execute(
            select(func.count()).select_from(ContactMessage).where(*conditions))).scalar_one()
        query = (select(ContactMessage)
                 .where(*conditions)
                 .order_by(ContactMessage.created_at.desc())
                 .offset((page - 1) * size).limit(size))

        items = (await self.session.execute(query)).scalars().all()

        return items, total

    async def create(self,
                     obj_in: ContactCreate
                     ) -> ContactMessage:
        data = self.model(**obj_in.model_dump(exclude={"website"}))
        self.session.add(data)
        return await self._commit(data)
