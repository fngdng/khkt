## Tóm tắt

| Phương thức | Đường dẫn | Mục đích |
|---|---|---|
| `GET` | `/api/tables` | Lấy danh sách bàn |
| `GET` | `/api/reservations` | Lấy danh sách đặt bàn (tùy chọn lọc theo số điện thoại) |
| `POST` | `/api/reservations` | Tạo đặt bàn mới |
| `PATCH` | `/api/reservations/:id` | Cập nhật trạng thái đặt bàn |

## Đối tượng dùng chung

**Bàn (`table`)**

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `id` | chuỗi | Ví dụ `T1` |
| `capacity` | số nguyên | Số chỗ |

**Đặt bàn (`reservation`)**

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `id` | số nguyên | Do database sinh |
| `customerName` | chuỗi | |
| `phone` | chuỗi | 10 chữ số, bắt đầu bằng 0 |
| `date` | chuỗi | `YYYY-MM-DD` |
| `time` | chuỗi | `HH:MM` |
| `durationMinutes` | số nguyên | Từ 30 trở lên |
| `partySize` | số nguyên | Từ 1 trở lên |
| `tableId` | chuỗi | Ví dụ `T2` |
| `status` | chuỗi | `pending`, `confirmed`, `arrived`, `cancelled` |

## Định dạng lỗi

Có hai dạng lỗi tùy nguồn gốc:

| Tình huống | Mã HTTP | Dạng phản hồi |
|---|---|---|
| Dữ liệu đặt bàn không hợp lệ hoặc không còn bàn phù hợp | 400 | `{ "ok": false, "errors": ["..."] }` |
| Trạng thái không hợp lệ (`PATCH`) | 400 | `{ "message": "Trạng thái không hợp lệ." }` |
| Không tìm thấy đặt bàn (`PATCH`) | 404 | `{ "message": "..." }` |
| Lỗi máy chủ hoặc database | 500 | `{ "message": "...", "details": "..." }` |

Lưu ý: trường `details` hiện chứa nguyên văn thông báo lỗi nội bộ (mục V05 trong [code-review.md](code-review.md)). JSON gửi lên bị hỏng hiện cũng trả 500.

---

## `GET /api/tables`

Trả về danh sách bàn, sắp theo sức chứa tăng dần.

**Phản hồi 200**

```json
{
  "tables": [
    { "id": "T1", "capacity": 2 },
    { "id": "T2", "capacity": 4 },
    { "id": "T3", "capacity": 6 },
    { "id": "T4", "capacity": 8 }
  ]
}
```

## `GET /api/reservations`

Trả về danh sách đặt bàn, sắp theo ngày, giờ, rồi `id`. Tham số tùy chọn:

| Tham số | Ý nghĩa |
|---|---|
| `phone` | Chỉ trả các đặt bàn có số điện thoại **khớp chính xác** |

Không có `phone` thì trả về **toàn bộ** đặt bàn (kể cả đã hủy).

**Ví dụ:** `GET /api/reservations?phone=0912345678`

**Phản hồi 200**

```json
{
  "reservations": [
    {
      "id": 1,
      "customerName": "Trần Minh",
      "phone": "0912345678",
      "date": "2026-10-17",
      "time": "18:00",
      "durationMinutes": 90,
      "partySize": 4,
      "tableId": "T2",
      "status": "pending"
    }
  ]
}
```

## `POST /api/reservations`

Tạo đặt bàn mới. Trạng thái ban đầu luôn là `pending`. Nếu không gửi `tableId`, hệ thống tự chọn bàn nhỏ nhất đủ chỗ và còn trống.

**Nội dung yêu cầu**

| Trường | Bắt buộc | Quy tắc |
|---|---|---|
| `customerName` | có | Tối thiểu 2 ký tự (sau khi cắt khoảng trắng) |
| `phone` | có | Khớp `^0\d{9}$` |
| `date` | có | Chuỗi ngày hợp lệ, nên dùng `YYYY-MM-DD` |
| `time` | có | `HH:MM` |
| `durationMinutes` | có | Số nguyên từ 30 trở lên |
| `partySize` | có | Số nguyên từ 1 trở lên |
| `tableId` | không | Mã bàn cụ thể; bỏ trống hoặc rỗng để tự chọn |

**Ví dụ yêu cầu**

```json
{
  "customerName": "Nguyễn Văn A",
  "phone": "0901234567",
  "date": "2026-10-20",
  "time": "19:00",
  "durationMinutes": 90,
  "partySize": 4
}
```

**Phản hồi 201**

```json
{
  "ok": true,
  "reservation": {
    "id": 3,
    "customerName": "Nguyễn Văn A",
    "phone": "0901234567",
    "date": "2026-10-20",
    "time": "19:00",
    "durationMinutes": 90,
    "partySize": 4,
    "tableId": "T2",
    "status": "pending"
  }
}
```

**Phản hồi 400 (ví dụ)**

```json
{
  "ok": false,
  "errors": [
    "Số điện thoại phải là số di động Việt Nam gồm 10 chữ số.",
    "Số lượng khách phải là số nguyên dương."
  ]
}
```

Các thông báo lỗi nghiệp vụ khác: bàn được chọn không tồn tại, bàn không đủ chỗ, bàn đã được đặt trong khung giờ đó, hoặc không có bàn phù hợp cho khung giờ yêu cầu.

## `PATCH /api/reservations/:id`

Cập nhật trạng thái của một đặt bàn.

**Nội dung yêu cầu**

```json
{ "status": "confirmed" }
```

`status` phải là một trong `pending`, `confirmed`, `arrived`, `cancelled`. API **không kiểm tra luồng chuyển trạng thái** (ví dụ vẫn cho đổi từ `cancelled` sang `arrived`).

**Phản hồi 200**

```json
{
  "ok": true,
  "reservation": {
    "id": 1,
    "customerName": "Trần Minh",
    "phone": "0912345678",
    "date": "2026-10-17",
    "time": "18:00",
    "durationMinutes": 90,
    "partySize": 4,
    "tableId": "T2",
    "status": "confirmed"
  }
}
```

**Phản hồi 404:** `{ "message": "Không tìm thấy đặt bàn cần cập nhật." }`

---

## Gọi thử từ dòng lệnh

**PowerShell**

```powershell
Invoke-RestMethod http://localhost:5000/api/tables

$body = @{
  customerName = "Nguyen Van A"; phone = "0901234567"; date = "2026-10-20"
  time = "19:00"; durationMinutes = 90; partySize = 4
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/reservations `
  -ContentType "application/json; charset=utf-8" -Body $body
```

**curl (Linux, macOS, Git Bash)**

```bash
curl http://localhost:5000/api/tables

curl -X PATCH http://localhost:5000/api/reservations/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}'
```
