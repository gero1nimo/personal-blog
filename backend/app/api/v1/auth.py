from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import verify_password, hash_password, create_access_token
from app.db import db_dependency
from app.dependencies import get_current_admin
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas import Token
from app.schemas.user import UserRead

router = APIRouter(prefix="/auth", tags=["auth"])

DUMMY_HASH = hash_password("dummy-password")


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(),
                session: AsyncSession = Depends(db_dependency)
                ) -> Token:
    user = await UserRepository(session).get_by_email(form_data.username)
    hashed_password = user.hashed_password if user else DUMMY_HASH
    password_check = verify_password(form_data.password, hashed_password)
    if not password_check or not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})

    return Token(access_token=create_access_token(user.email))


@router.get("/me", response_model=UserRead)
async def me(user: User = Depends(get_current_admin)):
    return user
