from .base import BaseModel
from sqlmodel import Field
from typing import Optional


class UserRole:
    USER = "user"
    ADMIN = "admin"

class User(BaseModel):
    __tablename__= "users"
    name: Optional[str]
    email: str
    password: str
    role: UserRole = Field(default=UserRole.USER)
