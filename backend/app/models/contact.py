from .base import BaseModel


class ContactMessage(BaseModel, table=True):
    __tablename__ = "contact_message"
    name: str
    email: str
    subject: str
    message: str
    is_read: bool = False
