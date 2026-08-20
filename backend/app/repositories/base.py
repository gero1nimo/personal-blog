from fastapi import HTTPException, status
from typing import Generic, TypeVar, Type, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError


from app.models.base import BaseModel as MyBase

ModelType = TypeVar("ModelType", bound=MyBase)

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

    async def delete(self, id:int) -> ModelType:
        obj = await self.get_by_id(id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()
        
        return obj

    async def update(self, id:int, obj_in: ModelType) -> ModelType:
        obj = await self.get_by_id(id)
        if (not obj):
            result = await self.create(obj_in)
            return result

        update_data = obj_in.model_dump()
        update_data["slug"] = obj["slug"]

        for key, value in update_data.items():
            setattr(obj, key, value)

        self._commit(obj)

    async def patch(self, id: int, obj_in: ModelType) -> ModelType:
        obj = await self.get_by_id(id)
        if (not obj):
            raise HTTPException(status_code=404, detail=f"Item with id {id} not found!")

        update_data = obj_in.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(obj, key, value)

        self._commit(obj)

    async def _commit(self, obj) -> ModelType:
        try:
            await self.session.commit()
        except IntegrityError:
            await self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An unique area overlapped (probably slug)"
            )

        await self.session.refresh(obj)
        return obj