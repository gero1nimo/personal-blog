from typing import Generic, TypeVar, Type
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import BaseModel

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def get_all(self, offset: int = 0, limit: int= 1000) -> List[ModelType]:
        query = select(self.model).offset(offset).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()
