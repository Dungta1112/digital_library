import ollama

from app.config import settings

SYSTEM_PROMPT = (
    "Bạn là trợ lý AI của thư viện số. Luôn luôn trả lời bằng tiếng Việt, "
    "ngắn gọn, chính xác, và chỉ dựa trên thông tin được cung cấp."
)

_client = ollama.Client(host=settings.ollama_base_url)


def chat(prompt: str) -> str:
    response = _client.chat(
        model=settings.ollama_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    )
    return response["message"]["content"]


def embed(text: str) -> list[float]:
    response = _client.embeddings(model=settings.ollama_embed_model, prompt=text)
    return response["embedding"]
