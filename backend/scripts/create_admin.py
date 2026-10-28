import asyncio
from getpass import getpass

from pydantic import TypeAdapter, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.db import async_session_maker, db_engine
from app.models import User
from app.repositories.user import UserRepository


async def main():
    email = TypeAdapter(EmailStr).validate_python(input("Email: ").strip().lower())
    password = getpass(prompt="Enter your password: ")
    again = getpass(prompt="Enter your password again: ")
    if len(password) < 8 or password != again:
        raise SystemExit("Password must be at least 8 characters long and passwords must match")

    async with async_session_maker() as session:
        print(f"Admin: {await create_admin(email, password, session)}")

    await db_engine.dispose()


async def create_admin(email: str,
                       password: str,
                       session: AsyncSession
                       ) -> str:
    user = await UserRepository(session).get_by_email(email)
    if user:
        user.hashed_password = hash_password(password)
        action = "updated"
    else:
        if (await session.execute(select(User).limit(1))).scalars().first():
            raise SystemExit("User already exists")

        user = User(email=email, hashed_password=hash_password(password))
        action = "created"

    session.add(user)
    await session.commit()
    return action


if __name__ == "__main__":
    asyncio.run(main())
