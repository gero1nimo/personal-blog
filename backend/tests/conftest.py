import os

# os.environ['DATABASE_URL'] = "sqlite+aiosqlite://"
# os.environ.setdefault("JWT_SECRET", "test-secret")

TEST_DB_URL = os.environ.get("TEST_DATABASE_URL", "sqlite+aiosqlite://")
os.environ["DATABASE_URL"] = TEST_DB_URL
os.environ.setdefault("JWT_SECRET", "test-secret-test-secret-test-secret-32")
os.environ.setdefault("IMAGEKIT_PUBLIC_KEY", "test-public-key")
os.environ.setdefault("IMAGEKIT_PRIVATE_KEY", "test-private-key")
os.environ.setdefault("IMAGEKIT_URL_ENDPOINT", "https://ik.imagekit.io/test")

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine, AsyncEngine
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel

import app.models
from app.core.security import hash_password, create_access_token
from app.db import db_dependency
from app.main import app
from app.models import User

ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "test-password-123"


@pytest.fixture(autouse=True)
def fake_imagekit_delete(monkeypatch):
    """Hiçbir test gerçek ImageKit'e istek atmasın: silme çağrıları kaydedilir, ağ kullanılmaz."""
    calls: list[str] = []

    async def fake_delete(file_id: str) -> None:
        calls.append(file_id)

    monkeypatch.setattr("app.api.v1.admin.media.delete_file", fake_delete)
    return calls


@pytest_asyncio.fixture
async def engine() -> AsyncEngine:
    if TEST_DB_URL.startswith("sqlite"):
        engine = create_async_engine(
            TEST_DB_URL,
            poolclass=StaticPool,
            connect_args={"check_same_thread": False},
        )
    else:
        engine = create_async_engine(TEST_DB_URL)

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def admin_user(engine) -> User:
    """Test veritabanında tek admin kullanıcı (e-posta/şifre: ADMIN_EMAIL / ADMIN_PASSWORD)."""
    session_maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async with session_maker() as session:
        user = User(email=ADMIN_EMAIL, hashed_password=hash_password(ADMIN_PASSWORD))
        session.add(user)
        await session.commit()
        await session.refresh(user)
    return user


def _override_db(engine):
    session_maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async def override_db():
        async with session_maker() as session:
            yield session

    app.dependency_overrides[db_dependency] = override_db


@pytest_asyncio.fixture
async def anon_client(engine) -> AsyncClient:
    """Giriş yapmamış istemci (Authorization başlığı yok)."""
    _override_db(engine)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def client(engine,
                 admin_user
                 ) -> AsyncClient:
    """Giriş yapmış admin istemcisi: her isteğe geçerli Bearer token eklenir."""
    _override_db(engine)
    token = create_access_token(admin_user.email)
    async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
            headers={"Authorization": f"Bearer {token}"},
    ) as client:
        yield client
    app.dependency_overrides.clear()
