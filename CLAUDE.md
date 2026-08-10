# CLAUDE.md — Kế hoạch: Hỏi–đáp theo NỘI DUNG tài liệu PDF (Document RAG)

> Trạng thái: **ĐÃ DUYỆT — mốc 1–5 (ai_service) HOÀN THÀNH 2026-07-12**, kèm
> script test cục bộ `ai_service/scripts/rag_smoke.sh` (commits 55e1b76..079fb52).
> E2E đạt trên PDF mẫu 6 trang: 3 câu hỏi trả lời đúng kèm trích dẫn đúng trang,
> câu hỏi ngoài tài liệu bị từ chối đúng (không bịa). Ghi chú triển khai thực tế:
> KHÔNG dùng think=False với qwen3 (làm suy luận lẫn vào content — đã kiểm chứng
> trên Ollama 0.31.1); để mặc định server tự tách thinking, kèm regex strip phòng hờ.
> Mốc 6–9 HOÀN THÀNH 2026-07-12 (commits 964094c..6c3e257): storage getBuffer,
> backend /ai/ingest/:id + /ai/ask với RBAC (401/403/404 đã kiểm chứng), frontend
> /ai/ask + citations thật + chỉ báo chế độ theo-tài-liệu. Test E2E bằng Document
> thật (seeder: `npx ts-node scripts/create-test-document.ts`, PDF 81 trang →
> 210 chunk trong ~40s): trả lời đúng kèm trích dẫn trang qua backend.
> Lưu ý: pypdf trích text tiếng Việt có artifact khoảng trắng giữa từ ("ph ải") —
> không ảnh hưởng retrieval/answer nhưng snippet hiển thị hơi thô.
> Quy ước commit: xem mục 9 (bắt buộc).

---

## 1. Hiện trạng (đã đọc code, xác nhận 2026-07-12)

Luồng AI hiện tại chỉ làm **tìm sách theo mô tả**, không đụng đến nội dung file:

- `ai_service/` (FastAPI, port 8000, venv `ai_service/.venv`):
  - `app/config.py`: Ollama `qwen3:4b` (chat), `nomic-embed-text` (embed), Chroma persist tại `ai_service/chroma_db/`. Env riêng tại `ai_service/.env`.
  - `app/routers/ai.py`:
    - `POST /api/ai/sync-books` — nhận `[{id, title, description}]`, embed chuỗi "Tên sách + mô tả" thành **1 vector/сuốn**, upsert vào collection Chroma `local_books` (chỉ metadata title/description, không lưu `documents`).
    - `POST /api/ai/search-books` — embed query, lấy top_k sách, đưa **title + description** vào prompt cho qwen3:4b tổng hợp câu trả lời.
  - `app/services/chroma_service.py`: 1 collection cứng `local_books`.
  - `app/services/ollama_service.py`: `chat(prompt)` + `embed(text)`, system prompt tiếng Việt.
- Backend NestJS (port 3000, prefix `api/v1`): `src/ai/` là proxy mỏng qua `AI_SERVICE_URL`:
  - `POST /api/v1/ai/sync` (JWT) → `/api/ai/sync-books`; `POST /api/v1/ai/search` (không JWT) → `/api/ai/search-books`. Không nơi nào trong backend tự động gọi sync — sync là thao tác thủ công.
- File PDF thật nằm ở storage: `Document` ↔ `DocumentFile` (prisma) với `objectKey`, `mimeType`; `StorageService` có 2 provider:
  - MinIO (`presignedGetObject`, TTL 5 phút) — container `ailibrary-minio`.
  - Local (`getReadUrl` trả path tương đối `/storage/<key>` — **không** dùng được như URL tải từ service khác).
- Frontend (Next.js 16, port 3001): trang `/ai` (`frontend/src/app/ai/page.tsx`) đã đọc `?doc=<id>` từ URL và truyền `contextDocId` vào `AIService.sendMessage(...)`, **nhưng** `ai.service.ts` hiện bỏ qua tham số này và luôn gọi `/ai/search`. Type `AICitation` đã có sẵn `pageNumber` + `textSnippet` — khớp hoàn hảo với mục tiêu mới.
- Phần cứng: GPU **GTX 960M 4GB VRAM** — yếu, chi phối nhiều quyết định bên dưới (mục 10).

## 2. Mục tiêu

Người dùng đưa 1 tài liệu PDF vào hệ thống → hỏi bằng ngôn ngữ tự nhiên → hệ thống
trả lời **đúng đoạn/mục cụ thể bên trong nội dung file** (kèm số trang + trích đoạn),
không chỉ trả về tên sách như hiện tại. Model: `qwen3:4b` qua Ollama (giữ nguyên cấu hình).

## 3. Kiến trúc & luồng dữ liệu mới

Giữ nguyên mô hình 3 tầng hiện có (frontend → NestJS proxy → ai_service). Thêm 2 luồng:

**Luồng ingest (số hóa nội dung 1 tài liệu) — chạy nền ngay từ đợt này (lý do: mục 10a):**
```
Client (JWT + quyền, mục 5.2) → POST /api/v1/ai/ingest/:documentId  (NestJS)
  → NestJS: tra Document + DocumentFile (prisma), kiểm tra quyền + mimeType = application/pdf
  → NestJS: đọc bytes PDF từ storage (thêm method getBuffer vào StorageService — mục 5.1)
  → NestJS: POST multipart (file + document_id + title) → ai_service /api/ai/ingest-document
  → ai_service: nhận file, validate đọc được PDF, trả 202 NGAY {status: "processing"}
    rồi chạy nền (FastAPI BackgroundTasks, in-process — không cần queue/worker ngoài):
    parse PDF theo trang → chunk → embed từng chunk → upsert Chroma (`document_chunks`)
  → client poll GET /api/v1/ai/ingest/:documentId/status → {state, pages_total,
    chunks_indexed, error?}
```
Lý do gửi bytes qua multipart thay vì gửi presigned URL: provider LOCAL không có URL
tải được, và tránh phụ thuộc TTL 5 phút / network topology giữa 2 service.

**Luồng hỏi–đáp theo tài liệu:**
```
Frontend /ai?doc=<id> → POST /api/v1/ai/ask {query, documentId?, topK?}  (JWT bắt buộc)
  → NestJS: nếu có documentId → kiểm tra quyền truy cập tài liệu (mục 5.2) trước khi proxy
  → ai_service POST /api/ai/ask-document
  → embed query → Chroma query (filter where {"document_id": ...} nếu có documentId)
  → lấy top_k chunk (mặc định 5) → dựng prompt các trích đoạn đánh số kèm số trang
  → qwen3:4b trả lời CHỈ dựa trên trích đoạn, dẫn nguồn dạng [trang N]
  → response: {query, answer, sources: [{document_id, title, page, chunk_index, snippet, distance}]}
```
`/ai/search` (tìm sách) giữ nguyên, không đụng vào — hai tính năng song song.

## 4. Chi tiết ai_service

### 4.1 Đọc & chunk PDF
- Thư viện: **`pypdf`** (pure Python, không phụ thuộc hệ thống, license BSD).
  Không chọn PyMuPDF (AGPL) dù nhanh hơn — PDF học thuật thường có text layer, pypdf đủ.
- Trích text **theo từng trang** (`page.extract_text()`) để giữ số trang chính xác.
- Chunk trong phạm vi từng trang (không cho chunk vắt qua 2 trang để metadata trang luôn đúng):
  - Kích thước đích ~**1.000 ký tự** (~250–300 token), **overlap ~150 ký tự**.
  - Tách ưu tiên theo ranh giới đoạn (`\n\n`) rồi câu (`. `), tránh cắt giữa câu.
  - Trang rỗng (PDF scan không có text layer) → bỏ qua, đếm và cảnh báo trong response.
- Module mới: `app/services/pdf_service.py` — hàm `extract_chunks(pdf_bytes) -> list[Chunk]`
  với `Chunk = {page: int, chunk_index: int, text: str}`.

### 4.2 Lưu & index trong ChromaDB
- **Collection mới `document_chunks`** (tách khỏi `local_books` — khác đơn vị dữ liệu,
  khác vòng đời). `chroma_service.py` refactor nhẹ để hỗ trợ 2 collection + hàm
  `delete(where=...)` và `query(..., where=...)`.
- Mỗi chunk 1 record:
  - `id`: `"{document_id}:{page}:{chunk_index}"` (ổn định → re-ingest là upsert sạch).
  - `embedding`: nomic-embed-text của text chunk.
  - `document` (trường documents của Chroma): **nguyên văn text chunk** (khác sync-books
    hiện tại vốn không lưu documents — cần text để đưa vào prompt và trả snippet).
  - `metadata`: `{document_id, title, page, chunk_index}`.
- Trước khi ingest: `collection.delete(where={"document_id": ...})` để xóa index cũ
  của chính tài liệu đó (tránh chunk mồ côi khi file thay đổi/chia lại chunk).
- Embed tuần tự từng chunk qua Ollama (API embeddings hiện dùng không hỗ trợ batch);
  chấp nhận chậm, xem mục 10.

### 4.3 Endpoint mới (router `app/routers/ai.py`, giữ prefix `/api/ai`)
| Endpoint | Body | Trả về |
|---|---|---|
| `POST /api/ai/ingest-document` | multipart: `file` (PDF), `document_id`, `title` | **202** `{status: "processing", document_id}` — xử lý nền bằng `BackgroundTasks` |
| `GET /api/ai/ingest-status/{document_id}` | — | `{state: processing\|done\|failed\|not_found, pages_total, pages_indexed, chunks_indexed, error?}` |
| `POST /api/ai/ask-document` | JSON: `{query, document_id?, top_k=5}` | `{query, answer, sources: [...]}` |
| `DELETE /api/ai/document-index/{document_id}` | — | `{status}` (gỡ index khi tài liệu bị xóa) |

Trạng thái ingest giữ trong **dict in-memory** (module-level, khóa theo document_id).
Chấp nhận mất trạng thái khi restart uvicorn: khi đó `ingest-status` fallback sang đếm
chunk trong Chroma (`collection.get(where={"document_id": ...})` — có chunk = `done`,
không có = `not_found`). Không dùng queue/worker ngoài (Redis/Celery) trong đợt này —
1 uvicorn process, ingest tuần tự là đủ cho quy mô hiện tại.

Schemas mới thêm vào `app/schemas.py`: `IngestAccepted`, `IngestStatusResponse`, `AskRequest`, `AskResponse`, `SourceChunk`.

