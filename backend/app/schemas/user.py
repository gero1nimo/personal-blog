from pydantic import BaseModel


class UserModelSchema(BaseModel):
    id: int
    name: str
    email: str
    password: str