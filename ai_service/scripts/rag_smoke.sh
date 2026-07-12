#!/usr/bin/env bash
# Test cục bộ luồng Document RAG của ai_service (không qua NestJS/storage).
#
# Cách dùng:
#   ./scripts/rag_smoke.sh ingest /duong/dan/file.pdf [document_id] [tieu_de]
#       Ingest file PDF cục bộ rồi poll trạng thái tới khi xong.
#   ./scripts/rag_smoke.sh ask "cau hoi cua ban" [document_id]
#       Hỏi theo tài liệu đã ingest, in câu trả lời + nguồn (trang, trích đoạn).
#   ./scripts/rag_smoke.sh status [document_id]
#       Xem trạng thái ingest hiện tại.
#   ./scripts/rag_smoke.sh clean [document_id]
#       Gỡ index của tài liệu khỏi ChromaDB.
#
# document_id mặc định: test-doc-1. Cần jq. Đổi địa chỉ service qua AI_SERVICE_URL.
set -euo pipefail

BASE_URL="${AI_SERVICE_URL:-http://localhost:8000}"
DEFAULT_DOC_ID="test-doc-1"

cmd="${1:-}"

case "$cmd" in
  ingest)
    pdf_path="${2:?Thiếu đường dẫn PDF. Dùng: $0 ingest file.pdf [document_id] [tieu_de]}"
    doc_id="${3:-$DEFAULT_DOC_ID}"
    title="${4:-$(basename "$pdf_path" .pdf)}"

    echo ">> Ingest '$pdf_path' (document_id=$doc_id, title=$title)"
    curl -sf -X POST "$BASE_URL/api/ai/ingest-document" \
      -F "file=@$pdf_path;type=application/pdf" \
      -F "document_id=$doc_id" \
      -F "title=$title" | jq .

    echo ">> Poll trạng thái (Ctrl-C để dừng theo dõi, ingest vẫn chạy tiếp)..."
    while true; do
      status_json=$(curl -sf "$BASE_URL/api/ai/ingest-status/$doc_id")
      state=$(echo "$status_json" | jq -r .state)
      echo "$status_json" | jq -c '{state, pages_total, pages_with_text, chunks_indexed, chunks_total, error}'
      if [ "$state" = "done" ]; then
        echo ">> Ingest XONG. Hỏi thử: $0 ask \"cau hoi\" $doc_id"
        break
      fi
      if [ "$state" = "failed" ] || [ "$state" = "not_found" ]; then
        echo ">> Ingest THẤT BẠI." >&2
        exit 1
      fi
      sleep 3
    done
    ;;

  ask)
    question="${2:?Thiếu câu hỏi. Dùng: $0 ask \"cau hoi\" [document_id]}"
    doc_id="${3:-$DEFAULT_DOC_ID}"

    echo ">> Hỏi (document_id=$doc_id): $question"
    response=$(curl -sf -X POST "$BASE_URL/api/ai/ask-document" \
      -H "Content-Type: application/json" \
      -d "$(jq -n --arg q "$question" --arg d "$doc_id" '{query: $q, document_id: $d, top_k: 5}')")

    echo "--- TRẢ LỜI ---"
    echo "$response" | jq -r .answer
    echo "--- NGUỒN (kiểm tra đúng trang/đúng nội dung) ---"
    echo "$response" | jq -r '.sources[] | "  [trang \(.page)] (distance \(.distance | .*1000 | round / 1000)) \(.snippet | gsub("\n"; " ") | .[0:160])..."'
    ;;

  status)
    doc_id="${2:-$DEFAULT_DOC_ID}"
    curl -sf "$BASE_URL/api/ai/ingest-status/$doc_id" | jq .
    ;;

  clean)
    doc_id="${2:-$DEFAULT_DOC_ID}"
    curl -sf -X DELETE "$BASE_URL/api/ai/document-index/$doc_id" | jq .
    ;;

  *)
    grep '^#' "$0" | sed 's/^# \{0,1\}//' | head -14
    exit 1
    ;;
esac
