"""Trích text từ PDF theo trang và chia nhỏ thành chunk phục vụ embedding.

Chunk không vắt qua 2 trang để metadata số trang luôn chính xác.
"""

import re
from dataclasses import dataclass
from io import BytesIO

from pypdf import PdfReader

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150
MIN_CHUNK_CHARS = 30

# Ưu tiên cắt ở ranh giới đoạn, rồi câu, rồi dòng, cuối cùng là khoảng trắng.
_BREAKS = ("\n\n", ". ", "! ", "? ", "\n", " ")


@dataclass
class Chunk:
    page: int  # 1-based
    chunk_index: int  # 0-based, duy nhất trong toàn tài liệu
    text: str


@dataclass
class ExtractResult:
    pages_total: int
    pages_with_text: int
    chunks: list[Chunk]


def is_readable_pdf(pdf_bytes: bytes) -> bool:
    try:
        PdfReader(BytesIO(pdf_bytes))
        return True
    except Exception:
        return False


def extract_chunks(
    pdf_bytes: bytes,
    chunk_size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP,
) -> ExtractResult:
    reader = PdfReader(BytesIO(pdf_bytes))
    chunks: list[Chunk] = []
    pages_with_text = 0
    chunk_index = 0

    for page_no, page in enumerate(reader.pages, start=1):
        text = _normalize(page.extract_text() or "")
        if len(text) < MIN_CHUNK_CHARS:
            # Trang rỗng hoặc trang scan không có text layer.
            continue
        pages_with_text += 1
        for piece in split_text(text, chunk_size, overlap):
            chunks.append(Chunk(page=page_no, chunk_index=chunk_index, text=piece))
            chunk_index += 1

    return ExtractResult(
        pages_total=len(reader.pages),
        pages_with_text=pages_with_text,
        chunks=chunks,
    )


def split_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    if len(text) <= size:
        return [text]

    pieces: list[str] = []
    start = 0
    while start < len(text):
        end = min(start + size, len(text))
        if end < len(text):
            end = _find_break(text, start, end)
        piece = text[start:end].strip()
        if len(piece) >= MIN_CHUNK_CHARS or not pieces:
            pieces.append(piece)
        if end >= len(text):
            break
        start = max(end - overlap, start + 1)
    return pieces


def _find_break(text: str, start: int, end: int) -> int:
    # Không lùi quá nửa chunk để tránh chunk quá ngắn.
    floor = start + (end - start) // 2
    for sep in _BREAKS:
        pos = text.rfind(sep, floor, end)
        if pos > floor:
            return pos + len(sep)
    return end


def _normalize(text: str) -> str:
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.splitlines()]
    normalized = "\n".join(lines)
    normalized = re.sub(r"\n{3,}", "\n\n", normalized)
    return normalized.strip()
