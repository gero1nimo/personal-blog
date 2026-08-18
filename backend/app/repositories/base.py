from fastapi import HTTPException
from typing import Generic, TypeVar, Type, List
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

    async def get_by_id(self, id: int) -> ModelType:
        query = select(self.model).where(self.model.id == id)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def create(self, obj_in: ModelType) -> ModelType:
        data = self.model(**obj_in.model_dump())
        self.session.add(data)
        await self.session.commit()
        await self.session.refresh(data)
        return data

    async def get_by_slug(self, slug: str) -> ModelType:
        query = select(self.model).where(self.model.slug == slug)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def delete(self, id:int) -> None:
        obj = await self.get_by_id(id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()

    async def update(self, id:int, obj_in: ModelType) -> ModelType:
        obj = await self.get_by_id(id)
        if (not obj):
            raise HTTPException(status_code=404, detail=f"Item with id {id} not found!")

        update_data = obj_in.model_dump()

        for key, value in update_data.items():
            setattr(obj, key, value)

        await self.session.commit()
        await self.session.refresh(obj)

        return obj