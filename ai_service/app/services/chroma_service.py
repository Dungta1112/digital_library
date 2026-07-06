import chromadb

from app.config import settings

_client = chromadb.PersistentClient(path=settings.chroma_path)
_collection = _client.get_or_create_collection(name="local_books")


def add_documents(ids: list[str], embeddings: list[list[float]], metadatas: list[dict]) -> None:
    _collection.upsert(ids=ids, embeddings=embeddings, metadatas=metadatas)


def query(embedding: list[float], top_k: int) -> dict:
    return _collection.query(query_embeddings=[embedding], n_results=top_k)
