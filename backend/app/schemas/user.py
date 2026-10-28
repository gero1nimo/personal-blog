from typing import Optional

from pydantic import BaseModel

from .base import ReadModel


class UserRead(ReadModel):
    name: Optional[str] = None
    email: str


class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'
