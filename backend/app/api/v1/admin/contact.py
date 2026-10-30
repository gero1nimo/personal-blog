from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import db_dependency
from app.dependencies import get_current_admin
from app.repositories import ContactRepository
from app.schemas import Page, ContactRead, ContactUpdate

router = APIRouter(prefix="/admin/contact", tags=["admin-contact"], dependencies=[Depends(get_current_admin)])


@router.get("/", response_model=Page[ContactRead])
async def get_all_contacts(page: int = Query(1, ge=1),
                           size: int = Query(20, ge=1, le=100),
                           is_read: bool | None = Query(None),
                           session: AsyncSession = Depends(db_dependency)
                           ):
    repo = ContactRepository(session)
    items, total = await repo.get_page_filtered(page, size, is_read)
    return Page.create(items, total, page, size)


@router.get("/{contact_id}", response_model=ContactRead)
async def get_contact(contact_id: int,
                      session: AsyncSession = Depends(db_dependency)
                      ):
    repo = ContactRepository(session)
    result = await repo.get_by_id(contact_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Contact not found")
    return result


@router.patch("/{contact_id}", response_model=ContactRead)
async def update_contact(contact_id: int,
                         obj_update: ContactUpdate,
                         session: AsyncSession = Depends(db_dependency)
                         ):
    repo = ContactRepository(session)
    result = await repo.patch(contact_id, obj_update)
    return result


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(contact_id: int,
                         session: AsyncSession = Depends(db_dependency)
                         ):
    repo = ContactRepository(session)
    result = await repo.delete(contact_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return None