### 4.4 Cách qwen3:4b dùng ngữ cảnh truy xuất
Prompt dạng (tiếng Việt, khớp SYSTEM_PROMPT hiện có):
```
Dưới đây là các trích đoạn từ tài liệu "<title>":

[1] (trang 12) <text chunk 1>
[2] (trang 13) <text chunk 2>
...

Câu hỏi: <query>

Chỉ dựa vào các trích đoạn trên để trả lời. Khi dùng thông tin từ trích đoạn nào,
ghi rõ nguồn dạng [trang N]. Nếu các trích đoạn không chứa thông tin để trả lời,
nói rõ là không tìm thấy trong tài liệu — tuyệt đối không bịa.
```
- top_k=5 × ~1.000 ký tự ≈ 5.000 ký tự (~1.500 token) context → gọi `chat()` với
  `options={"num_ctx": 8192}` cho riêng luồng này (mặc định Ollama 4096 dễ bị cắt).
- qwen3 là model có "thinking": nâng pin `ollama` (pip) từ 0.2.1 lên bản mới (≥0.4)
  để truyền `think=False`; phòng hờ vẫn strip `<think>...</think>` khỏi answer trong
  `ollama_service.chat()` (regex, áp dụng chung — cũng sửa luôn rủi ro tiềm ẩn cho
  `/search-books` hiện tại).

### 4.5 Dependencies thay đổi (`ai_service/requirements.txt`)
- Thêm: `pypdf`, `python-multipart` (FastAPI cần cho UploadFile).
- Nâng: `ollama` → bản mới nhất tương thích (để có `think=False`). Kiểm tra lại
  `/search-books` sau khi nâng (API `embeddings` đổi tên thành `embed` ở bản mới —
  sẽ cập nhật `ollama_service.py` tương ứng).

## 5. Backend NestJS — thay đổi

### 5.1 `src/storage/` — thêm đọc bytes
- `StorageService` (abstract): thêm `getBuffer(objectKey: string): Promise<Buffer>`.
  - `LocalStorageProvider`: `readFile(join(root, objectKey))`.
  - `MinioStorageProvider`: `client.getObject(...)` → gom stream thành Buffer.
- Đây là thay đổi backend "xâm lấn" duy nhất ngoài module ai.

### 5.2 `src/ai/` — endpoint + kiểm soát truy cập

Cơ sở RBAC hiện có (đã xác nhận trong code): `JwtAuthGuard`, `RbacGuard` +
decorator `@Permissions(...)`; seed có sẵn các quyền `documents.read`,
`documents.download`, `documents.manage_own`, `documents.approve`. Trường
`Document.visibility` tồn tại trong schema nhưng hiện **chưa endpoint nào enforce**
(search/detail/read chỉ lọc `status=APPROVED, deletedAt=null`).

- `ai.controller.ts`:
  - `POST /api/v1/ai/ingest/:documentId` — `JwtAuthGuard + RbacGuard`,
    `@Permissions('documents.manage_own', 'documents.approve')` (owner hoặc
    content manager/admin). Không nhận file từ client; tự lấy file từ storage
    theo documentId. Trả 202 + hướng dẫn poll status.
  - `GET /api/v1/ai/ingest/:documentId/status` — JWT, proxy sang
    `/api/ai/ingest-status/{id}`.
  - `POST /api/v1/ai/ask` — **JwtAuthGuard bắt buộc** (khác `/ai/search` public,
    vì trả về nội dung bên trong tài liệu ~ tương đương quyền `read`), kèm
    `RbacGuard + @Permissions('documents.read')`.
- `ai.service.ts`:
  - **Kiểm tra quyền truy cập tài liệu** — helper `assertCanAccessDocument(user, documentId)`
    dùng chung cho cả `ask` (khi có documentId) lẫn `ingest`, kiểm tra qua Prisma:
    1. Document tồn tại, `deletedAt = null` — sai thì 404 (không lộ tồn tại).
    2. `status = APPROVED` **hoặc** `ownerId = user.id` (owner được hỏi/ingest tài
       liệu của mình kể cả khi chưa duyệt — khớp ngữ nghĩa `documents.manage_own`);
       với `ask`, người thường chỉ qua khi APPROVED, đúng chuẩn `read()`/`download()`
       hiện tại của library-document.
    3. `visibility !== 'PUBLIC'` → chỉ owner hoặc user có `documents.approve` được
       qua (bắt đầu enforce visibility cho luồng AI — chặt hơn hiện trạng, đúng yêu cầu).
    Riêng `ingest` thêm điều kiện: là owner, hoặc có quyền `documents.approve`.
  - `ingestDocument(user, documentId)`: assert quyền → validate
    `mimeType === 'application/pdf'` → `storage.getBuffer()` → POST multipart
    (`form-data`) sang `/api/ai/ingest-document`. Vì ai_service trả 202 ngay,
    request này ngắn — không cần timeout đặc biệt.
  - `askDocument(user, query, documentId?, topK?)`: nếu có documentId → assert quyền
    truy cập, rồi proxy JSON sang `/api/ai/ask-document`.
  - Module cần thêm import `PrismaModule` + `StorageModule`.
- Lưu ý nhất quán: `/ai/ask` không documentId (hỏi chung toàn thư viện) vẫn cần JWT +
  `documents.read`; `/ai/search` cũ giữ nguyên public để không phá hành vi hiện có.
- (Tùy chọn, giai đoạn sau — không nằm trong đợt này): tự động gọi ingest khi
  admin duyệt tài liệu (content-management approve hook).

## 6. Frontend — thay đổi

- `src/services/ai.service.ts`:
  - `sendMessage(message, contextDocId?)`: nếu có `contextDocId` → gọi
    `POST /ai/ask {query, documentId}`; map `sources[]` → `AICitation[]` với
    `pageNumber = source.page`, `textSnippet = source.snippet` (hết hardcode `pageNumber: 1`).
    Không có `contextDocId` → giữ nguyên `/ai/search` như cũ.
