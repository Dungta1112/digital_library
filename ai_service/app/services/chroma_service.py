import chromadb

from app.config import settings

_client = chromadb.PersistentClient(path=settings.chroma_path)

# Collection sách: 1 vector/cuốn từ title + mô tả (luồng search-books cũ).
_books = _client.get_or_create_collection(name="local_books")

# Collection chunk nội dung: nhiều vector/tài liệu, lưu kèm nguyên văn chunk.
_chunks = _client.get_or_create_collection(name="document_chunks")


def add_documents(ids: list[str], embeddings: list[list[float]], metadatas: list[dict]) -> None:
    _books.upsert(ids=ids, embeddings=embeddings, metadatas=metadatas)


def query(embedding: list[float], top_k: int) -> dict:
    return _books.query(query_embeddings=[embedding], n_results=top_k)


def upsert_chunks(
    ids: list[str],
    embeddings: list[list[float]],
    documents: list[str],
    metadatas: list[dict],
) -> None:
    _chunks.upsert(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)


def delete_document_chunks(document_id: str) -> None:
    _chunks.delete(where={"document_id": document_id})


def count_document_chunks(document_id: str) -> int:
    result = _chunks.get(where={"document_id": document_id}, include=[])
    return len(result["ids"])


def query_chunks(embedding: list[float], top_k: int, document_id: str | None = None) -> dict:
    where = {"document_id": document_id} if document_id else None
    return _chunks.query(
        query_embeddings=[embedding],
        n_results=top_k,
        where=where,
        include=["documents", "metadatas", "distances"],
    )
