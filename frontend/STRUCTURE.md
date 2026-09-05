# 📚 Tài liệu Cấu trúc chi tiết Frontend (Next.js & React 19)

Tài liệu này giải thích chi tiết cấu trúc thư mục, chức năng của từng thư mục, các tệp cấu hình chính và nguyên lý vận hành của mã nguồn **Frontend** thuộc dự án **AI Library**.

---

## 📂 1. Cây thư mục tổng quan

```text
frontend/
├── 📂 public/                  # Các tài nguyên tĩnh (ảnh, favicon, mô hình 3D...)
├── 📂 src/
│   ├── 📂 app/                  # Các Trang và Định tuyến (Pages & App Router)
│   ├── 📂 components/           # Các Component giao diện (UI, Layout, Features)
│   ├── 📂 hooks/                # Các React Custom Hooks quản lý trạng thái
│   ├── 📂 mocks/                # Dữ liệu giả lập cho việc chạy offline/test
│   ├── 📂 services/             # Lớp dịch vụ tương tác API hoặc Mock Data
│   ├── 📂 types/                # Các định nghĩa kiểu TypeScript
│   └── 📂 utils/                # Các hàm tiện ích dùng chung
├── .gitignore                   # Quy tắc bỏ qua tệp tin của Git
├── .prettierrc                  # Cấu hình định dạng mã nguồn Prettier
├── eslint.config.mjs            # Cấu hình kiểm tra lỗi mã nguồn ESLint
├── next.config.ts               # Tệp cấu hình chính của Next.js
├── package.json                 # Quản lý thư viện phụ thuộc và mã scripts chạy
├── postcss.config.mjs           # Cấu hình tiền xử lý CSS PostCSS
├── tsconfig.json                # Cấu hình biên dịch TypeScript
└── STRUCTURE.md                 # Tệp tài liệu này
```

---

## ⚙️ 2. Các tệp cấu hình chính tại thư mục gốc

*   **`package.json`**:
    *   *Chức năng*: Khai báo các thư viện phụ thuộc chính bao gồm **Next.js 16**, **React 19**, **Three.js** (đồ họa 3D), **GSAP & Framer Motion** (hoạt ảnh chuyển động), **Lenis** (hiệu ứng cuộn mượt), **Lucide React & Phosphor Icons** (các icon).
    *   *Scripts*: `npm run dev` (chạy môi trường phát triển trên cổng `3001`), `npm run build` (đóng gói production), `npm run start` (chạy production bundle).
*   **`next.config.ts`**:
    *   *Chức năng*: Định nghĩa các tùy chỉnh vận hành của Next.js (như cho phép Turbopack, khai báo cấu hình IP mạng nội bộ qua `allowedDevOrigins`, v.v.).
*   **`tsconfig.json`**:
    *   *Chức năng*: Định nghĩa trình biên dịch TypeScript và các đường dẫn tắt (Alias pathing như `@/*` trỏ về thư mục `src/*`).

---

## 📁 3. Chi tiết cấu trúc bên trong thư mục `src`

### 3.1. Thư mục Định tuyến (`src/app`)

Sử dụng cơ chế định tuyến của Next.js App Router (định tuyến dựa trên cấu trúc thư mục chứa tệp `page.tsx`).

*   **`layout.tsx`**: Khung layout dùng chung cho toàn bộ website (chứa `html`, `body` và tích hợp `ThemeProvider`, `Navbar`, `Footer`).
*   **`page.tsx`**: Trang chủ (Landing page). Sử dụng hiệu ứng cuộn mượt `SmoothScroll` và tích hợp các Section quảng bá tính năng từ thư mục `components/feature/Home`.
*   **`globals.css`**: Nơi import Tailwind CSS v4, thiết lập màu nền/màu chữ của theme Light/Dark và định nghĩa các `@keyframes` cho hiệu ứng bay lơ lửng của các thành phần đồ họa.
*   **`favicon.ico`**: Icon đại diện của trang web hiển thị trên tab trình duyệt.
*   **📂 `(auth)/`**: Group định tuyến (không xuất hiện trên URL nhờ dấu ngoặc đơn).
    *   `login/page.tsx`: Giao diện đăng nhập hệ thống.
    *   `register/page.tsx`: Giao diện đăng ký tài khoản (hỗ trợ chọn vai trò Student/Lecturer).