- Trang `/ai` đã đọc sẵn `?doc=` — chỉ cần thêm chỉ báo nhỏ trên header
  ("Đang hỏi theo tài liệu: <title>") để người dùng biết đang ở chế độ theo-tài-liệu.
- Trang chi tiết tài liệu: thêm nút **"Hỏi AI về tài liệu này"** → link `/ai?doc=<id>`.
  (Nếu tài liệu chưa được ingest, câu trả lời sẽ báo chưa có dữ liệu — kèm nút/flow
  gọi `POST /ai/ingest/:id` cho người có quyền, sau đó poll
  `GET /ai/ingest/:id/status` vài giây/lần để hiển thị tiến độ "đang xử lý → xong".)
- `ChatMessage` component: kiểm tra đã render citations chưa; nếu chưa thì bổ sung
  hiển thị `[trang N] + snippet`.
- Lưu ý repo: đọc `frontend/node_modules/next/dist/docs/` trước khi sửa code Next
  (AGENTS.md cảnh báo API khác training data).

## 7. Những gì KHÔNG làm trong đợt này
- Không OCR PDF scan (trang không có text layer chỉ được đếm + cảnh báo).
- Không lưu lịch sử chat, không streaming token.
- Không queue/worker ngoài (Redis/Celery) cho ingest — chạy nền in-process bằng
  FastAPI BackgroundTasks là đủ (xem mục 10a); một thời điểm một tài liệu.
- Không đổi luồng `/ai/search` + `local_books` hiện có.

## 8. Thứ tự triển khai & mốc commit (mỗi mốc = 1 commit riêng, commit ngay khi xong)
1. `ai_service`: pdf_service (parse + chunk) + unit test nhanh bằng PDF mẫu.
2. `ai_service`: chroma_service hỗ trợ collection `document_chunks` (upsert/delete/query có filter).
3. `ai_service`: nâng pin `ollama`, sửa `ollama_service` (embed API mới, `think=False`, strip `<think>`), xác nhận `/search-books` vẫn chạy.
4. `ai_service`: endpoint `ingest-document` (202 + BackgroundTasks) + `ingest-status`
   + `document-index` DELETE + schemas. **Đo thực tế tốc độ ingest tại đây** (PDF vài
   chục trang và PDF dày) để chốt thông số chunk/top_k.
5. `ai_service`: endpoint `ask-document` + prompt + num_ctx.
6. backend: `StorageService.getBuffer` cho 2 provider.
7. backend: `/ai/ingest/:documentId` (+ `/status`) + `/ai/ask` proxy, kèm
   `assertCanAccessDocument` + guards RBAC (mục 5.2).
8. frontend: `ai.service.ts` dùng `/ai/ask` khi có doc context + map citations thật.
9. frontend: nút "Hỏi AI về tài liệu này" + chỉ báo chế độ theo-tài-liệu (+ trigger ingest nếu làm).
10. Kiểm thử end-to-end bằng 1 PDF thật qua curl + UI; cập nhật README ai_service.

## 9. Quy ước commit (yêu cầu bắt buộc từ chủ dự án)
- Mỗi phần việc rõ ràng hoàn thành → commit **ngay**, không dồn.
- Commit message **chỉ** mô tả thay đổi. **CẤM** mọi dòng dạng "Co-Authored-By",
  "Generated by/with Claude", hay bất kỳ đề cập nào tới Claude/AI trong message.

## 10. Rủi ro & giới hạn

### 10a. Quyết định: ingest chạy nền NGAY trong đợt này (không chờ đo thực tế)

Ước lượng trên GTX 960M: nomic-embed-text nhỏ (~270MB), mỗi chunk ~0,1–0,3s →
PDF vài chục trang (~100–200 chunk) khoảng **30–60 giây**, khó vượt 5 phút; nhưng
giáo trình 200–400 trang (~800–1.500 chunk) sẽ mất **nhiều phút** — là ca sử dụng
thật của thư viện. Điểm mấu chốt: thứ đắt đỏ khi đổi sau này không phải cơ chế chạy
nền (BackgroundTasks + dict status ~20 dòng) mà là **API contract + UX frontend**
(sync trả kết quả ngay ↔ async trả 202 rồi poll — đổi là phải sửa cả 3 tầng).
Vì vậy chốt contract async (202 + status endpoint) từ đầu; việc "đo thực tế" vẫn giữ
ở mốc 4 nhưng chỉ để tinh chỉnh chunk size/top_k/num_ctx, không để đổi kiến trúc.
Đổi lại chấp nhận: trạng thái ingest in-memory mất khi restart (có fallback đếm
chunk trong Chroma), và không có retry tự động khi ingest fail (user bấm ingest lại).

