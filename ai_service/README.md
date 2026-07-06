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
