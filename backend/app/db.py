from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from  .config import settings
from typing import AsyncGenerator


db_engine = create_async_engine(settings.DATABASE_URL)

async_session_maker = async_sessionmaker(
    db_engine, class_=AsyncSession, expire_on_commit=False
)

async def db_dependency() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise