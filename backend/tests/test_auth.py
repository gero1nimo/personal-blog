from datetime import timedelta

import jwt
import pytest

from app.config import settings
from app.core.security import create_access_token
from app.main import app
from app.models.base import utcnow
from tests.conftest import ADMIN_EMAIL, ADMIN_PASSWORD

LOGIN_URL = "/api/v1/auth/login"
ME_URL = "/api/v1/auth/me"
SECRET = settings.JWT_SECRET.get_secret_value()


def bearer(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


async def login(client, username=ADMIN_EMAIL, password=ADMIN_PASSWORD):
    # OAuth2 formu: JSON değil, form verisi (data=)
    return await client.post(LOGIN_URL, data={"username": username, "password": password})


# ------------------------------------------------------------------- login

async def test_login_success_returns_token(anon_client, admin_user):
    r = await login(anon_client)
    assert r.status_code == 200
    body = r.json()
    assert set(body) == {"access_token", "token_type"}   # snake_case: Swagger/OAuth2 böyle bekler
    assert body["token_type"] == "bearer"
    payload = jwt.decode(body["access_token"], SECRET, algorithms=[settings.JWT_ALGORITHM])
    assert payload["sub"] == ADMIN_EMAIL


async def test_login_email_is_case_insensitive(anon_client, admin_user):
    r = await login(anon_client, username=ADMIN_EMAIL.upper())
    assert r.status_code == 200


async def test_login_wrong_password_401(anon_client, admin_user):
    r = await login(anon_client, password="yanlis-sifre")
    assert r.status_code == 401
    assert r.headers["www-authenticate"] == "Bearer"


async def test_login_unknown_email_gives_same_error_as_wrong_password(anon_client, admin_user):
    wrong_pw = await login(anon_client, password="yanlis-sifre")
    unknown = await login(anon_client, username="yok@example.com")
    assert unknown.status_code == 401
    assert unknown.json() == wrong_pw.json()      # hangisinin yanlış olduğu sızmasın


async def test_login_requires_form_data_not_json(anon_client, admin_user):
    r = await anon_client.post(LOGIN_URL, json={"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 422


async def test_login_missing_fields_422(anon_client):
    assert (await anon_client.post(LOGIN_URL, data={"username": ADMIN_EMAIL})).status_code == 422


# ---------------------------------------------------------------------- me

async def test_me_returns_current_user_without_password(anon_client, admin_user):
    token = (await login(anon_client)).json()["access_token"]
    r = await anon_client.get(ME_URL, headers=bearer(token))
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == ADMIN_EMAIL
    assert body["id"] == admin_user.id
    assert "hashedPassword" not in body and "hashed_password" not in body
    assert "password" not in str(body).lower()


async def test_me_without_token_401(anon_client):
    r = await anon_client.get(ME_URL)
    assert r.status_code == 401


async def test_me_with_garbage_token_401(anon_client):
    r = await anon_client.get(ME_URL, headers=bearer("bu-bir-token-degil"))
    assert r.status_code == 401
    assert r.headers["www-authenticate"] == "Bearer"


async def test_me_with_wrong_scheme_401(anon_client, admin_user):
    token = create_access_token(ADMIN_EMAIL)
    r = await anon_client.get(ME_URL, headers={"Authorization": f"Basic {token}"})
    assert r.status_code == 401


async def test_me_with_expired_token_401(anon_client, admin_user):
    expired = jwt.encode(
        {"sub": ADMIN_EMAIL, "exp": utcnow() - timedelta(minutes=1)},
        SECRET, algorithm=settings.JWT_ALGORITHM,
    )
    assert (await anon_client.get(ME_URL, headers=bearer(expired))).status_code == 401


async def test_me_with_token_signed_by_wrong_key_401(anon_client, admin_user):
    forged = jwt.encode(
        {"sub": ADMIN_EMAIL, "exp": utcnow() + timedelta(minutes=5)},
        "baska-bir-gizli-anahtar-baska-bir-gizli-anahtar", algorithm=settings.JWT_ALGORITHM,
    )
    assert (await anon_client.get(ME_URL, headers=bearer(forged))).status_code == 401


async def test_me_with_token_of_nonexistent_user_401(anon_client, admin_user):
    ghost = create_access_token("silinmis@example.com")
    assert (await anon_client.get(ME_URL, headers=bearer(ghost))).status_code == 401


# ------------------------------------------------- tüm admin rotaları korumalı

def _admin_operations():
    ops = []
    for path, methods in app.openapi()["paths"].items():
        if "/admin/" in path:
            for method in methods:
                url = (path.replace("{project_id}", "1").replace("{blog_id}", "1")
                       .replace("{project_slug}", "x").replace("{blog_slug}", "x")
                       .replace("{file_id}", "abc123").replace("{contact_id}", "1"))
                ops.append((method.upper(), url))
    return ops


def test_admin_operations_are_discovered():
    # taramanın boş geçip yanıltmaması için: blog + project, id + slug, tüm yöntemler
    assert len(_admin_operations()) == 24   # blog 9 + project 9 + media 2 + contact 4


@pytest.mark.parametrize("method,url", _admin_operations())
async def test_every_admin_route_requires_token(anon_client, method, url):
    body = {"title": "t", "summary": "s", "content": "c", "name": "n", "description": "d", "status": "planned"}
    r = await anon_client.request(method, url, json=body if method in ("POST", "PUT", "PATCH") else None)
    assert r.status_code == 401, f"{method} {url} korumasız!"


@pytest.mark.parametrize("method,url", _admin_operations())
async def test_every_admin_route_accepts_valid_token(client, method, url):
    r = await client.request(method, url, json={"title": "t", "summary": "s", "content": "c",
                                                 "name": "n", "description": "d", "status": "planned"}
                             if method in ("POST", "PUT", "PATCH") else None)
    assert r.status_code != 401


# --------------------------------------------------------- public rotalar açık

@pytest.mark.parametrize("url", ["/api/v1/blogs/", "/api/v1/projects/", "/api/v1/blogs/1",
                                 "/api/v1/projects/1", "/api/v1/blogs/slug/x", "/api/v1/projects/slug/x"])
async def test_public_routes_need_no_token(anon_client, url):
    r = await anon_client.get(url)
    assert r.status_code in (200, 404)     # 401 olmamalı


async def test_public_routes_have_no_write_methods(anon_client):
    assert (await anon_client.post("/api/v1/blogs/", json={})).status_code == 405
    assert (await anon_client.delete("/api/v1/projects/1")).status_code == 405
