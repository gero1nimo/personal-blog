from pydantic import BaseModel
from typing import Optional


class ProfileModel(BaseModel):
    id: Optional[int] = None
    name: str
    title: str
    profile_image: Optional[str] = None  # URL to profile image
    years_experience: int = 3
    projects_count: int = 15
    available_for_hire: bool = True
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    email: Optional[str] = None
