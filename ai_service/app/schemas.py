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


class IngestAccepted(BaseModel):
    status: str
    document_id: str


class IngestStatusResponse(BaseModel):
    document_id: str
    state: str  # processing | done | failed | not_found
    pages_total: int = 0
    pages_with_text: int = 0
    chunks_total: int = 0
    chunks_indexed: int = 0
    error: Optional[str] = None
    pages_processed: int = 0
    stage: str = "extracting"
    pages_ocred: int = 0
    updated_at: Optional[float] = None


class DeleteIndexResponse(BaseModel):
    status: str
    document_id: str
    chunks_deleted: int


class AskRequest(BaseModel):
    query: str
    document_id: Optional[str] = None
    top_k: int = 8


class SourceChunk(BaseModel):
    document_id: str
    title: str
    page: int
    chunk_index: int
    snippet: str
    distance: float


class AskResponse(BaseModel):
    query: str
    answer: str
    sources: list[SourceChunk]
