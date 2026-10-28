from fastapi import APIRouter, Depends, HTTPException, status
from imagekitio import ImageKitError

from app.dependencies import get_current_admin
from app.schemas.media import UploadAuth
from app.services.media_service import get_upload_params, delete_file

router = APIRouter(prefix="/admin/media", tags=["admin-media"], dependencies=[Depends(get_current_admin)])


@router.get("/auth", response_model=UploadAuth)
async def auth() -> UploadAuth:
    return UploadAuth(**await get_upload_params())


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_file(file_id: str) -> None:
    try:
        await delete_file(file_id)
    except ImageKitError:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Media Service Error")
