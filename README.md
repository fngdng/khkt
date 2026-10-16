# Quản lý đặt bàn

Ứng dụng Next.js có giao diện admin, API đặt bàn và PostgreSQL.

## Chạy lần đầu

Yêu cầu Docker Desktop đang chạy và Node.js 20 trở lên.

1. Tạo file môi trường local từ cấu hình mẫu (hoặc dùng `.env.local` đã tạo):
   `Copy-Item .env.example .env.local`
2. Khởi động PostgreSQL và nạp schema cùng dữ liệu mẫu:
   `npm run db:up`
   PostgreSQL chạy ở `localhost:5433` (trong container dùng cổng 5432). Dữ liệu được giữ trong Docker volume `postgres_data`.
3. Cài dependencies nếu cần và chạy web:
   `npm install`
   `npm run dev`
4. Khách hàng đặt bàn và tra cứu tại `http://localhost:5000`. Trang admin ở `http://localhost:5000/admin`.

PostgreSQL image chạy script `docker/postgres/init/01-init.sql` khi khởi tạo volume lần đầu. Script tạo các bàn T1–T4 và hai đặt bàn mẫu. Nếu volume đã được khởi tạo trước đó, script init không chạy lại; xóa volume chỉ khi chủ động muốn tạo mới database.

## Tính năng admin

- Tạo đặt bàn mới; hệ thống kiểm tra xung đột và gán bàn phù hợp.
- Khách và nhân viên có thể chọn bàn cụ thể; server kiểm tra sức chứa và trùng lịch trước khi lưu, hoặc tự chọn bàn phù hợp.
- Đặt mới lưu vào database với trạng thái chờ duyệt.
- Duyệt, ghi nhận khách đã đến hoặc hủy đặt bàn; mọi thay đổi trạng thái được ghi xuống PostgreSQL.
- Tìm tất cả lượt đặt theo số điện thoại và hủy trực tiếp từ kết quả tra cứu.
- Sơ đồ bàn và danh sách được tải từ API/database.

Trang khách tại `/` không yêu cầu đăng nhập: khách có thể gửi yêu cầu đặt bàn và tra cứu trạng thái bằng đúng số điện thoại đã dùng. Trang `/admin` dành cho nhân viên duyệt, cập nhật trạng thái và hủy đặt bàn.

## Lệnh

- `npm run dev`: chạy web tại cổng 5000.
- `npm run build`: build ứng dụng.
- `npm run start`: chạy bản build tại cổng 5000.
- `npm run db:up` / `npm run db:down`: bật / tắt container PostgreSQL.
- `npm test`: chạy kiểm thử logic đặt bàn.
- `npm run lint`: lint mã nguồn.

## API

- `GET /api/tables`
- `GET /api/reservations` hoặc `GET /api/reservations?phone=0912345678`
- `POST /api/reservations`
- `PATCH /api/reservations/:id` với trạng thái `confirmed`, `arrived` hoặc `cancelled` (cũng chấp nhận `pending`).
