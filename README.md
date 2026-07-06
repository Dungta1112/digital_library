# 📚 AI Library — Thư viện số & Diễn đàn Học thuật

Hệ thống **Digital Library** và diễn đàn học thuật dành cho các cơ sở giáo dục, được xây dựng với:

| Thành phần | Công nghệ |
|---|---|
| **Backend** | NestJS 10, TypeScript 5, Prisma ORM |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **File Storage** | MinIO (S3-compatible) |
| **3D / Animation** | Three.js, React Three Fiber, GSAP, Framer Motion |

---

## 📋 Mục lục

- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt nhanh](#-cài-đặt-nhanh-quick-start)
- [Cài đặt chi tiết](#-cài-đặt-chi-tiết)
- [Khởi chạy ứng dụng](#-khởi-chạy-ứng-dụng)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [Chạy Test](#-chạy-test)
- [Biến môi trường (.env)](#-biến-môi-trường-env)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Docker — Quản lý dịch vụ](#-docker--quản-lý-dịch-vụ)
- [API Documentation](#-api-documentation)
- [Xử lý sự cố](#-xử-lý-sự-cố)

---

## 💻 Yêu cầu hệ thống

Đảm bảo máy tính của bạn đã cài đặt sẵn:

| Phần mềm | Phiên bản tối thiểu | Kiểm tra |
|---|---|---|
| **Node.js** | v18+ | `node -v` |
| **npm** | v9+ | `npm -v` |
| **Docker & Docker Compose** | Latest | `docker --version` |
| **Git** | Latest | `git --version` |

---

## 🐋 Hướng dẫn cài đặt Docker (Đặc biệt cho Windows)

Hệ thống yêu cầu Docker để chạy cơ sở dữ liệu (PostgreSQL, Redis, MinIO) mà không cần cài đặt phức tạp lên máy thật.

### Dành cho Windows (Đề xuất dùng Docker Desktop)

1. **Bật ảo hoá (Virtualization):**
   - Đảm bảo tính năng **Virtualization** đã được bật trong BIOS/UEFI. Bạn có thể kiểm tra bằng cách mở Task Manager -> Tab Performance -> CPU -> Nhìn chữ "Virtualization: Enabled".
2. **Cài đặt WSL 2 (Windows Subsystem for Linux):**
   - Mở PowerShell dưới quyền Admin (Run as Administrator) và gõ:
     ```powershell
     wsl --install
     ```
   - Khởi động lại máy tính nếu được yêu cầu.
3. **Tải và cài đặt Docker Desktop:**
   - Truy cập trang chủ: [Tải Docker Desktop cho Windows](https://docs.docker.com/desktop/install/windows-install/)
   - Chạy file `.exe` vừa tải về. Trong lúc cài đặt, đảm bảo đã tích chọn **"Use WSL 2 instead of Hyper-V"**.
   - Sau khi cài xong, mở ứng dụng Docker Desktop và chờ icon cá voi chuyển sang màu xanh (Engine running).
   - *Lưu ý:* Docker Desktop đã tích hợp sẵn **Docker Compose**, bạn không cần cài thêm.

### Dành cho macOS & Linux
- **macOS:** Tải Docker Desktop tương tự Windows tại trang chủ Docker.
- **Linux (Ubuntu):**
  ```bash
  sudo apt update
  sudo apt install docker.io docker-compose-v2
  sudo systemctl enable docker
  sudo systemctl start docker
  ```

---

## ⚡ Cài đặt nhanh (Quick Start)

Dành cho ai muốn chạy nhanh nhất có thể:

```powershell
# 1. Clone dự án
git clone <repository-url> ailibrary
cd ailibrary

# 2. Tạo file .env từ mẫu
copy .env.example .env

# 3. Khởi động PostgreSQL, Redis, MinIO qua Docker
docker compose up -d

# 4. Cài đặt dependencies + khởi tạo database (Backend)
npm install
npx prisma generate
npx prisma migrate dev
npm run seed

# 5. Cài đặt dependencies (Frontend)
cd frontend
npm install
cd ..

# 6. Chạy Backend (terminal 1)
npm run start:dev

# 7. Chạy Frontend (terminal 2)
cd frontend
npm run dev
```

✅ **Truy cập:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3000/api/v1 *(cần đổi PORT nếu trùng)*
- **Swagger Docs:** http://localhost:3000/docs
- **MinIO Console:** http://localhost:9001

---

## 🛠 Cài đặt chi tiết

### Bước 1: Clone dự án

```powershell
git clone <repository-url> ailibrary
cd ailibrary
```

### Bước 2: Thiết lập biến môi trường

Sao chép file cấu hình mẫu:

```powershell
copy .env.example .env
```

Mở file `.env` và tùy chỉnh các giá trị nếu cần. Xem phần [Biến môi trường](#-biến-môi-trường-env) để hiểu chi tiết từng biến.

> **⚠️ Quan trọng:** Trong môi trường **production**, bạn **bắt buộc** phải thay đổi `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, mật khẩu PostgreSQL, và mật khẩu MinIO.

### Bước 3: Khởi động dịch vụ hạ tầng (Docker)

Dự án sử dụng 3 dịch vụ bên ngoài, tất cả đều được cấu hình sẵn trong `docker-compose.yml`:

```powershell
docker compose up -d
```

Kiểm tra trạng thái các container:

```powershell
docker compose ps
```

Kết quả mong đợi:

```
NAME                 IMAGE                STATUS         PORTS
ailibrary-postgres   postgres:16-alpine   Up             0.0.0.0:5432->5432/tcp
ailibrary-redis      redis:7-alpine       Up             0.0.0.0:6379->6379/tcp
ailibrary-minio      minio/minio:latest   Up             0.0.0.0:9000-9001->9000-9001/tcp
```

Kiểm tra nhanh kết nối Redis:

```powershell
docker exec ailibrary-redis redis-cli ping
# Kết quả mong đợi: PONG
```

### Bước 4: Cài đặt Backend

```powershell
# Cài đặt tất cả dependencies
npm install
```

### Bước 5: Khởi tạo Database

```powershell
# Sinh Prisma Client từ schema
npx prisma generate

# Chạy migration để tạo bảng trong database
npx prisma migrate dev

# Chạy seed để tạo dữ liệu mẫu (roles, permissions, admin, categories)
npm run seed
```

> **📝 Ghi chú về Seed:** Lệnh `npm run seed` sẽ tự động tạo:
> - 5 vai trò: `GUEST`, `STUDENT`, `LECTURER`, `CONTENT_MANAGER`, `ADMIN`
> - 15 quyền hệ thống (documents, forum, groups, admin, statistics)
> - 1 tài khoản Admin mặc định
> - 6 danh mục tài liệu (Khoa học Máy tính, Vật lý, Toán học, ...)
> - Các cấu hình hệ thống mặc định

### Bước 6: Cài đặt Frontend

```powershell
cd frontend
npm install
cd ..
```

---

## 🚀 Khởi chạy ứng dụng

### Chạy Backend

```powershell
# Chế độ phát triển (tự động reload khi thay đổi code)
npm run start:dev

# Chế độ production
npm run build
node dist/main.js
```

Backend mặc định chạy tại **http://localhost:3000**.

### Chạy Frontend

Mở một **terminal mới**:

```powershell
cd frontend
npm run dev
```

Frontend mặc định chạy tại **http://localhost:3000** (Next.js sẽ tự chọn port khác nếu 3000 đã bị chiếm).

> **💡 Mẹo:** Nếu backend đang chiếm port 3000, frontend sẽ tự động chuyển sang port 3001. Hoặc bạn có thể đổi `PORT` trong `.env` của backend sang giá trị khác (ví dụ `3001`).

### Chạy cả hai cùng lúc

Mở **2 terminal** riêng biệt:

| Terminal | Lệnh | Mô tả |
|---|---|---|
| Terminal 1 | `npm run start:dev` | Backend NestJS |
| Terminal 2 | `cd frontend && npm run dev` | Frontend Next.js |

---

## 👤 Tài khoản mặc định

Sau khi chạy `npm run seed`, hệ thống tạo sẵn tài khoản admin:

| Thông tin | Giá trị |
|---|---|
| **Email** | `admin@example.edu` |
| **Mật khẩu** | `Admin123!` |
| **Vai trò** | `ADMIN` (toàn quyền) |

> Bạn có thể tùy chỉnh bằng biến môi trường `SEED_ADMIN_EMAIL` và `SEED_ADMIN_PASSWORD` **trước khi** chạy seed.

---

## 🧪 Chạy Test

```powershell
# Chạy tất cả test
npm run test

# Chỉ chạy Unit test
npm run test:unit

# Chỉ chạy Integration test
npm run test:integration

# Chỉ chạy Contract test
npm run test:contract
```

---

## 🔧 Biến môi trường (.env)

Dự án sử dụng file `.env` cho backend và `.env.local` cho frontend. Dưới đây là nội dung mẫu của file `.env.example` dành cho backend, bạn có thể copy và tạo thành file `.env` ở thư mục gốc:

```env
# ── Database (PostgreSQL) ────────────────────────────────────
DATABASE_URL=postgresql://postgres:123456@localhost:5432/ailibrary

# ── JWT Authentication ───────────────────────────────────────
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# ── File Storage (MinIO) ────────────────────────────────────
STORAGE_DRIVER=local
LOCAL_STORAGE_PATH=./storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=documents
MINIO_USE_SSL=false

# ── Redis Cache ──────────────────────────────────────────────
REDIS_URL=redis://localhost:6379
CACHE_ENABLED=false

# ── Server ───────────────────────────────────────────────────
PORT=3000
ALLOWED_HOSTS=*

# ── Seed (optional) ─────────────────────────────────────────
# SEED_ADMIN_EMAIL=admin@example.edu
# SEED_ADMIN_PASSWORD=Admin123!

# ── AI Service (Ollama - 8GB VRAM Optimized) ────────────────
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=qwen2.5:7b
OLLAMA_EMBED_MODEL=nomic-embed-text
AI_MAX_TOKENS=4096
AI_TEMPERATURE=0.7
AI_CONTEXT_WINDOW=4096
AI_TOP_K_RETRIEVAL=20
AI_TOP_K_CONTEXT=5
AI_RATE_LIMIT_STUDENT=10
AI_RATE_LIMIT_LECTURER=20
AI_RATE_LIMIT_ADMIN=0
AI_MAX_MESSAGE_LENGTH=2000
AI_SYSTEM_PROMPT="Bạn là trợ lý AI học thuật của Thư viện số. Trả lời chính xác bằng tiếng Việt, CHỈ dựa trên nội dung tài liệu được cung cấp trong CONTEXT. Nếu CONTEXT không đủ thông tin, hãy nói rõ. KHÔNG bịa thông tin. Luôn trích dẫn nguồn tài liệu."
```

### Chi tiết Frontend (`/frontend/.env.local`)

| Biến | Mô tả | Giá trị mặc định |
|---|---|---|
| `NEXT_PUBLIC_USE_MOCKS` | Dùng dữ liệu mock thay vì gọi API thật | `true` |
| `NEXT_PUBLIC_API_BASE_URL` | URL gốc của Backend API | `http://localhost:3000/api` |

---

## 📁 Cấu trúc dự án

```
ailibrary/
│
├── 📂 src/                          # ── Backend NestJS ──────────────
│   ├── main.ts                      # Entry point, Swagger setup
│   ├── app.module.ts                # Root module
│   ├── auth/                        # Xác thực (Login, Register, JWT)
│   ├── users/                       # Quản lý người dùng
│   ├── role-permission/             # Phân quyền RBAC
│   ├── library-document/            # Thư viện tài liệu
│   ├── lecturer-document-management/# Quản lý tài liệu giảng viên
│   ├── forum/                       # Diễn đàn học thuật
│   ├── study-group/                 # Nhóm học tập
│   ├── categories/                  # Danh mục tài liệu
│   ├── content-management/          # Kiểm duyệt nội dung
│   ├── admin-management/            # Quản trị hệ thống
│   ├── statistics/                  # Thống kê
│   ├── system-config/               # Cấu hình hệ thống
│   ├── storage/                     # Dịch vụ lưu trữ file (Local/MinIO)
│   ├── cache/                       # Redis cache layer
│   ├── config/                      # App config module
│   ├── prisma/                      # Prisma service
│   └── common/                      # Guards, Filters, Interceptors, Decorators
│
├── 📂 frontend/                     # ── Frontend Next.js ────────────
│   ├── src/
│   │   ├── app/                     # App Router (Pages & Layouts)
│   │   │   ├── (auth)/              # Đăng nhập / Đăng ký
│   │   │   ├── library/             # Thư viện tài liệu
│   │   │   ├── ai/                  # AI Chatbot
│   │   │   ├── forum/               # Diễn đàn
│   │   │   └── groups/              # Nhóm học tập
│   │   ├── components/              # React Components
│   │   │   ├── ui/                  # Components cơ bản (Button, Input, ...)
│   │   │   ├── layout/              # Navbar, Footer, Sidebar
│   │   │   └── feature/             # Components phức tạp (PDF Viewer, AI Chat)
│   │   ├── hooks/                   # Custom React Hooks
│   │   ├── services/                # API clients
│   │   ├── mocks/                   # Dữ liệu mock
│   │   ├── types/                   # TypeScript interfaces
│   │   └── utils/                   # Hàm tiện ích
│   └── public/                      # Static assets
│
├── 📂 prisma/                       # ── Database ────────────────────
│   ├── schema.prisma                # Định nghĩa schema (20+ models)
│   └── seed.ts                      # Dữ liệu khởi tạo
│
├── 📂 test/                         # ── Testing ─────────────────────
│   ├── unit/                        # Unit tests
│   ├── integration/                 # Integration tests
│   └── contract/                    # Contract tests
│
├── 📂 specs/                        # Tài liệu thiết kế
├── 📂 scripts/                      # Scripts tiện ích
│
├── docker-compose.yml               # Cấu hình Docker (Postgres, Redis, MinIO)
├── .env                             # Biến môi trường (backend)
├── .env.example                     # Mẫu biến môi trường
├── package.json                     # Dependencies backend
├── tsconfig.json                    # TypeScript config
├── nest-cli.json                    # NestJS CLI config
└── jest.config.ts                   # Jest test config
```

---

## 🐳 Docker — Quản lý dịch vụ

### Các container

| Container | Image | Port | Chức năng |
|---|---|---|---|
| `ailibrary-postgres` | `postgres:16-alpine` | `5432` | Database chính |
| `ailibrary-redis` | `redis:7-alpine` | `6379` | Cache & session |
| `ailibrary-minio` | `minio/minio:latest` | `9000` (API), `9001` (Console) | Lưu trữ file |

### Lệnh thường dùng

```powershell
# Khởi động tất cả dịch vụ
docker compose up -d

# Xem trạng thái
docker compose ps

# Xem logs realtime
docker compose logs -f                  # Tất cả
docker compose logs -f redis            # Chỉ Redis
docker compose logs -f postgres         # Chỉ PostgreSQL
docker compose logs -f minio            # Chỉ MinIO

# Dừng dịch vụ (giữ lại data)
docker compose down

# Dừng dịch vụ + xoá toàn bộ data volumes
docker compose down -v

# Khởi động lại 1 dịch vụ cụ thể
docker compose restart redis
```

### Truy cập MinIO Console

Mở trình duyệt tại **http://localhost:9001** và đăng nhập:

| Thông tin | Giá trị |
|---|---|
| **Username** | `minioadmin` |
| **Password** | `minioadmin123` |

Tại đây bạn có thể tạo bucket `documents` nếu chưa có, quản lý file, xem dung lượng, v.v.

---

## 📖 API Documentation

Khi backend đang chạy, truy cập **Swagger UI** tại:

👉 **http://localhost:3000/docs**

Swagger cung cấp tài liệu tương tác cho toàn bộ REST API, bao gồm:
- Auth (Login, Register, Refresh Token)
- Users, Roles & Permissions
- Library Documents
- Forum Posts & Comments
- Study Groups
- Content Moderation
- Admin Management
- Statistics
- System Config

---

## 🔥 Xử lý sự cố

### Port 5432 / 6379 / 9000 đã bị chiếm

```powershell
# Tìm process đang chiếm port (ví dụ 5432)
netstat -ano | findstr :5432

# Dừng process theo PID
taskkill /PID <PID> /F
```

Hoặc thay đổi port mapping trong `docker-compose.yml`:
```yaml
ports:
  - '5433:5432'   # Map sang port khác
```

Nhớ cập nhật `DATABASE_URL` trong `.env` cho phù hợp.

### Lỗi "Can't reach database server"

1. Kiểm tra Docker container đang chạy: `docker compose ps`
2. Kiểm tra `DATABASE_URL` trong `.env` khớp với thông tin trong `docker-compose.yml`
3. Thử restart container: `docker compose restart postgres`

### Lỗi Prisma migrate

```powershell
# Reset database (XOÁ TOÀN BỘ DỮ LIỆU)
npx prisma migrate reset

# Sau đó chạy lại seed
npm run seed
```

### Redis không kết nối được

1. Kiểm tra container: `docker exec ailibrary-redis redis-cli ping` → phải trả về `PONG`
2. Nếu không cần cache, đặt `CACHE_ENABLED=false` trong `.env`

### Frontend báo lỗi API

1. Kiểm tra biến `NEXT_PUBLIC_API_BASE_URL` trong `frontend/.env.local`
2. Nếu chưa có backend, đặt `NEXT_PUBLIC_USE_MOCKS=true` để dùng mock data

---

## 📜 License

Private project — All rights reserved.
