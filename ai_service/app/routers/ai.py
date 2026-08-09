from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile

from app.schemas import (
    AskRequest,
    AskResponse,
    BookIn,
    DeleteIndexResponse,
    IngestAccepted,
    IngestStatusResponse,
    SearchBooksResponse,
    SearchRequest,
    SearchResultItem,
    SourceChunk,
    SyncBooksResponse,
)
from app.services import chroma_service, ingest_registry, ollama_service, pdf_service

router = APIRouter(prefix="/api/ai", tags=["AI"])

EMBED_BATCH_SIZE = 16
ASK_NUM_CTX = 4096
SNIPPET_MAX_CHARS = 300


@router.post("/sync-books", response_model=SyncBooksResponse)
def sync_books(books: list[BookIn]):
    ids = []
    embeddings = []
    metadatas = []
    for book in books:
        full_text = f"Tên sách: {book.title}. Nội dung mô tả: {book.description or ''}"
        ids.append(book.id)
        embeddings.append(ollama_service.embed(full_text))
        metadatas.append({"title": book.title, "description": book.description or ""})

    if ids:
        chroma_service.add_documents(ids=ids, embeddings=embeddings, metadatas=metadatas)

    return SyncBooksResponse(
        status="success",
        message=f"Đã số hóa {len(books)} cuốn sách.",
    )


def _run_ingest(document_id: str, title: str, pdf_bytes: bytes) -> None:
    try:
        def on_page_done(page_num: int):
            ingest_registry.update_progress(
                document_id,
                pages_processed=page_num,
                stage="extracting",
            )

        result = pdf_service.extract_chunks(pdf_bytes, on_page_progress=on_page_done)
        ingest_registry.update_progress(document_id, stage="chunking")
        ingest_registry.update(
            document_id,
            pages_total=result.pages_total,
            pages_with_text=result.pages_with_text,
            chunks_total=len(result.chunks),
            pages_ocred=result.pages_ocred,
        )
        if not result.chunks:
            ingest_registry.update(
                document_id,
                state="failed",
                error="Không trích được text từ PDF (có thể là bản scan không có text layer).",
            )
            return

        # Xóa index cũ của chính tài liệu này trước khi ghi lại từ đầu.
        chroma_service.delete_document_chunks(document_id)

        ingest_registry.update_progress(document_id, stage="embedding")
        indexed = 0
        for i in range(0, len(result.chunks), EMBED_BATCH_SIZE):
            batch = result.chunks[i : i + EMBED_BATCH_SIZE]
            embeddings = ollama_service.embed_batch([c.text for c in batch])
            chroma_service.upsert_chunks(
                ids=[f"{document_id}:{c.page}:{c.chunk_index}" for c in batch],
                embeddings=embeddings,
                documents=[c.text for c in batch],
                metadatas=[
                    {
                        "document_id": document_id,
                        "title": title,
                        "page": c.page,
                        "chunk_index": c.chunk_index,
                    }
                    for c in batch
                ],
            )
            indexed += len(batch)
            ingest_registry.update(document_id, chunks_indexed=indexed)

        ingest_registry.update(document_id, state="done")
    except Exception as exc:  # noqa: BLE001 - trạng thái failed phải ghi nhận mọi lỗi
        ingest_registry.update(document_id, state="failed", error=str(exc))


@router.post("/ingest-document", status_code=202, response_model=IngestAccepted)
async def ingest_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    document_id: str = Form(...),
    title: str = Form(...),
):
    if ingest_registry.is_processing(document_id):
        raise HTTPException(status_code=409, detail="Tài liệu này đang được xử lý.")

    pdf_bytes = await file.read()
    if not pdf_service.is_readable_pdf(pdf_bytes):
        raise HTTPException(status_code=400, detail="File không phải PDF hợp lệ.")

    ingest_registry.start(document_id)
    background_tasks.add_task(_run_ingest, document_id, title, pdf_bytes)
    return IngestAccepted(status="processing", document_id=document_id)


