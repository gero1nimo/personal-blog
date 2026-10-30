from pydantic import Field, EmailStr

from .base import APIModel, ReadModel


class ContactCreate(APIModel):
    name: str = Field(min_length=1, max_length=50)
    email: EmailStr = Field(max_length=254)
    subject: str = Field(min_length=1, max_length=50)
    message: str = Field(min_length=1, max_length=1000)
    website: str = Field(default="", max_length=200)


class ContactUpdate(APIModel):
    is_read: bool


class ContactRead(ReadModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    is_read: bool