| Rủi ro | Ảnh hưởng | Giảm thiểu |
|---|---|---|
| GPU GTX 960M 4GB: qwen3:4b (Q4 ~2.6GB) + KV cache 8192 ctx có thể tràn VRAM → offload CPU | Trả lời chậm (chục giây/câu) | Giữ top_k=5, chunk 1.000 ký tự; nếu quá chậm hạ num_ctx 6144/4096 và top_k=3 |
| Embed tuần tự từng chunk qua Ollama | PDF 300 trang ≈ 800–1.200 chunk → ingest mất nhiều phút | Đã chốt xử lý nền + poll status (mục 10a) — không còn HTTP request treo; UI hiển thị tiến độ |
| Trạng thái ingest in-memory mất khi restart uvicorn; ingest fail giữa chừng không tự retry | Status "processing" mồ côi; index dở dang | Fallback đếm chunk trong Chroma; ingest là upsert + delete-before-ingest nên bấm ingest lại là sạch |
| PDF scan (ảnh, không text layer) | Không trích được gì | Trả `pages_indexed`/cảnh báo rõ trong response; OCR ngoài phạm vi |
| qwen3 thinking mode xả `<think>` vào answer | Câu trả lời lẫn rác | `think=False` + regex strip 2 lớp |
| Nâng pin `ollama` có breaking change (embeddings→embed) | `/search-books` hỏng | Mốc commit 3 tách riêng, test lại search cũ trước khi đi tiếp |
| Model 4B đôi khi trích sai trang / bịa | Sai lệch nội dung | Prompt ép "chỉ dựa trích đoạn, không bịa"; frontend luôn hiển thị snippet + trang thật từ Chroma (nguồn sự thật là retrieval, không phải model) |
| Chunk vắt qua mục/heading bị cắt ngữ cảnh | Trả lời thiếu ý | Overlap 150 ký tự giữa các chunk trong trang |
| ChromaDB collection phình to | Chậm query khi nhiều tài liệu | id ổn định + delete-before-ingest; filter theo document_id khi hỏi theo tài liệu |

## 11. Cách chạy stack khi triển khai (tham chiếu)
- ai_service: `ai_service/.venv/bin/uvicorn app.main:app --port 8000` (cwd `ai_service/`).
- Backend: port 3000, prefix `api/v1`; frontend: port 3001; Ollama: service hệ thống :11434.
- Containers: `ailibrary-postgres`, `ailibrary-redis`, `ailibrary-minio`.
- Smoke test hiện có: `curl -X POST http://localhost:3000/api/v1/ai/search -H "Content-Type: application/json" -d '{"query":"..."}'`.

---

## 12. Kế hoạch OCR cho PDF scan (đợt 2)

> Trạng thái: **ĐÃ TRIỂN KHAI — 2026-08-09 (tầng ai_service, chưa nối backend).**
> OCR fallback đã được cài vào `pdf_service.py` (`pypdfium2` render + `pytesseract`
> `vie`, `--psm 6`, DPI 200, ngưỡng chặn `MAX_OCR_PAGES=300`); thêm progress mịn
> theo trang (`pages_processed`, `stage` extracting/chunking/embedding, `pages_ocred`,
> `updated_at`) qua `ingest_registry.update_progress()`. Đã kiểm chứng E2E trên file
> scan 160 trang (`Nguyên lý của các hệ cơ sở dữ liệu phần 1`): 160/160 trang OCR,
> 437 chunk, trả lời đúng định nghĩa kèm `[trang 14]`. Chi tiết tham khảo mục 12.1–12.6
> (ghi chép khảo sát gốc vẫn giữ nguyên — số liệu ước lượng mục 12.4 khớp với đo thật:
> ~2.0–2.6s/trang OCR). Gói `tesseract-ocr-vie` đã có sẵn trên máy, không cần apt
> thêm.
> Mốc retrieval-fix HOÀN THÀNH 2026-08-10: tăng top_k=8 + Query Expansion
> qua qwen3 → giải quyết câu hỏi chung chung. OCR tiếng Anh: spec đã có,
> chưa triển khai (pending).

### 12.1 Hiện trạng code (đọc trực tiếp, không suy đoán)

- `ai_service/app/services/pdf_service.py`, hàm `extract_chunks()` (dòng 42–66):
  trích text từng trang bằng `page.extract_text()` ở **dòng 53**. Điểm chèn OCR
  fallback là ngay sau dòng 53, trước điều kiện `if len(text) < MIN_CHUNK_CHARS`
  ở **dòng 54** — khi `text` (sau `_normalize`) ngắn hơn `MIN_CHUNK_CHARS` (30
  ký tự, dòng 14), đó là lúc biết trang không có text layer và cần gọi OCR thay
  vì `continue`.
- Xác nhận bằng code: trang rỗng **không** làm cả file fail. Vòng lặp dòng 52–60
  dùng `continue` (dòng 56) để bỏ qua trang có `len(text) < MIN_CHUNK_CHARS`,
  không raise. `pages_with_text` (dòng 30, 49, 57) chỉ đếm trang có text — đây
  là biến đúng như mục 4.1 mô tả, **không phải** `pages_indexed` (tên đó không
  tồn tại trong code; response thực tế dùng `pages_with_text` — CLAUDE.md mục
  4.3 gọi nhầm là `pages_indexed`, ghi chú lại ở đây để không lặp lại nhầm lẫn).
- `app/routers/ai.py`:
  - Nền chạy tại hàm `_run_ingest()` (dòng 45–88), được `BackgroundTasks` gọi ở
    dòng 106 trong endpoint `ingest_document()`.
  - Status dict cập nhật qua `ingest_registry.update()` (module
    `app/services/ingest_registry.py`, dict in-memory `_statuses`, khóa bằng
    `threading.Lock`): `pages_total`/`pages_with_text`/`chunks_total` ghi 1 lần
    sau khi `extract_chunks()` xong (dòng 48–53); `chunks_indexed` ghi **theo
    từng batch** `EMBED_BATCH_SIZE=16` (dòng 66–84) — đây là điểm cập nhật tiến
    độ mịn nhất hiện có. OCR sẽ cần một điểm cập nhật tương tự nhưng **theo
    từng trang** (xem 12.5), vì OCR tốn thời gian ở bước render+nhận dạng từng
    trang, không phải ở bước embed.

