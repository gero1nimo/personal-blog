from typing import Optional

from sqlmodel import Field

from .base import BaseModel


class User(BaseModel, table=True):
    __tablename__ = "users"
    name: Optional[str] = Field(default=None, max_length=100)
    email: str = Field(unique=True, max_length=100, index=True)
    hashed_password: str
