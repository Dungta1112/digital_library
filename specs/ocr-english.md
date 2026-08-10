# Spec: Thêm OCR tiếng Anh cho PDF scan

> Status: done | Created: 2026-08-10 | Done: 2026-08-10

## Vấn đề
Hiện tại OCR chỉ dùng `lang='vie'` (pdf_service.py), tài liệu scan tiếng Anh
sẽ OCR ra text sai/kém chất lượng. Tesseract đã có sẵn gói `eng` trên máy.

## Giải pháp
Thêm tham số `ocr_lang` vào `extract_chunks()`, mặc định `'vie'`.
Hỗ trợ 3 giá trị: `'vie'`, `'eng'`, `'vie+eng'`.

| File | Thay đổi |
|---|---|
| `pdf_service.py` | `extract_chunks()` thêm param `ocr_lang: str = 'vie'` |
| `routers/ai.py` | endpoint `ingest_document` thêm Form field `ocr_lang` (optional, default 'vie') |
| `routers/ai.py` | `_run_ingest()` nhận `ocr_lang`, truyền vào `extract_chunks()` |
| `schemas.py` | không cần sửa (lang không nằm trong response) |

## Tiêu chí chấp nhận
- [x] Ingest file scan tiếng Việt với `ocr_lang=vie` → OCR ra text tiếng Việt chính xác (như cũ)
- [x] Ingest file scan tiếng Anh với `ocr_lang=eng` → OCR ra text tiếng Anh (unit test pass-through; chưa test file scan tiếng Anh thật vì chưa có file mẫu)
- [x] Không truyền `ocr_lang` → mặc định `vie` (không break backward compatibility)