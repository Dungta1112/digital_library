"""Trạng thái ingest giữ in-memory (1 process uvicorn).

Mất khi restart — khi đó endpoint status fallback sang đếm chunk trong Chroma.
"""

import threading
from dataclasses import dataclass


@dataclass
class IngestStatus:
    state: str  # processing | done | failed
    pages_total: int = 0
    pages_with_text: int = 0
    chunks_total: int = 0
    chunks_indexed: int = 0
    error: str | None = None


_lock = threading.Lock()
_statuses: dict[str, IngestStatus] = {}


def start(document_id: str) -> None:
    with _lock:
        _statuses[document_id] = IngestStatus(state="processing")


def update(document_id: str, **fields) -> None:
    with _lock:
        status = _statuses.get(document_id)
        if status is None:
            return
        for key, value in fields.items():
            setattr(status, key, value)


def get(document_id: str) -> IngestStatus | None:
    with _lock:
        return _statuses.get(document_id)


def is_processing(document_id: str) -> bool:
    status = get(document_id)
    return status is not None and status.state == "processing"
