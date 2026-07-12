from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BaseSchema(BaseModel):
    name: str

class BaseDBMetadata:
    id: int
    created_at: Optional[datetime]
