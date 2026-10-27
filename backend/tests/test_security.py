import jwt
import pytest

from app.config import settings
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)
from app.models.base import utcnow

from datetime import timedelta

SECRET = settings.JWT_SECRET.get_secret_value()
ALGORITHM = settings.JWT_ALGORITHM


# ------------------------------------------------------------------ şifre

def test_hash_is_not_plaintext():
    hashed = hash_password("gizli123")
    assert hashed != "gizli123"
    assert hashed.startswith("$argon2")


def test_verify_correct_password():
    hashed = hash_password("gizli123")
    assert verify_password("gizli123", hashed) is True


def test_verify_wrong_password():
    hashed = hash_password("gizli123")
    assert verify_password("yanlis", hashed) is False
    assert verify_password("", hashed) is False


def test_same_password_gives_different_hashes():
    # her hash'e rastgele salt eklendiği için
    assert hash_password("gizli123") != hash_password("gizli123")


# ------------------------------------------------------------------ token

def test_token_roundtrip_returns_subject():
    token = create_access_token("mehmet@example.com")
    assert isinstance(token, str)
    assert decode_access_token(token) == "mehmet@example.com"


def test_token_contains_expiry():
    token = create_access_token("a@b.com")
    payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    assert payload["sub"] == "a@b.com"
    assert payload["exp"] > utcnow().timestamp()


def test_garbage_token_returns_none():
    assert decode_access_token("bu-bir-token-degil") is None
    assert decode_access_token("") is None


def test_expired_token_returns_none(monkeypatch):
    monkeypatch.setattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", -1)
    token = create_access_token("a@b.com")          # üretildiği anda süresi dolmuş
    assert decode_access_token(token) is None


def test_token_signed_with_wrong_key_returns_none():
    forged = jwt.encode(
        {"sub": "a@b.com", "exp": utcnow() + timedelta(minutes=5)},
        key="baska-bir-gizli-anahtar-baska-bir-gizli-anahtar",
        algorithm=ALGORITHM,
    )
    assert decode_access_token(forged) is None


def test_tampered_token_returns_none():
    token = create_access_token("a@b.com")
    header, payload, signature = token.split(".")
    forged_payload = jwt.encode({"sub": "admin@evil.com"}, "x" * 32, algorithm=ALGORITHM).split(".")[1]
    assert decode_access_token(f"{header}.{forged_payload}.{signature}") is None


def test_token_without_sub_returns_none():
    token = jwt.encode(
        {"exp": utcnow() + timedelta(minutes=5)}, SECRET, algorithm=ALGORITHM
    )
    assert decode_access_token(token) is None


def test_unsigned_alg_none_token_is_rejected():
    token = jwt.encode({"sub": "a@b.com"}, key=None, algorithm="none")
    assert decode_access_token(token) is None
