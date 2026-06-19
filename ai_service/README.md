AI Library Service (FastAPI + Ollama + ChromaDB)
This is a lightweight, high-performance Microservice built with FastAPI to power the Semantic Search (Smart Book Search) feature of the Digital Library system. It operates fully local and offline using Ollama for vector embeddings and ChromaDB as the vector database.

🏗️ Architecture & Technology Stack
Framework: FastAPI (Python 3.10+)

LLM Engine (Local AI): Ollama (Running nomic-embed-text)

Vector Database: ChromaDB (Persistent local storage)

Containerization: Docker & Docker Compose

📂 Project Structure
Plaintext
ai_service/
├── app/
│   └── main.py          # FastAPI application & core AI logic
├── chroma_db/           # Persistent Vector Database directory (auto-generated)
├── Dockerfile           # Docker configuration for Python environment
└── requirements.txt     # Python dependencies (Ollama, ChromaDB, FastAPI)
🚀 Getting Started (Local Setup)
1. Prerequisites
Make sure you have Ollama installed on your host machine. Download it from ollama.com.

Open your host terminal and pull the required embedding model:

Bash
ollama pull nomic-embed-text
2. Deployment via Docker Compose
From the root directory of the digital_library project, run the following command to spin up the entire system:

Bash
docker-compose up --build
The AI Service container will automatically bridge to the host machine via host.docker.internal:11434 to access Ollama.

🔌 API Endpoints
Once the container is up and running, you can access the interactive Swagger API documentation at: http://localhost:8000/docs

1. Synchronize / Vectorize Books
Endpoint: POST /api/ai/sync-books

Description: Triggered by the Node.js backend whenever new books are added or during system initialization. It converts textual data into vector embeddings and stores them in ChromaDB.

Payload Example:

JSON
[
  {
    "id": "1",
    "title": "Data Structures and Algorithms",
    "description": "An advanced guide focusing on binary trees, graphs, and optimization."
  }
]
2. Semantic Book Search
Endpoint: POST /api/ai/search-books

Description: Accepts a natural language query from the user, vectorizes it, and queries ChromaDB to find the most contextually relevant books.

Payload Example:

JSON
{
  "query": "books about advanced trees and sorting algorithms",
  "top_k": 3
}
🛠️ Docker Network Configuration Notes
To allow the isolated Docker container to communicate with Ollama running on your Windows/macOS host machine, the service includes the following configuration in the root docker-compose.yml:

YAML
extra_hosts:
  - "host.docker.internal:host-gateway"
environment:
  - OLLAMA_HOST=http://host.docker.internal:11434