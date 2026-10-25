# SRS — Đặc tả yêu cầu phần mềm

## 1. Tổng quan

Bếp Nhà là ứng dụng web Next.js với giao diện React và API JSON. API lưu thông tin đặt bàn trong PostgreSQL. Ứng dụng chạy cổng 5000; PostgreSQL chạy cổng 5433 trên máy host (5432 trong container).

## 2. Vai trò và quyền hiện có

Trang khách tại `/` và trang nhân viên tại `/admin`. Hiện không có đăng nhập/kiểm tra vai trò ở giao diện hay API. Đây là giới hạn bảo mật được theo dõi trong sổ bug; mô tả dưới đây không khẳng định trang admin đã được bảo vệ.

## 3. Mô hình dữ liệu

### Bàn (`tables`)

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | TEXT | Khóa chính |
| capacity | INTEGER | Bắt buộc, lớn hơn 0 |

### Lượt đặt (`reservations`)

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | SERIAL | Khóa chính |
| customer_name | TEXT | Bắt buộc |
| phone | VARCHAR(10) | Bắt buộc; service yêu cầu 10 chữ số bắt đầu bằng 0 |
| reservation_date | DATE | Bắt buộc |
| reservation_time | TIME | Bắt buộc |
| duration_minutes | INTEGER | Bắt buộc, tối thiểu 30 |
| party_size | INTEGER | Bắt buộc, số nguyên dương |
| table_id | TEXT | Bắt buộc, khóa ngoại tới `tables.id` |
| status | TEXT | `pending`, `confirmed`, `arrived`, `cancelled` |
| created_at / updated_at | TIMESTAMPTZ | Mặc định thời điểm hiện tại |

## 4. Quy tắc nghiệp vụ

- BR-01: tên khách sau khi cắt khoảng trắng đầu/cuối phải có ít nhất 2 ký tự.
- BR-02: số điện thoại đúng dạng `0` và 9 chữ số tiếp theo.
- BR-03: số khách là số nguyên dương; thời lượng là số nguyên từ 30 phút.
- BR-04: ngày phải được JavaScript phân tích thành ngày hợp lệ; giờ theo `HH:MM` trong ngày.
- BR-05: bàn được chọn phải tồn tại và có sức chứa ít nhất bằng số khách.
- BR-06: hai lượt đặt cùng bàn trong cùng ngày không được giao nhau; lượt `cancelled` không tham gia kiểm tra trùng.
- BR-07: nếu khách không chỉ định bàn, hệ thống chọn bàn phù hợp có sức chứa nhỏ nhất trước.
- BR-08: lượt tạo mới lưu trạng thái `pending`.

## 5. Yêu cầu chức năng

| Mã | Yêu cầu |
|---|---|
| FR-01 | Khách xem danh sách bàn và sức chứa. |
| FR-02 | Khách gửi lượt đặt với tên, điện thoại, ngày, giờ, thời lượng, số khách và bàn tùy chọn. |
| FR-03 | Hệ thống xác thực dữ liệu, kiểm tra sức chứa và xung đột trước khi lưu. Lỗi nghiệp vụ trả HTTP 400. |
| FR-04 | Khách tra cứu lượt đặt bằng số điện thoại; giao diện hiển thị trạng thái, thời gian, số khách và bàn. |
| FR-05 | Khách có thao tác hủy lượt từ kết quả tra cứu. |
| FR-06 | Nhân viên xem danh sách, lọc theo ngày/trạng thái/số điện thoại, xem sơ đồ bàn và tải lại dữ liệu. |
| FR-07 | Nhân viên tạo lượt đặt tại quầy, chọn bàn hoặc tự động gán bàn. |
| FR-08 | Nhân viên cập nhật trạng thái sang xác nhận, khách đã đến hoặc hủy. |
| FR-09 | Nhân viên xem các số liệu tổng quan: lượt hôm nay, lượt chờ xác nhận và tổng sức chứa. |

## 6. Yêu cầu chất lượng

- NFR-01: API chỉ trả dữ liệu cần thiết cho người gọi và không đưa chi tiết lỗi nội bộ ra phản hồi công khai.
- NFR-02: kiểm tra lịch và ghi lượt đặt phải bảo đảm không đặt trùng bàn khi có nhiều yêu cầu đồng thời.
- NFR-03: thao tác nhân viên và hủy lượt cần được giới hạn cho người có quyền tương ứng.
- NFR-04: giao diện tiếng Việt, responsive và có phản hồi thành công/lỗi cho thao tác.

## 7. Luồng chính: đặt bàn

1. Khách nhập thông tin và có thể chọn bàn cụ thể.
2. Trình duyệt gửi `POST /api/reservations`.
3. Server tải bàn/lượt hiện có, kiểm tra dữ liệu, sức chứa và xung đột.
4. Nếu có bàn phù hợp, server lưu lượt ở trạng thái `pending`, trả HTTP 201.
5. Nếu dữ liệu không hợp lệ hoặc không còn bàn phù hợp, server trả HTTP 400 cùng danh sách lỗi.

## 8. Luồng nhân viên

1. Mở `/admin`; trang tải danh sách đặt và bàn.
2. Nhân viên có thể lọc danh sách và tạo lượt mới.
3. Từ lượt `pending`, nhân viên xác nhận; có thể đánh dấu khách đã đến hoặc hủy.
4. Giao diện tải lại dữ liệu sau khi cập nhật.

## 9. Ma trận truy vết

| User story | Yêu cầu |
|---|---|
| US-01 | FR-02, FR-03 |
| US-02 | FR-03 |
| US-03 | FR-04 |
| US-04 | FR-05 |
| US-05 | FR-06, FR-09 |
| US-06 | FR-07 |
| US-07 | FR-08 |

## 10. Giới hạn

Các yêu cầu nghiệp vụ này được dựng từ hành vi hiện có và mục tiêu sản phẩm hiển thị. Chưa có xác nhận từ chủ sản phẩm về giờ hoạt động, xác thực nhân viên, quy trình xác minh khách, giới hạn kích thước nhóm, hay chính sách hủy; cần chốt các điểm đó để dùng làm đặc tả nghiệm thu cuối cùng.
