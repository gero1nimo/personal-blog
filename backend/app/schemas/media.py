from .base import APIModel


class UploadAuth(APIModel):
    token: str
    expire: int
    signature: str
    public_key: str
    url_endpoint: str
