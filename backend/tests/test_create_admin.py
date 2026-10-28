import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.security import verify_password
from app.models import User
from app.repositories import UserRepository
from scripts.create_admin import create_admin


@pytest.fixture
def session_maker(engine):
    return async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def test_creates_first_admin(session_maker):
    async with session_maker() as session:
        assert await create_admin("a@example.com", "ilk-sifre-123", session) == "created"
    async with session_maker() as session:
        user = await UserRepository(session).get_by_email("a@example.com")
        assert user is not None
        assert user.hashed_password != "ilk-sifre-123"     # düz şifre saklanmaz
        assert verify_password("ilk-sifre-123", user.hashed_password)


async def test_existing_admin_gets_password_reset(session_maker):
    async with session_maker() as session:
        await create_admin("a@example.com", "ilk-sifre-123", session)
    async with session_maker() as session:
        assert await create_admin("a@example.com", "yeni-sifre-456", session) == "updated"
    async with session_maker() as session:
        user = await UserRepository(session).get_by_email("a@example.com")
        assert verify_password("yeni-sifre-456", user.hashed_password)
        assert not verify_password("ilk-sifre-123", user.hashed_password)


async def test_second_user_is_rejected(session_maker):
    async with session_maker() as session:
        await create_admin("a@example.com", "ilk-sifre-123", session)
    async with session_maker() as session:
        with pytest.raises(SystemExit):
            await create_admin("b@example.com", "baska-sifre-789", session)
    async with session_maker() as session:
        users = (await session.execute(select(User))).scalars().all()
        assert len(users) == 1
