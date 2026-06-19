from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# Tải mô hình ngôn ngữ (hỗ trợ tốt tiếng Việt)
model = SentenceTransformer('keepitreal/vietnamese-sbert')

# Giả lập kho sách trong thư viện
BOOK_DATABASE = [
    {"id": 1, "title": "Nhập môn Lập trình Python", "description": "Sách hướng dẫn cơ bản về Python cho người mới bắt đầu, cú pháp đơn giản."},
    {"id": 2, "title": "Bảo mật thông tin và Mã hóa", "description": "Giới thiệu các thuật toán mã hóa, an toàn mạng và phòng chống hacker."},
    {"id": 3, "title": "Cấu trúc dữ liệu và Giải thuật", "description": "Sách chuyên sâu về cây nhị phân, đồ thị và các thuật toán tối ưu bằng Java."}
]

# Tạo sẵn vector cho kho sách
book_descriptions = [book["description"] for book in BOOK_DATABASE]
book_embeddings = model.encode(book_descriptions, convert_to_tensor=True)

class SearchRequest(BaseModel):
    query: str

@post("/api/ai/search-books")
def search_books(request: SearchRequest):
    # 1. Mã hóa câu hỏi của người dùng
    query_embedding = model.encode(request.query, convert_to_tensor=True)
    
    # 2. Tính toán độ tương đồng giữa câu hỏi và mô tả sách
    cos_scores = util.cos_sim(query_embedding, book_embeddings)[0]
    
    # 3. Lấy ra cuốn sách có điểm cao nhất
    best_match_idx = cos_scores.argmax().item()
    best_score = cos_scores[best_match_idx].item()
    
    # Nếu độ tương đồng > 0.4 thì coi như tìm thấy
    if best_score > 0.4:
        return {
            "suggested_book": BOOK_DATABASE[best_match_idx],
            "confidence": best_score
        }
    
    return {"message": "Không tìm thấy cuốn sách nào phù hợp."}