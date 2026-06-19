from fastapi import FastAPI
from pydantic import BaseModel
import ollama
import chromadb

app = FastAPI(title="Digital Library AI Service với Ollama")

# 1. Khởi tạo ChromaDB lưu local
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="local_books")

class BookData(BaseModel):
    id: str
    title: str
    description: str

class SearchRequest(BaseModel):
    query: str
    top_k: int = 3

# API số hóa sách dùng Ollama Embedding
@app.post("/api/ai/sync-books")
def sync_books(books: list[BookData]):
    for book in books:
        full_text = f"Tên sách: {book.title}. Nội dung mô tả: {book.description}"
        
        # Gọi Ollama local để sinh Vector Embedding
        response = ollama.embeddings(model="nomic-embed-text", prompt=full_text)
        vector_embedding = response["embedding"]
        
        # Lưu vào ChromaDB
        collection.upsert(
            ids=[book.id],
            embeddings=[vector_embedding],
            metadatas=[{"title": book.title, "description": book.description}]
        )
    return {"status": "success", "message": f"Ollama đã số hóa {len(books)} cuốn sách."}

# API Tìm kiếm sách thông minh bằng Ollama
@app.post("/api/ai/search-books")
def search_books(request: SearchRequest):
    # Biến câu hỏi của user thành Vector bằng chính model nomic-embed-text
    query_response = ollama.embeddings(model="nomic-embed-text", prompt=request.query)
    query_vector = query_response["embedding"]
    
    # Truy vấn tìm sách có nghĩa gần nhất
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=request.top_k
    )
    
    suggested_books = []
    if results['ids'] and results['ids'][0]:
        for i in range(len(results['ids'][0])):
            suggested_books.append({
                "id": results['ids'][0][i],
                "title": results['metadatas'][0][i]['title'],
                "description": results['metadatas'][0][i]['description'],
                "distance": results['distances'][0][i]
            })
            
    return {"query": request.query, "results": suggested_books}