*   **📂 `admin/`**: Dashboard dành riêng cho vai trò quản trị viên.
    *   `page.tsx`: Thống kê tổng quan hệ thống và danh sách công việc cần làm.
    *   *Các tiểu mục quản trị*: Quản lý danh sách thành viên (khóa/mở tài khoản, cấp lại vai trò), phê duyệt tài liệu số, kiểm duyệt bài viết diễn đàn và tùy chỉnh tham số hệ thống.
*   **📂 `ai/`**: Trang trợ lý học thuật AI.
    *   `page.tsx`: Giao diện trò chuyện (chatbot), hiển thị lịch sử chat, tìm kiếm ngữ nghĩa, và hiển thị phần trích dẫn nguồn từ tài liệu số.
*   **📂 `forum/`**: Diễn đàn trao đổi học thuật.
    *   `page.tsx`: Danh sách câu hỏi, chủ đề thảo luận có phân loại.
    *   `[id]/page.tsx`: Trang chi tiết bài đăng và danh sách bình luận (có nút chọn câu trả lời đúng từ tác giả).
*   **📂 `groups/`**: Nhóm nghiên cứu & học tập.
    *   `page.tsx`: Danh sách các nhóm công khai hoặc nhóm người dùng đã tham gia.
    *   `[id]/page.tsx`: Không gian làm việc riêng của nhóm (chia sẻ tài liệu nhóm, chat nhóm, bài đăng nội bộ nhóm).
*   **📂 `library/`**: Kho thư viện tài liệu số.
    *   `page.tsx`: Catalog tài liệu với bộ lọc theo danh mục, thanh tìm kiếm.
    *   `document/[id]/page.tsx`: Chi tiết tài liệu, hiển thị tài liệu dạng PDF trực quan, đánh giá số sao, ghi chú cá nhân và lịch sử xem của người dùng.
*   **📂 `my-documents/`**: Quản lý tài liệu cá nhân.
    *   `page.tsx`: Danh sách tài liệu do chính người dùng tải lên kèm theo trạng thái duyệt (Đang chờ duyệt, Đã duyệt, Bị từ chối).
*   **📂 `profile/`**: Quản lý thông tin tài khoản cá nhân.
*   **📂 `settings/`**: Cài đặt thông số giao diện và cấu hình bảo mật tài khoản.

---

### 3.2. Thư mục Linh kiện giao diện (`src/components`)

Được phân loại theo cấp độ tái sử dụng:

*   **📂 `ui/` (Các linh kiện nguyên tử/thành phần cơ sở)**:
    *   `Button.tsx`: Nút bấm đa năng với các biến thể (primary, secondary, danger, ghost, loading...).
    *   `Input.tsx`: Ô nhập dữ liệu biểu mẫu chuẩn hóa.
    *   `Skeleton.tsx`: Hiệu ứng hiển thị giả lập dữ liệu đang tải (Loading shimmer).
    *   `ErrorBoundary.tsx`: Bộ bắt lỗi React để bảo vệ ứng dụng khỏi sập giao diện khi có lỗi component con.
*   **📂 `layout/` (Bố cục cấu trúc)**:
    *   `Navbar.tsx`: Thanh điều hướng phía trên của trang web, tự động ẩn/hiện tùy vai trò người dùng, hỗ trợ responsive hoàn toàn trên mobile.
    *   `Footer.tsx`: Chân trang hiển thị thông tin bản quyền và liên kết ngoài.
    *   `ThemeProvider.tsx`: Component cung cấp Context quản lý chế độ giao diện sáng/tối (Dark/Light).
    *   `ThemeToggle.tsx`: Nút chuyển đổi nhanh Dark/Light mode với animation.
    *   `SmoothScroll.tsx`: Thành phần kích hoạt thư viện Lenis giúp cuộn trang mượt mà hơn.
