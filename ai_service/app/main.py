from fastapi import FastAPI

app = FastAPI(title="Digital Library AI Service")


@app.get("/health")
def health():
    return {"status": "ok"}
