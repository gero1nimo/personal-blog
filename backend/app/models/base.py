from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional

class BaseModel(SQLModel):
    id: Optional[int] = Field(default=None, primary_key = True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
