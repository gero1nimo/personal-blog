from sqlmodel import Column, SQLModel, Field, String
from datetime import datetime 



class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: int = Field(primary_key=True, index=True)
    name: str = Field(index=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str = Column(index=True) 
    