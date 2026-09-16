from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional

class BaseModel(SQLModel):
    id: int = Field(default=None, primary_key = True, unique=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), 
                                 sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)})