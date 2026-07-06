from fastapi import APIRouter

from app.schemas import (
    BookIn,
    SearchBooksResponse,
    SearchRequest,
    SearchResultItem,
    SyncBooksResponse,
)
from app.services import chroma_service, ollama_service

router = APIRouter(prefix="/api/ai", tags=["AI"])


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