*   **📂 `feature/` (Linh kiện gắn liền với nghiệp vụ)**:
    *   `Home3DScene.tsx`: Sử dụng React Three Fiber để hiển thị một cuốn sách 3D xoay tự động trong không gian. Tự phát hiện thiết bị di động để hạ cấp xuống hình ảnh 2D nhằm tiết kiệm pin/RAM.
    *   `Home/`: Chứa các phần của trang chủ: `HeroSection`, `HomeProblems`, `HomeSolution`, `HomeFeatures`, `HomeAIShowcase`, `HomeDocuments`, `HomeForum`, `HomeGroups`, `HomeHowItWorks`, `HomeAudience`, `HomeTrust`, `HomeCTA`.
    *   `Library/`: PDFViewer (đọc tài liệu trực tuyến), ReviewList, DocumentCard.
    *   `AI/`: AIChatInput, AIChatHistory, AICitationSource.
    *   `Forum/`: ForumPostCard, CommentSection, CreatePostModal.
    *   `Group/`: GroupCard, ShareDocumentModal, GroupPostList.
    *   `Admin/`: UserManagementTable, PendingDocTable, SystemConfigForm.

---

### 3.3. Thư mục Hooks tùy chỉnh (`src/hooks`)

*   **`useAuth.tsx`**: Khởi tạo và cung cấp phiên làm việc của người dùng. Lưu Token vào localStorage và đồng bộ hóa trạng thái tài khoản trên mọi Component.
*   **`usePermissions.ts`**: Kiểm tra nhanh quyền hạn của người dùng để quyết định có hiển thị một nút chức năng hoặc trang cụ thể hay không.
*   **`useScrollTrigger.ts`**: Lắng nghe sự kiện cuộn màn hình để kích hoạt các hiệu ứng hoạt ảnh động.

---

### 3.4. Thư mục Lớp dịch vụ API (`src/services`)

Lớp xử lý trao đổi dữ liệu với máy chủ:
*   **`api.client.ts`**: Khởi tạo cấu hình Axios dùng chung. Đính kèm `access_token` vào tiêu đề (Header). Tự động phát hiện lỗi token hết hạn và thực hiện yêu cầu cấp lại tự động (silent refresh) bằng `refresh_token` mà người dùng không hề hay biết.
*   **`auth.service.ts`**: Gọi các API login, register, logout, forgot-password.
*   **`library.service.ts`**: Gọi các API tìm tài liệu, lấy danh mục, lấy chi tiết tài liệu.
*   **`ai.service.ts`**: Gọi API lấy lịch sử chat và gửi tin nhắn tới AI.
*   **`forum.service.ts`**: Gọi các API về diễn đàn (bài viết, bình luận, upvote).
*   **`group.service.ts`**: Tương tác với API nhóm học tập.
*   **`admin.service.ts`**: Gửi yêu cầu quản trị hệ thống của ADMIN.

---

### 3.5. Thư mục Khai báo kiểu TypeScript (`src/types`)

Đảm bảo tính chặt chẽ về dữ liệu (Type-safety):
*   `auth.ts`: Định nghĩa kiểu dữ liệu `User` và các token thông tin.
*   `library.ts`: Kiểu dữ liệu `Document`, `DocumentCategory`, `DocumentFile`, `Rating`, `Note`.
*   `forum.ts`: Kiểu dữ liệu `Post`, `Comment`.
*   `group.ts`: Kiểu dữ liệu `StudyGroup`, `GroupMember`, `GroupPost`.
*   `ai.ts`: Kiểu dữ liệu `AIChatMessage`, `Citation`.
*   `admin.ts`: Kiểu dữ liệu `SystemStats`, `AdminUserRecord`, `SystemConfig`.

---

### 3.7. Thư mục Tiện ích dùng chung (`src/utils`)

*   **`rbac.ts`**: Khai báo ma trận phân quyền phía Client. Bản đồ phân bổ quyền hạn chi tiết cho từng vai trò (`GUEST`, `STUDENT`, `LECTURER`, `CONTENT_MANAGER`, `ADMIN`) tương ứng với các thao tác trên giao diện để phối hợp với hook `usePermissions` kiểm tra quyền của người dùng nhanh chóng trước khi gọi API của Backend.
