# Spec: OCR tiếng Anh cho PDF scan

> Status: done | Created: 2026-08-10 | Done: 2026-08-10

## Vấn đề
Hiện tại OCR chỉ dùng `lang='vie'` (pdf_service.py), tài liệu scan tiếng Anh
sẽ OCR ra text sai/kém chất lượng. Tesseract đã có sẵn gói `eng` trên máy.

## Giải pháp
Auto-detect ngôn ngữ OCR: `_detect_ocr_lang()` render + OCR mẫu 3 trang đầu
với `vie+eng`, đếm tỷ lệ ký tự tiếng Việt, >3% → `vie`, ngược lại → `eng`.
Không cần param/Form field `ocr_lang` thủ công.

| File | Thay đổi |
|---|---|
| `pdf_service.py` | thêm `VIETNAMESE_CHARS` + `_detect_ocr_lang()`; `extract_chunks()` bỏ param `ocr_lang`, tự detect |
| `routers/ai.py` | bỏ Form field `ocr_lang` khỏi `ingest_document`, bỏ param khỏi `_run_ingest()` |
| `main.py` | thêm `logging.basicConfig(level=INFO)` để thấy log auto-detect |
| `schemas.py` | không cần sửa (lang không nằm trong response) |

## Tiêu chí chấp nhận
- [x] Ingest file scan tiếng Việt → log `Auto-detected OCR language: vie` (268/2651 viet chars), OCR ra text tiếng Việt chính xác
- [x] Ingest file scan tiếng Anh → log `Auto-detected OCR language: eng` (13/1977 viet chars), OCR ra text tiếng Anh
- [x] Không cần truyền `ocr_lang` nữa — endpoint không còn field này