### 12.2 Xác nhận file test là bản scan (số liệu thật)

File: `ai_service/test_docs/Nguyên lý của các hệ cơ sở dữ liệu phần 1 - Nguyễn Kim Anh.pdf`

Đọc bằng `pypdf.PdfReader`, gọi `page.extract_text()` trực tiếp (không qua
`extract_chunks`, để loại trừ ảnh hưởng của `_normalize`/`MIN_CHUNK_CHARS`):

| Trang | Số ký tự trích được |
|---|---|
| 1–5 | 0 (cả 5 trang) |
| 81–85 (giữa file) | 0 (cả 5 trang) |
| **Tổng 160/160 trang** | **0 ký tự toàn bộ file** (quét hết bằng vòng lặp, 0.08s) |

→ Xác nhận đây là **bản scan thuần ảnh, không có text layer** — đúng ca cần
OCR mà mục 4.1/7 loại trừ khỏi đợt 1. `mediabox` trang thân bài (VD trang 31)
là 595×841pt = khổ A4 chuẩn.

### 12.3 So sánh thư viện (tuân thủ 2 ràng buộc mục 4.1)

Kiểm tra môi trường thật (`ai_service/.venv`, `dpkg -l`, không cài gì mới):

| Gói | Đã có sẵn? | Nguồn |
|---|---|---|
| `pypdfium2` 5.11.0 | Có (venv) | dependency bắc cầu của `pdfplumber`, hiện không dùng trực tiếp |
| `onnxruntime` 1.27.0 | Có (venv) | dependency bắc cầu của `chromadb`, không liên quan OCR |
| `tesseract-ocr` 5.5.0 (binary) | Có (hệ thống, `/usr/bin/tesseract`) | chỉ có gói ngôn ngữ `eng` + `osd`, **chưa có `vie`** |
| `poppler-utils` 26.01.0 | Có (hệ thống) | dùng cho `pdf2image` nếu chọn hướng đó |
| `tesseract-ocr-vie` | **Chưa** | có sẵn trên apt (`1:4.1.0-2build1`), cần `apt install tesseract-ocr-vie` |
| `easyocr` | **Chưa** (không có gói pip nào của easyocr, chỉ có `onnxruntime` không liên quan) | cần `pip install easyocr` (kéo theo torch CPU, opencv, scikit-image...) |

**Render trang PDF → ảnh:**

