from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.rate_limit import limiter
from app.db import db_dependency
from app.repositories import ContactRepository
from app.schemas import ContactCreate

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
@limiter.limit("30/hour")
async def create_contact(request: Request,
                         obj_in: ContactCreate,
                         session: AsyncSession = Depends(db_dependency)
                         ):
    if obj_in.website:
        return {"ok": True}

    repo = ContactRepository(session)
    await repo.create(obj_in)
    return {"ok": True}
