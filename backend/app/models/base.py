from sqlmodel import SQLModel, Field, DateTime
from datetime import datetime, timezone

def utcnow() -> datetime:
    return datetime.now(timezone.utc)

class BaseModel(SQLModel):
    id: int = Field(default=None, primary_key = True, unique=True)
    created_at: datetime = Field(
        default_factory=utcnow,
        sa_type=DateTime(timezone=True), # type: ignore
        nullable=False
    )

    updated_at: datetime = Field(
        default_factory=utcnow,
        sa_type=DateTime(timezone=True), # type: ignore
        nullable=False,
        sa_column_kwargs={"onupdate": utcnow},
    )