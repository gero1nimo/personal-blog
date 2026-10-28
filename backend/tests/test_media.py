import pytest
from imagekitio import ImageKitError

from app.config import settings
from app.services import media_service

AUTH_URL = "/api/v1/admin/media/auth"


def delete_url(file_id: str = "abc123") -> str:
    return f"/api/v1/admin/media/{file_id}"


# ------------------------------------------------------------ GET /admin/media/auth

async def test_auth_returns_upload_params(client):
    r = await client.get(AUTH_URL)
    assert r.status_code == 200
    body = r.json()
    assert set(body) == {"token", "expire", "signature", "publicKey", "urlEndpoint"}
    assert body["publicKey"] == settings.IMAGEKIT_PUBLIC_KEY
    assert body["urlEndpoint"] == settings.IMAGEKIT_URL_ENDPOINT
    assert isinstance(body["expire"], int)
    assert body["token"] and body["signature"]


async def test_auth_never_exposes_private_key(client):
    r = await client.get(AUTH_URL)
    assert settings.IMAGEKIT_PRIVATE_KEY.get_secret_value() not in r.text
    assert "privateKey" not in r.json()


async def test_auth_gives_fresh_token_each_time(client):
    first = (await client.get(AUTH_URL)).json()
    second = (await client.get(AUTH_URL)).json()
    assert first["token"] != second["token"]
    assert first["signature"] != second["signature"]


async def test_auth_requires_token(anon_client):
    assert (await anon_client.get(AUTH_URL)).status_code == 401


# ------------------------------------------------------- DELETE /admin/media/{file_id}

async def test_delete_returns_204_and_calls_service(client, fake_imagekit_delete):
    r = await client.delete(delete_url("file-42"))
    assert r.status_code == 204
    assert r.content == b""
    assert fake_imagekit_delete == ["file-42"]


async def test_delete_requires_token_and_does_not_call_service(anon_client, fake_imagekit_delete):
    r = await anon_client.delete(delete_url())
    assert r.status_code == 401
    assert fake_imagekit_delete == []


async def test_delete_maps_imagekit_error_to_502(client, monkeypatch):
    async def boom(file_id: str) -> None:
        raise ImageKitError("imagekit down")

    monkeypatch.setattr("app.api.v1.admin.media.delete_file", boom)
    r = await client.delete(delete_url())
    assert r.status_code == 502
    assert "imagekit down" not in r.text      # ayrıntı kullanıcıya sızmasın


# ------------------------------------------------------------------- servis katmanı

async def test_sdk_params_still_match_schema():
    """SDK sürümü yükseltilince anahtar adı/tipi değişirse burada yakalanır (ağ kullanmaz)."""
    from app.schemas.media import UploadAuth

    UploadAuth(**await media_service.get_upload_params())


async def test_service_delete_file_calls_sdk(monkeypatch):
    seen = []

    async def fake_sdk_delete(file_id):
        seen.append(file_id)

    monkeypatch.setattr(media_service.client.files, "delete", fake_sdk_delete)
    await media_service.delete_file("xyz")
    assert seen == ["xyz"]
