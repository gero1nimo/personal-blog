from datetime import timedelta

import jwt
from pwdlib import PasswordHash

from app.config import settings
from app.models.base import utcnow

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(plain_password: str,
                    hashed_password: str
                    ) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def create_access_token(subject: str) -> str:
    encoded = jwt.encode(
        {
            "sub": subject,
            "exp": utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        },
        key=settings.JWT_SECRET.get_secret_value(),
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, key=settings.JWT_SECRET.get_secret_value(), algorithms=[settings.JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        return None

    return payload.get('sub')
