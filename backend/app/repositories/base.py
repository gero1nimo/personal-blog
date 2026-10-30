from typing import Generic, TypeVar, Type, List

from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import BaseModel as MyBase
from app.utils.slug import slugify

ModelType = TypeVar("ModelType", bound=MyBase)


class BaseRepository(Generic[ModelType]):
    def __init__(self,
                 model: Type[ModelType],
                 session: AsyncSession
                 ):
        self.model = model
        self.session = session

    async def get_page(self,
                       page: int,
                       size: int
                       ) -> tuple[List[ModelType], int]:
        total = (await self.session.execute(select(func.count()).select_from(self.model))).scalar_one()
        query = (select(self.model).order_by(self.model.id.desc()).offset((page - 1) * size).limit(size))
        items = (await self.session.execute(query)).scalars().all()
        return items, total

    async def get_by_id(self,
                        id: int,
                        published_only: bool = False
                        ) -> ModelType | None:
        query = select(self.model).where(self.model.id == id)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def get_by_slug(self,
                          slug: str,
                          published_only: bool = False
                          ) -> ModelType | None:
        query = select(self.model).where(self.model.slug == slug)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def create(self,
                     obj_in: ModelType
                     ) -> ModelType:
        data = self.model(**obj_in.model_dump())
        self.session.add(data)
        await self._commit(data)
        return data

    async def delete(self,
                     id: int
                     ) -> ModelType:
        obj = await self.get_by_id(id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()

        return obj

    async def put(self,
                  id: int,
                  obj_in: ModelType
                  ) -> ModelType:
        obj = await self.get_by_id(id)
        if not obj:
            result = await self.create(obj_in)
            return result

        update_data = obj_in.model_dump()

        for key, value in update_data.items():
            setattr(obj, key, value)

        self._before_save(obj, update_data)
        await self._commit(obj)
        return obj

    async def put_by_slug(self,
                          slug: str,
                          obj_in: ModelType
                          ) -> ModelType:
        obj = await self.get_by_slug(slug)
        if not obj:
            result = await self.create(obj_in)
            return result

        update_data = obj_in.model_dump()

        for key, value in update_data.items():
            setattr(obj, key, value)

        self._before_save(obj, update_data)
        await self._commit(obj)

        return obj

    async def patch(self,
                    id: int,
                    obj_in: ModelType
                    ) -> ModelType:
        obj = await self.get_by_id(id)
        if not obj:
            raise HTTPException(status_code=404, detail=f"Item with id {id} not found!")

        update_data = obj_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)

        self._before_save(obj, update_data)
        await self._commit(obj)

        return obj

    async def patch_by_slug(self,
                            slug: str,
                            obj_in: ModelType
                            ) -> ModelType:
        obj = await self.get_by_slug(slug)
        if not obj:
            raise HTTPException(status_code=404, detail=f"Item with slug {slug} not found!")

        update_data = obj_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(obj, key, value)

        self._before_save(obj, update_data)
        await self._commit(obj)
        return obj

    async def _commit(self,
                      obj
                      ) -> ModelType:
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

    async def _unique_slug(self,
                           name: str
                           ) -> str:
        base_slug = slugify(name, max_length=130)
        slug, n = base_slug, 2
        while await self.get_by_slug(slug):
            slug = f"{base_slug}-{n}"
            n += 1
        return slug

    def _before_save(self,
                     obj: ModelType,
                     changes: dict
                     ) -> None:
        pass
