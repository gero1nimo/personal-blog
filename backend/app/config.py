from pathlib import Path
from typing import Literal, Annotated

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict, NoDecode

BASE_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    ENV: Literal["prod", "dev"] = "dev"
    DATABASE_URL: str
    CORS_ORIGINS: Annotated[list[str], NoDecode] = []
    JWT_SECRET: SecretStr
    JWT_ALGORITHM: Literal["HS256"] = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    IMAGEKIT_PUBLIC_KEY: str
    IMAGEKIT_PRIVATE_KEY: SecretStr
    IMAGEKIT_URL_ENDPOINT: str

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def _split(cls,
               v
               ):
        if isinstance(v, str):
            return [o.strip() for o in v.split(",") if o.strip()]
        if v is None:
            return []
        return v

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
