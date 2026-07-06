from typing import Optional

from pydantic import BaseModel


class BookIn(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""


class SyncBooksResponse(BaseModel):
    status: str
    message: str


class SearchRequest(BaseModel):
    query: str
    top_k: int = 3


class SearchResultItem(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    distance: float


class SearchBooksResponse(BaseModel):
    query: str
    answer: str
    results: list[SearchResultItem]
