import os

os.environ['DATABASE_URL'] = "sqlite+aiosqlite://"
os.environ.setdefault("JWT_SECRET", "test-secret")

import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel

import app.models
from app.db import db_dependency
from app.main import app


@pytest_asyncio.fixture
async def engine() -> AsyncEngine:
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        poolclass=StaticPool,
        connect_args={"check_same_thread": False},
    )

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield engine
    await engine.dispose()

@pytest_asyncio.fixture
async def client(engine) -> AsyncClient:
    session_maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async def override_db():
        async with session_maker() as session:
            yield session

    app.dependency_overrides[db_dependency] = override_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

    app.dependency_overrides.clear()

