from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User


class UserRepository:
    def __init__(self,
                 session: AsyncSession
                 ):
        self.session = session

    async def get_by_email(self,
                           email: str
                           ) -> User | None:
        query = select(User).where(User.email == email.lower())
        result = await self.session.execute(query)
        return result.scalars().first()