@router.get("/ingest-status/{document_id}", response_model=IngestStatusResponse)
def ingest_status(document_id: str):
    status = ingest_registry.get(document_id)
    if status is not None:
        return IngestStatusResponse(
            document_id=document_id,
            state=status.state,
            pages_total=status.pages_total,
            pages_with_text=status.pages_with_text,
            chunks_total=status.chunks_total,
            chunks_indexed=status.chunks_indexed,
            error=status.error,
            pages_processed=status.pages_processed,
            stage=status.stage,
            pages_ocred=status.pages_ocred,
            updated_at=status.updated_at,
        )

    # Registry mất khi restart: fallback đếm chunk đã có trong Chroma.
    count = chroma_service.count_document_chunks(document_id)
    if count > 0:
        return IngestStatusResponse(
            document_id=document_id, state="done", chunks_total=count, chunks_indexed=count
        )
    return IngestStatusResponse(document_id=document_id, state="not_found")


@router.delete("/document-index/{document_id}", response_model=DeleteIndexResponse)
def delete_document_index(document_id: str):
    count = chroma_service.count_document_chunks(document_id)
    if count > 0:
        chroma_service.delete_document_chunks(document_id)
    return DeleteIndexResponse(status="deleted", document_id=document_id, chunks_deleted=count)


@router.post("/ask-document", response_model=AskResponse)
def ask_document(request: AskRequest):
    query_vector = ollama_service.embed(request.query)
    results = chroma_service.query_chunks(
        query_vector, top_k=request.top_k, document_id=request.document_id
    )

    sources: list[SourceChunk] = []
    chunk_texts: list[str] = []
    if results["ids"] and results["ids"][0]:
        for i in range(len(results["ids"][0])):
            meta = results["metadatas"][0][i]
            text = results["documents"][0][i]
            chunk_texts.append(text)
            sources.append(
                SourceChunk(
                    document_id=meta["document_id"],
                    title=meta["title"],
                    page=meta["page"],
                    chunk_index=meta["chunk_index"],
                    snippet=text[:SNIPPET_MAX_CHARS],
                    distance=results["distances"][0][i],
                )
            )

    if not sources:
        return AskResponse(
            query=request.query,
            answer=(
                "Chưa có dữ liệu nội dung cho tài liệu này trong hệ thống. "
                "Hãy ingest tài liệu trước khi hỏi."
            ),
            sources=[],
        )

    title = sources[0].title
    excerpts = "\n\n".join(
        f"[{i + 1}] (trang {s.page}) {text}"
        for i, (s, text) in enumerate(zip(sources, chunk_texts))
    )
    prompt = (
        f'Dưới đây là các trích đoạn từ tài liệu "{title}":\n\n'
        f"{excerpts}\n\n"
        f"Câu hỏi: {request.query}\n\n"
        "Chỉ dựa vào các trích đoạn trên để trả lời. Khi dùng thông tin từ trích đoạn nào, "
        "ghi rõ nguồn dạng [trang N]. Nếu các trích đoạn không chứa thông tin để trả lời, "
        "nói rõ là không tìm thấy trong tài liệu — tuyệt đối không bịa."
    )
    answer = ollama_service.chat(prompt, num_ctx=ASK_NUM_CTX)

    return AskResponse(query=request.query, answer=answer, sources=sources)


@router.post("/search-books", response_model=SearchBooksResponse)
def search_books(request: SearchRequest):
    query_vector = ollama_service.embed(request.query)
    results = chroma_service.query(query_vector, top_k=request.top_k)

    suggested_books: list[SearchResultItem] = []
    if results["ids"] and results["ids"][0]:
        for i in range(len(results["ids"][0])):
            suggested_books.append(
                SearchResultItem(
                    id=results["ids"][0][i],
                    title=results["metadatas"][0][i]["title"],
                    description=results["metadatas"][0][i]["description"],
                    distance=results["distances"][0][i],
                )
            )

    if suggested_books:
        context = "\n".join(f"- {b.title}: {b.description}" for b in suggested_books)
        prompt = (
            f"Câu hỏi của người dùng: {request.query}\n\n"
            f"Các tài liệu tìm được trong thư viện:\n{context}\n\n"
            "Hãy tổng hợp một câu trả lời ngắn gọn, hữu ích cho người dùng "
            "dựa trên các tài liệu trên."
        )
        answer = ollama_service.chat(prompt)
    else:
        answer = "Không tìm thấy tài liệu phù hợp trong thư viện."

    return SearchBooksResponse(
        query=request.query,
        answer=answer,
        results=suggested_books,
    )
