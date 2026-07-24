# Dữ liệu giả lập cho frontend

Thư mục này dùng khi chạy frontend mà chưa có backend hoặc database.

## Bật chế độ mock

Thêm vào `.env.local`:

```env
NEXT_PUBLIC_USE_MOCKS=true
```

Sau khi đổi biến môi trường, cần khởi động lại `npm run dev`.

## Tài khoản đăng nhập demo

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Sinh viên | `student@ailibrary.local` | `12345678` |
| Giảng viên | `lecturer@ailibrary.local` | `12345678` |
| Quản trị viên | `admin@ailibrary.local` | `12345678` |

## Chức năng từng file

- `auth.json`: tài khoản dùng để đăng nhập thử.
- `library.json`: tài liệu, tác giả, chuyên mục và đường dẫn PDF.
- `forum.json`: bài viết và bình luận diễn đàn.
- `group.json`: thông tin nhóm và thành viên.
- `group-messages.json`: tin nhắn của từng nhóm.
- `ai.json`: lịch sử mở đầu của trợ lý AI.
- `admin.json`: thống kê, người dùng, tài liệu chờ duyệt, báo cáo và cấu hình.

## Cách sửa dữ liệu

1. Giữ nguyên tên các thuộc tính đang có vì component và TypeScript đang sử dụng chúng.
2. Mỗi `id` nên là duy nhất.
3. Ngày giờ dùng định dạng ISO, ví dụ `2026-06-28T08:30:00Z`.
4. Khi thêm loại dữ liệu mới, cập nhật type trong `src/types` trước rồi mới cập nhật service.
5. Các thao tác tạo, sửa, xóa trong mock chỉ được lưu trong bộ nhớ và sẽ trở về dữ liệu JSON ban đầu khi reload ứng dụng.
