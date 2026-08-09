from io import BytesIO

import pytest

from app.services import pdf_service
from app.services.pdf_service import MIN_CHUNK_CHARS, extract_chunks, split_text


def _content_stream(text: str) -> bytes:
    parts = ["BT /F1 12 Tf 14 TL 50 750 Td"]
    for line in text.split("\n"):
        esc = line.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")
        parts.append(f"({esc}) Tj T*")
    parts.append("ET")
    return " ".join(parts).encode("latin-1")


def build_pdf(pages: list[str]) -> bytes:
    """Tạo PDF tối giản (Helvetica, ASCII) đủ để pypdf trích được text."""
    n = len(pages)
    objects: list[bytes] = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        (
            "<< /Type /Pages /Kids ["
            + " ".join(f"{4 + 2 * i} 0 R" for i in range(n))
            + f"] /Count {n} >>"
        ).encode(),
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    for i, text in enumerate(pages):
        content_id = 5 + 2 * i
        objects.append(
            (
                "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
                f"/Resources << /Font << /F1 3 0 R >> >> /Contents {content_id} 0 R >>"
            ).encode()
        )
        stream = _content_stream(text)
        objects.append(
            b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream"
        )

    out = BytesIO()
    out.write(b"%PDF-1.4\n")
    offsets = []
    for idx, body in enumerate(objects, start=1):
        offsets.append(out.tell())
        out.write(f"{idx} 0 obj\n".encode() + body + b"\nendobj\n")
    xref_pos = out.tell()
    out.write(f"xref\n0 {len(objects) + 1}\n".encode())
    out.write(b"0000000000 65535 f \n")
    for off in offsets:
        out.write(f"{off:010d} 00000 n \n".encode())
    out.write(
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_pos}\n%%EOF".encode()
    )
    return out.getvalue()


def _long_text(sentences: int) -> str:
    return " ".join(
        f"Sentence number {i} talks about the architecture of the digital library system."
        for i in range(sentences)
    )


def test_extracts_pages_with_correct_page_numbers():
    pdf = build_pdf(
        [
            "Chapter one introduces the fundamentals of information retrieval systems.",
            "Chapter two describes vector embeddings and semantic search in detail.",
        ]
    )
    result = extract_chunks(pdf)

    assert result.pages_total == 2
    assert result.pages_with_text == 2
    assert [c.page for c in result.chunks] == [1, 2]
    assert "fundamentals of information retrieval" in result.chunks[0].text
    assert "vector embeddings" in result.chunks[1].text


def test_chunk_index_is_unique_and_sequential():
    pdf = build_pdf([_long_text(60), _long_text(60)])
    result = extract_chunks(pdf)

    assert len(result.chunks) > 2
    assert [c.chunk_index for c in result.chunks] == list(range(len(result.chunks)))
    # Chunk không vắt qua trang: mỗi chunk thuộc đúng 1 trang.
    assert {c.page for c in result.chunks} == {1, 2}


def test_blank_page_is_skipped():
    pdf = build_pdf(["", "Only this second page carries meaningful extractable content."])
    result = extract_chunks(pdf)

    assert result.pages_total == 2
    assert result.pages_with_text == 1
    assert all(c.page == 2 for c in result.chunks)


def test_on_page_progress_called_for_each_page():
    pdf = build_pdf(["Page one content.", "Page two content."])
    progress: list[int] = []
    extract_chunks(pdf, on_page_progress=lambda n: progress.append(n))

    assert progress == [1, 2]


def test_ocr_fallback_recovers_blank_page(monkeypatch):
    # Trang 1 có text layer; trang 2 trắng → phải kích hoạt OCR và lấy lại text.
    monkeypatch.setattr(
        pdf_service.pytesseract,
        "image_to_string",
        lambda img, lang, config: "OCR extracted text from scanned page two.",
    )
    pdf = build_pdf(["Page one has real text long enough to pass the threshold.", ""])
    result = extract_chunks(pdf)

    assert result.pages_with_text == 2
    assert result.pages_ocred == 1
    assert result.chunks[1].page == 2
    assert "OCR extracted text" in result.chunks[1].text


def test_ocr_page_threshold_exceeded(monkeypatch):
    monkeypatch.setattr(pdf_service, "MAX_OCR_PAGES", 1)
    pdf = build_pdf(["", ""])

    with pytest.raises(ValueError, match="vượt ngưỡng tối đa 1 trang OCR"):
        extract_chunks(pdf)


def test_split_text_short_text_single_chunk():
    text = "A short paragraph."
    assert split_text(text) == [text]


def test_split_text_respects_size_and_overlap():
    text = _long_text(100)
    pieces = split_text(text, size=1000, overlap=150)

    assert len(pieces) > 1
    for piece in pieces:
        assert len(piece) <= 1000
        assert len(piece) >= MIN_CHUNK_CHARS
    # Overlap: phần đầu của chunk sau phải xuất hiện trong chunk trước.
    for prev, nxt in zip(pieces, pieces[1:]):
        assert nxt[:40] in prev


def test_split_text_covers_all_content():
    text = _long_text(80)
    pieces = split_text(text, size=1000, overlap=150)
    # Mọi câu gốc phải nằm trong ít nhất một chunk.
    for i in range(80):
        marker = f"Sentence number {i} "
        assert any(marker in piece for piece in pieces), marker
