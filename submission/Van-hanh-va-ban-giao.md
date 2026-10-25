# Hướng dẫn vận hành và biên bản bàn giao

## 1. Thành phần

- Node.js 20 trở lên.
- Next.js 16, React 19.
- PostgreSQL 16 qua Docker Compose.
- Cổng web: 5000. Cổng PostgreSQL từ máy host: 5433.

## 2. Chạy local trên Windows

Tại thư mục project:

```powershell
npm install
npm run db:up
npm run dev
```

Mở `http://localhost:5000` cho khách và `http://localhost:5000/admin` cho trang nhân viên. Cấu hình kết nối nằm trong `.env.local`; file mẫu là `.env.example`.

## 3. Dữ liệu khởi tạo

`docker/postgres/init/01-init.sql` tạo bảng `tables`, `reservations`, chỉ mục theo số điện thoại/ngày giờ, bốn bàn T1–T4 và hai lượt đặt mẫu. Script init chỉ chạy khi PostgreSQL khởi tạo data directory trống lần đầu. Dữ liệu được giữ trong Docker volume `postgres_data`.

## 4. Lệnh thường dùng

```powershell
npm run db:up
npm run dev
npm run build
npm run start
npm run db:down
```

Không xóa volume database nếu cần giữ dữ liệu. Sao lưu PostgreSQL trước khi chuyển máy hoặc thay đổi môi trường.

## 5. Kiểm tra vận hành

1. Xác nhận container PostgreSQL đang chạy.
2. Mở `/` và kiểm tra danh sách bàn được tải.
3. Tạo một lượt đặt thử với bàn và thời gian còn trống.
4. Mở `/admin`, xác nhận lượt đặt xuất hiện ở trạng thái chờ.
5. Cập nhật trạng thái và tải lại trang để xác nhận dữ liệu đã lưu.
6. Thử tra cứu bằng số điện thoại đã dùng.

Các bước trên là hướng dẫn kiểm tra thủ công; chưa được thực hiện trong lần tạo tài liệu này.

## 6. Bảng thông tin bàn giao

| Hạng mục | Giá trị cần điền khi bàn giao |
|---|---|
| URL môi trường triển khai | ______________________________ |
| Commit bàn giao | ______________________________ |
| Người bàn giao / người nhận | ______________________________ |
| Ngày bàn giao | ______________________________ |
| Phiên bản Node.js / PostgreSQL | ______________________________ |
| Kết quả kiểm tra và bằng chứng | ______________________________ |
| Ghi chú / tồn tại đã biết | Tham chiếu `Bug-register.md` |

## 7. Xác nhận

| Vai trò | Họ tên | Chữ ký | Ngày |
|---|---|---|---|
| Người bàn giao |  |  |  |
| Người nhận bàn giao |  |  |  |
