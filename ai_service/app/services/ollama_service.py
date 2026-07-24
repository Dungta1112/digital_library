import re

import ollama

from app.config import settings

SYSTEM_PROMPT = (
    "Bạn là trợ lý AI của thư viện số. Luôn luôn trả lời bằng tiếng Việt, "
    "ngắn gọn, chính xác, và chỉ dựa trên thông tin được cung cấp."
)

_client = ollama.Client(host=settings.ollama_base_url)

# Phòng hờ model reasoning xả thẻ <think> vào nội dung trả lời.
_THINK_RE = re.compile(r"<think>.*?</think>\s*", re.DOTALL)


def chat(prompt: str, num_ctx: int | None = None) -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]
    options = {"num_ctx": num_ctx} if num_ctx else None
    # Không truyền think=False: với qwen3, server để mặc định sẽ tách phần suy luận
    # vào message.thinking và content sạch; think=False lại làm model suy luận
    # thẳng vào content (đã kiểm chứng trên Ollama 0.31.1).
    response = _client.chat(model=settings.ollama_model, messages=messages, options=options)
    return _THINK_RE.sub("", response["message"]["content"]).strip()


def embed(text: str) -> list[float]:
    return embed_batch([text])[0]


def embed_batch(texts: list[str]) -> list[list[float]]:
    response = _client.embed(model=settings.ollama_embed_model, input=texts, keep_alive="30s")
    return [list(e) for e in response["embeddings"]]
