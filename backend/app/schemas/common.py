from math import ceil
from typing import TypeVar, Generic
from .base import APIModel

T = TypeVar("T")

class Page(APIModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    size: int
    pages:int

    @classmethod
    def create(cls, items: list[T], total: int, page: int, size: int) -> "Page[T]":
        return cls(items=items, total=total, page=page, size=size,
                   pages=ceil(total / size) if size else 0)

