# AI Service (FastAPI + Ollama + ChromaDB)

Microservice cục bộ phục vụ tính năng tìm kiếm ngữ nghĩa (semantic search) cho Digital Library. Dùng Ollama để sinh embedding/tổng hợp câu trả lời, ChromaDB để lưu vector.

## Cài đặt

```bash
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Yêu cầu Ollama đang chạy với 2 model:

```bash
ollama pull nomic-embed-text
ollama pull qwen3:4b
```

## Chạy

```bash
uvicorn app.main:app --reload --port 8000
```

Health check: `GET /health`

## Cấu hình (`.env`)

| Biến | Mặc định |
|---|---|
| `OLLAMA_BASE_URL` | `http://localhost:11434` |
| `OLLAMA_MODEL` | `qwen3:4b` |
| `OLLAMA_EMBED_MODEL` | `nomic-embed-text` |
| `CHROMA_PATH` | `./chroma_db` |

## API

Được gọi bởi backend NestJS (`src/ai/ai.service.ts`).

### `POST /api/ai/sync-books`

Nhận mảng sách, tạo embedding và lưu vào ChromaDB (collection `local_books`).

```json
[{ "id": "1", "title": "Tên sách", "description": "Mô tả sách" }]
```

Trả về: `{ "status": "success", "message": "Đã số hóa N cuốn sách." }`

### `POST /api/ai/search-books`

Tìm kiếm ngữ nghĩa và dùng `qwen3:4b` tổng hợp câu trả lời tiếng Việt.

```json
{ "query": "sách về cây nhị phân", "top_k": 3 }
```

Trả về: `{ "query": "...", "answer": "...", "results": [{ "id", "title", "description", "distance" }] }`

## Document RAG (hỏi–đáp theo nội dung PDF)

Luồng riêng, độc lập với sync/search-books: nội dung PDF được tách theo trang,
chia chunk (~1000 ký tự, overlap 150), embed từng chunk và lưu vào collection
`document_chunks` kèm metadata `{document_id, title, page, chunk_index}`.

### `POST /api/ai/ingest-document` (multipart)

Fields: `file` (PDF), `document_id`, `title`. Trả về **202** ngay và xử lý nền:

```json
{ "status": "processing", "document_id": "..." }
```

Trả 400 nếu file không phải PDF đọc được, 409 nếu tài liệu đang được xử lý.
PDF scan không có text layer sẽ kết thúc với trạng thái `failed` kèm lý do.

### `GET /api/ai/ingest-status/{document_id}`

```json
{ "document_id": "...", "state": "processing|done|failed|not_found",
  "pages_total": 6, "pages_with_text": 6, "chunks_total": 6,
  "chunks_indexed": 6, "error": null }
```

Trạng thái giữ in-memory; sau khi restart service sẽ fallback đếm chunk trong
ChromaDB (`done` nếu đã có chunk, `not_found` nếu chưa).

### `POST /api/ai/ask-document`

```json
{ "query": "câu hỏi", "document_id": "tùy chọn — bỏ trống để hỏi trên mọi tài liệu", "top_k": 5 }
```

Truy xuất top_k chunk liên quan (lọc theo `document_id` nếu có), đưa vào prompt
để `qwen3:4b` trả lời kèm trích dẫn `[trang N]`:

```json
{ "query": "...", "answer": "...", "sources": [
  { "document_id", "title", "page", "chunk_index", "snippet", "distance" } ] }
```

### `DELETE /api/ai/document-index/{document_id}`

Gỡ toàn bộ chunk của tài liệu khỏi ChromaDB.

### Test nhanh cục bộ

```bash
./scripts/rag_smoke.sh ingest /duong/dan/file.pdf          # document_id mặc định: test-doc-1
./scripts/rag_smoke.sh ask "Chương 2 nói về điều gì?"
./scripts/rag_smoke.sh status
./scripts/rag_smoke.sh clean
```

## Test

```bash
pip install -r requirements-dev.txt
pytest
```