| Phương án | License | Phụ thuộc hệ thống | Ghi chú |
|---|---|---|---|
| **`pypdfium2`** | BSD-3-Clause / Apache-2.0 (PDFium, Google) — không AGPL | **Không** — binary PDFium đóng gói sẵn trong wheel, đã có sẵn trong venv | Đo cục bộ: mở file 0.003s, render 1 trang @150dpi 0.17s, @200dpi 0.08s (trang thân bài A4) |
| `pdf2image` + poppler | MIT (wrapper) / GPL (poppler) — không AGPL, hợp lệ với ràng buộc (a) | **Có** — cần `poppler-utils` (đã có sẵn trên máy này, nhưng là phụ thuộc hệ thống thêm so với hiện trạng) | Không đo cục bộ; theo tài liệu công khai pypdfium2 nhanh hơn hoặc tương đương poppler, có nguồn tiệm cận tốc độ PyMuPDF ([nguồn](https://github.com/deepset-ai/haystack/issues/9320)) |

→ **`pypdfium2` thắng rõ** theo cả 2 ràng buộc: không AGPL, và **zero phụ thuộc
hệ thống mới** (đã nằm sẵn trong venv). Đề xuất chọn `pypdfium2`.

**OCR ảnh → text tiếng Việt:**

| Phương án | License | Phụ thuộc hệ thống | Độ chính xác tiếng Việt | GPU bắt buộc? | Dung lượng |
|---|---|---|---|---|---|
| `pytesseract` + `tesseract-ocr-vie` | Apache-2.0 | **Có** — cần `apt install tesseract-ocr-vie` (binary `tesseract-ocr` đã có sẵn, chỉ thiếu gói ngôn ngữ) — **điểm trừ so với ràng buộc (b)**, nhưng là apt-get 1 gói nhỏ, không phải build từ nguồn | Tài liệu công khai: >97% với font chuẩn (Times New Roman/Arial/Verdana/Courier New) đúng như văn bản học thuật scan; **yếu với dấu thanh trên font lạ/ảnh nghiêng, màu nền phức tạp** ([nguồn](https://vietunicode.sourceforge.net/howto/tesseract-ocr_vi.html)) | Không — chỉ CPU | ~10MB (nhẹ) |
| `easyocr` | Apache-2.0 | **Không** — thuần pip, nhưng kéo theo `torch` CPU + `opencv` + `scikit-image` (nặng hơn nhiều so với hiện trạng) | Mô hình deep learning, xử lý tốt ảnh nghiêng/font lạ hơn Tesseract theo benchmark công khai (82% vs 52% trên văn bản cong/nghiêng, [nguồn](https://gigagpu.com/paddleocr-vs-tesseract-vs-easyocr/)); độ chính xác dấu tiếng Việt cụ thể không có số liệu công khai đáng tin, cần tự đánh giá trên mẫu thật | Không bắt buộc, nhưng **chạy CPU** vì VRAM GTX 960M đã gần đầy (mục 10) — mất lợi thế tốc độ chính của easyocr | ~470MB+ trọng số tải lần đầu (detector + recognizer) |

→ Theo ràng buộc (b), `pytesseract` cần 1 gói apt nhỏ (`tesseract-ocr-vie`) —
đây là điểm trừ nhưng nhỏ so với `easyocr` kéo theo cả stack `torch` nặng hơn
nhiều lần dung lượng và runtime. Về tốc độ CPU, benchmark công khai xác nhận
Tesseract nhanh hơn EasyOCR ~2–3 lần trên CPU ([nguồn](https://medium.com/swlh/ocr-engine-comparison-tesseract-vs-easyocr-729be893d3ae)).
→ Đề xuất **`pytesseract` + `tesseract-ocr-vie`** làm phương án chính; `easyocr`
chỉ cân nhắc sau nếu đo thực tế trên mẫu thật cho thấy Tesseract sai dấu quá
nhiều để chấp nhận được.

### 12.4 Ước lượng thời gian

CPU máy này (`lscpu`): **Intel Core i5-6300HQ @ 2.30GHz, 4 nhân/4 luồng** (không
Hyper-Threading) — CPU laptop 2015, tương đối yếu cho workload CPU-bound.

**Đo cục bộ thật (không phải ước lượng)** — trang 31 (thân bài, A4 chuẩn),
`pypdfium2` render @200dpi + `tesseract` CLI trực tiếp (chỉ có gói `eng` cài
sẵn, dùng làm proxy tốc độ — gói `vie` chưa cài nên chưa đo được độ chính xác
dấu, chỉ đo được tốc độ vì kích thước traineddata `vie` tương đương `eng`):

| Bước | Thời gian đo thật |
|---|---|
| Render 1 trang @200dpi (`pypdfium2`) | 0.08s |
| OCR 1 trang thân bài, `--psm 6`, gói `eng` (`tesseract` CLI) | **1.8s (real time)** |

**Suy ra ước lượng** (KHÔNG đo trực tiếp `easyocr` vì không được cài thư viện
mới theo yêu cầu nhiệm vụ; số liệu dựa trên benchmark công khai ở mục 12.3):

| Phương án | Ước lượng / trang | Ước lượng tổng 160 trang (file mục 12.2) | Cơ sở |
|---|---|---|---|
| `pypdfium2` + `pytesseract` (`vie`) | ~1.9–2.5s (render + OCR, gói `vie` có thể chậm hơn `eng` do bảng ký tự lớn hơn) | **~7–9 phút** (OCR 5–6.5 phút + chunk/embed ~1.5 phút theo tốc độ đã đo ở mục ĐÃ DUYỆT: 210 chunk/81 trang ≈ 40s) | Đo cục bộ (render+OCR) + ngoại suy tuyến tính |
| `pypdfium2` + `easyocr` (CPU) | ~5.4–12.5s (gấp 3–7 lần Tesseract theo benchmark công khai) | **~16–35 phút** | Benchmark công khai (mục 12.3), KHÔNG đo cục bộ |

Với sách giáo trình dày hơn (400–800 trang, ca thực tế của thư viện) ngoại suy
tuyến tính: Tesseract ~18–35 phút, EasyOCR ~40 phút–1.5 giờ. Đây là ước lượng
ngoại suy, chưa đo thật trên file dày cỡ đó.

### 12.5 Rủi ro kiến trúc

- **BackgroundTasks in-process có chịu được job hàng giờ không?** Có, về mặt kỹ
  thuật — `BackgroundTasks` không có giới hạn thời lượng, và vì `ingest-document`
  đã trả 202 ngay (mục 10a), không có HTTP timeout nào áp lên job chạy nền.
  Nhưng: (1) `uvicorn --reload` (dev) sẽ **giết ngay lập tức** task đang chạy nền
  mỗi khi có file thay đổi — im lặng, không log lỗi rõ ràng phía client; (2)
  restart/deploy thủ công giữa chừng làm mất toàn bộ tiến độ chưa ghi (state
  in-memory mất, và theo cơ chế delete-before-ingest ở mục 4.2, lần chạy lại
  sẽ xóa sạch rồi làm lại từ đầu — với job vài phút (Tesseract) chấp nhận được
  như hiện trạng text, nhưng với job hàng chục phút (EasyOCR/sách dày) chi phí
  làm lại từ đầu bắt đầu đáng kể).
- **Status hiện tại đủ không?** Chưa đủ cho OCR nhiều phút. Các field hiện có
  (`pages_total`, `pages_with_text`, `chunks_total`, `chunks_indexed`) chỉ cập
  nhật ở 2 mốc: sau khi extract xong toàn bộ, và theo batch embed 16 chunk — cả
  hai đều xảy ra **sau khi OCR toàn bộ đã xong** trong luồng OCR (vì phải OCR
  hết mới có text để chunk). Người dùng sẽ thấy "processing" đứng yên nhiều
  phút không nhúc nhích. Đề xuất thêm: `pages_processed: int` (cập nhật ngay
  sau mỗi trang OCR xong, chèn tại điểm nêu ở mục 12.1), `stage: "rendering
  ocr"|"chunking"|"embedding"`, và `updated_at` (timestamp) để frontend phát
  hiện job có vẻ bị treo (uvicorn reload/crash) khi `updated_at` không đổi quá
  lâu — hiện tại không có cách nào phân biệt "đang OCR trang 50/160" với "job
  đã chết do bị kill".
- **Có nên đặt ngưỡng chặn hoặc OCR theo từng phần?** Đề xuất: có, nhưng ở mức
  tối thiểu cho đợt 2 — một ngưỡng chặn cứng (VD từ chối OCR nếu >300–500 trang,
  số cụ thể do chủ dự án quyết) để tránh job kéo dài hàng giờ chặn CPU. OCR
  "resumable" theo từng phần (lưu trang đã OCR xong, khi restart chỉ làm tiếp
  từ trang dở dang thay vì xóa sạch làm lại — đổi lại phải bỏ cơ chế
  delete-before-ingest hiện tại cho riêng luồng OCR) là giải pháp đúng hơn về
  lâu dài nhưng tốn công hơn; đề xuất **để dành cho đợt sau**, chỉ làm ngưỡng
  chặn cứng trước, trừ khi số liệu thực tế cho thấy nhiều tài liệu bị chặn bởi
  ngưỡng đó.
- **Có buộc phải đổi quyết định "không dùng queue/worker ngoài" ở mục 7
  không?** **Không.** Lý do: theo số liệu đo được ở mục 12.4, ca xấu nhất đo
  thật (Tesseract, 160 trang) chỉ ~7–9 phút — vẫn nằm trong khả năng chịu đựng
  của BackgroundTasks in-process như phân tích ở trên; các vấn đề thật sự (mất
  tiến độ khi restart, thiếu progress mịn, không có ngưỡng chặn) đều là vá hẹp
  (thêm field status, thêm ngưỡng trang) chứ không phải giới hạn kiến trúc của
  BackgroundTasks. `ailibrary-redis` đã có sẵn trong stack (mục 11) nên nếu sau
  này thật sự cần Celery/RQ thì chi phí hạ tầng thấp — nhưng đưa vào bây giờ là
  phức tạp hóa sớm cho một job lớp phút, đúng tinh thần quyết định gốc ở mục
  7/10a. Ngưỡng cần theo dõi lại: nếu `easyocr` hóa ra bắt buộc (vì Tesseract
  sai dấu quá nhiều) VÀ thư viện có nhiều sách 500–800+ trang, tổng thời gian
  ước lượng (mục 12.4) tiệm cận 1–1.5 giờ — ở ngưỡng đó, mất tiến độ khi
  restart giữa chừng trở nên tốn kém thật sự và OCR resumable (điểm trên)
  không còn là tùy chọn nữa.

### 12.6 Đề xuất tóm tắt

1. Render: `pypdfium2` (đã có sẵn trong venv, không phụ thuộc hệ thống mới).
2. OCR: `pytesseract` + `apt install tesseract-ocr-vie` làm phương án chính;
   đánh giá độ chính xác dấu tiếng Việt thật trên vài trang mẫu trước khi
   quyết định cuối — nếu không đạt, cân nhắc `easyocr` (chấp nhận chậm hơn
   2–3 lần và nặng hơn nhiều về dependency).
3. Giữ BackgroundTasks in-process (mục 7 không đổi), nhưng bổ sung: field
   status mịn hơn theo trang (`pages_processed`, `stage`, `updated_at`) và một
   ngưỡng chặn số trang tối đa cho OCR (số cụ thể cần chủ dự án chốt).
4. Việc "đo thực tế" ở đây mới ở mức 1 trang mẫu + benchmark công khai — trước
   khi triển khai thật cần đo `tesseract-ocr-vie` trên toàn bộ file 160 trang
   mục 12.2 để có số liệu tốc độ + độ chính xác dấu thật, không suy ngoại suy.

---

## 13. Cải thiện retrieval (2026-08-10)

Vấn đề: câu hỏi chung chung như "Cơ sở dữ liệu là gì?" → nomic-embed-text
không bắt đúng chunk. Đã thử: tăng top_k (5→8), two-stage rerank,
keyword search — đều không giải quyết vì từ khóa quá phổ biến.
Giải pháp cuối: Query Expansion — dùng qwen3 viết lại query thành cụm
tìm kiếm cụ thể trước khi embed. Chi phí thêm 1 lần gọi model (~2-3s).
Kết quả: hỏi "Cơ sở dữ liệu là gì?" → trả lời đúng [trang 7].

Cấu hình hiện tại: top_k=8, ASK_NUM_CTX=5120, SNIPPET_MAX_CHARS=400.

## 14. OCR tiếng Anh — auto-detect (HOÀN THÀNH — 2026-08-10)

> Trạng thái: **ĐÃ TRIỂN KHAI.** `extract_chunks()` tự động dò ngôn ngữ OCR:
> `_detect_ocr_lang()` render + OCR mẫu 3 trang đầu với `vie+eng`, đếm tỷ lệ
> ký tự tiếng Việt (`VIETNAMESE_CHARS`), >3% → `vie`, ngược lại → `eng`.
> Param `ocr_lang` thủ công đã bị xóa khỏi `extract_chunks()` và Form field
> của endpoint `ingest-document`. Log auto-detect hiển thị qua
> `logger.info("Auto-detected OCR language: ...")` (main.py đã thêm
> `logging.basicConfig(level=INFO)`). Unit test 11/11 pass (thêm
> `test_detect_ocr_lang_detects_vie/eng`). E2E đã kiểm chứng trên 2 file thật:
> file Việt scan 160 trang → log `vie` (268/2651 viet chars), 437 chunk; file
> Anh `Data Structures and Algorithms in Python ... (z-lib.org).pdf` (770 trang,
> 5 trang scan) → log `eng` (13/1977 viet chars), 2335 chunk, trả lời đúng
> "What is a heap data structure?" kèm `[trang 406]`. Backend NestJS
> `AiService.ingestDocument()` không cần gửi `ocr_lang` nữa — không đổi gì.
