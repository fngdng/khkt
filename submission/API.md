# Tài liệu API — Bếp Nhà

Base path: `/api`. Request/response JSON trừ khi ghi khác. API được triển khai trong Next.js App Router.

## `GET /api/tables`

Trả danh sách bàn sắp theo sức chứa.

```json
{"tables":[{"id":"T1","capacity":2}]}
```

Lỗi cơ sở dữ liệu: HTTP 500 với `message` và hiện tại có thể kèm `details`.

## `GET /api/reservations`

Trả danh sách đặt bàn theo ngày, giờ tăng dần. Tham số tùy chọn `phone` lọc chính xác số điện thoại.

```json
{"reservations":[{"id":1,"customerName":"Nguyễn An","phone":"0912345678","date":"2026-10-30","time":"18:00","durationMinutes":90,"partySize":2,"tableId":"T1","status":"pending"}]}
```

`GET /api/reservations?phone=0912345678` dùng cho tra cứu khách và lọc nhân viên. Hiện API không yêu cầu xác thực; lưu ý quyền riêng tư trong `Bug-register.md`.

## `POST /api/reservations`

Tạo lượt đặt. `tableId` tùy chọn; nếu bỏ qua, server tự chọn bàn phù hợp.

```json
{
  "customerName":"Nguyễn An",
  "phone":"0912345678",
  "date":"2026-10-30",
  "time":"18:00",
  "durationMinutes":90,
  "partySize":2,
  "tableId":"T1"
}
```

Thành công: HTTP 201, `{"ok":true,"reservation":{...}}`. Dữ liệu sai hoặc không có bàn phù hợp: HTTP 400, `{"ok":false,"errors":["..."]}`. Lỗi không xử lý: HTTP 500.

## `PATCH /api/reservations/{id}`

Cập nhật trạng thái. Giá trị được chấp nhận: `pending`, `confirmed`, `arrived`, `cancelled`.

```json
{"status":"confirmed"}
```

Thành công: HTTP 200, `{"ok":true,"reservation":{...}}`. ID không tìm thấy: HTTP 404. Trạng thái không hợp lệ: HTTP 400. Lỗi khác: HTTP 500.

## Mã trạng thái

| HTTP | Ý nghĩa |
|---|---|
| 200 | Đọc/cập nhật thành công |
| 201 | Tạo lượt đặt thành công |
| 400 | Dữ liệu gửi lên không hợp lệ hoặc không có bàn phù hợp |
| 404 | Không tìm thấy lượt đặt |
| 500 | Lỗi máy chủ hoặc cơ sở dữ liệu |

## Lưu ý triển khai

Các hành vi trên ghi nhận API hiện tại. API hiện chưa có phân trang, xác thực, giới hạn tần suất, kiểm soát chuyển trạng thái, chuẩn hóa số điện thoại hoặc hợp đồng lỗi thống nhất cho JSON sai định dạng.
