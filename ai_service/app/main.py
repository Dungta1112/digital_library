import logging

from fastapi import FastAPI

from app.routers.ai import router as ai_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Digital Library AI Service")
app.include_router(ai_router)


@app.get("/health")
def health():
    return {"status": "ok"}
