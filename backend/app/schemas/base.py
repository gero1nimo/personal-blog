from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BaseSchema(BaseModel):
    created_at: Optional[datetime]
    
class BaseDBMetadata:
    created_at: Optional[datetime]
