"""Trích text từ PDF theo trang và chia nhỏ thành chunk phục vụ embedding.

Chunk không vắt qua 2 trang để metadata số trang luôn chính xác.
"""

import io
import logging
import re
from collections.abc import Callable
from dataclasses import dataclass
from io import BytesIO

import pypdfium2 as pdfium
import pytesseract
from PIL import Image
from pypdf import PdfReader

logger = logging.getLogger(__name__)

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150
MIN_CHUNK_CHARS = 30

OCR_DPI = 200
MAX_OCR_PAGES = 300

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
    pages_ocred: int = 0


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
    on_page_progress: Callable[[int], None] | None = None,
) -> ExtractResult:
    reader = PdfReader(BytesIO(pdf_bytes))
    pdf_doc = pdfium.PdfDocument(pdf_bytes)
    chunks: list[Chunk] = []
    pages_with_text = 0
    pages_ocred = 0
    chunk_index = 0

    # Đếm trước số trang cần OCR để kiểm tra ngưỡng
    scan_page_count = 0
    for page in reader.pages:
        t = _normalize(page.extract_text() or "")
        if len(t) < MIN_CHUNK_CHARS:
            scan_page_count += 1
    if scan_page_count > MAX_OCR_PAGES:
        pdf_doc.close()
        raise ValueError(
            f"Tài liệu có {scan_page_count} trang scan, vượt ngưỡng tối đa {MAX_OCR_PAGES} trang OCR"
        )

    for page_no, page in enumerate(reader.pages, start=1):
        text = _normalize(page.extract_text() or "")

        # OCR fallback cho trang scan (không có text layer)
        if len(text) < MIN_CHUNK_CHARS:
            try:
                pdf_page = pdf_doc[page_no - 1]
                bitmap = pdf_page.render(scale=OCR_DPI / 72)
                pil_image = bitmap.to_pil()
                text = pytesseract.image_to_string(
                    pil_image, lang='vie', config='--psm 6'
                )
                text = _normalize(text)
                pages_ocred += 1
                bitmap.close()
                pdf_page.close()
            except Exception as e:
                logger.warning(f"OCR failed for page {page_no}: {e}")
                text = ""

        if on_page_progress:
            on_page_progress(page_no)

        if len(text) < MIN_CHUNK_CHARS:
            continue
        pages_with_text += 1
        for piece in split_text(text, chunk_size, overlap):
            chunks.append(Chunk(page=page_no, chunk_index=chunk_index, text=piece))
            chunk_index += 1

    pdf_doc.close()
    return ExtractResult(
        pages_total=len(reader.pages),
        pages_with_text=pages_with_text,
        chunks=chunks,
        pages_ocred=pages_ocred,
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
