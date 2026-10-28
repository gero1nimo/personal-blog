from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db import db_dependency
from app.models import User
from app.repositories.user import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_admin(token: str = Depends(oauth2_scheme),
                            session: AsyncSession = Depends(db_dependency)
                            ) -> User:
    email = decode_access_token(token)
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Unauthorized",
                                          headers={"WWW-Authenticate": "Bearer"})
    if email is None:
        raise credentials_exception

    user = await UserRepository(session).get_by_email(email)
    if user is None:
        raise credentials_exception

    return user
