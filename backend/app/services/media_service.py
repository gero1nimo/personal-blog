from imagekitio import AsyncImageKit

from app.config import settings

client = AsyncImageKit(
    private_key=settings.IMAGEKIT_PRIVATE_KEY.get_secret_value()
)


async def get_upload_params() -> dict:
    params = await client.helper.get_authentication_parameters()
    return params | {"public_key": settings.IMAGEKIT_PUBLIC_KEY,
                     "url_endpoint": settings.IMAGEKIT_URL_ENDPOINT}


async def delete_file(file_id: str) -> None:
    await client.files.delete(file_id)
