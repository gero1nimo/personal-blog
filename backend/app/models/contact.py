from sqlmodel import Field

from .base import BaseModel


class ContactMessage(BaseModel, table=True):
    __tablename__ = "contact_messages"
    name: str = Field(max_length=50)
    subject: str = Field(max_length=50)
    message: str = Field(max_length=1000)
    email: str = Field(max_length=254)
    is_read: bool = Field(default=False, index=True)
