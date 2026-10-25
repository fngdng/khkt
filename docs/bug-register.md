# Sổ ghi nhận bug — Bếp Nhà

> **Lưu ý kiểm chứng:** các mục dưới đây được phát hiện khi rà mã nguồn, chưa được tái hiện trên môi trường chạy và chưa có ảnh/log bằng chứng. Trước khi nộp là bug đã xác nhận, nhóm cần chạy từng bước, ghi kết quả thực tế, môi trường, ngày phát hiện và người kiểm thử. Không dùng các mục `OOS` như lỗi chức năng thuộc đặc tả; đó là rủi ro/thiếu sót ngoài phạm vi chức năng hiện tại.

## Bug liên quan đến đặc tả (10 mục cần tái hiện)

| ID | Mức độ | Khu vực | Tình trạng |
|---|---|---|---|
| BUG-01 | Major | Tạo đặt bàn / ngày | Chờ tái hiện |
| BUG-02 | Major | Tạo đặt bàn / giờ | Chờ tái hiện |
| BUG-03 | Major | Kiểm tra ngày không hợp lệ | Chờ tái hiện |
| BUG-04 | Critical | Kiểm tra trùng lịch đồng thời | Chờ tái hiện |
| BUG-05 | Minor | Chọn bàn theo sức chứa | Chờ tái hiện |
| BUG-06 | Minor | Tra cứu trên trang admin | Chờ tái hiện |
| BUG-07 | Minor | Tạo nhiều lượt đặt từ admin | Chờ tái hiện |
| BUG-08 | Minor | Tra cứu bằng số điện thoại | Chờ tái hiện |
| BUG-09 | Minor | API cập nhật với mã đặt bàn sai | Chờ tái hiện |
| BUG-10 | Major | Chuyển trạng thái đặt bàn | Chờ tái hiện |

### BUG-01 — API nhận ngày đặt bàn đã qua

- **Bước tái hiện:** gửi `POST /api/reservations` với ngày hôm qua, giờ hợp lệ, số điện thoại hợp lệ, bàn còn chỗ.
- **Mong đợi:** từ chối ngày trong quá khứ và không ghi dữ liệu.
- **Dự đoán từ mã nguồn:** `validateReservationRequest` chỉ kiểm tra `Date.parse`, không so sánh với ngày hiện tại; yêu cầu có thể được chấp nhận.
- **Vị trí:** `src/reservationService.js`, kiểm tra `request.date`.

### BUG-02 — API nhận giờ đã qua trong ngày hiện tại

- **Bước tái hiện:** gửi đặt bàn cho ngày hôm nay nhưng chọn giờ đã qua.
- **Mong đợi:** báo giờ đặt bàn không hợp lệ và không tạo bản ghi.
- **Dự đoán từ mã nguồn:** giờ chỉ được kiểm tra định dạng `HH:MM`, không được so với thời gian hiện tại.
- **Vị trí:** `src/reservationService.js`, `parseTimeToMinutes` và `validateReservationRequest`.

### BUG-03 — Ngày lịch không tồn tại có thể vượt qua kiểm tra đầu vào

- **Bước tái hiện:** gửi ngày như `2026-02-30` qua API.
- **Mong đợi:** trả lỗi dữ liệu ngày không hợp lệ (HTTP 400), không trả lỗi máy chủ.
- **Dự đoán từ mã nguồn:** kiểm tra dùng `Date.parse`; cần xác nhận hành vi parse và phản hồi PostgreSQL trên môi trường chạy.
- **Vị trí:** `src/reservationService.js`, `validateReservationRequest`; `app/api/reservations/route.js`.

### BUG-04 — Hai yêu cầu đồng thời có thể giữ cùng một bàn

- **Bước tái hiện:** gửi đồng thời hai yêu cầu cho cùng bàn, ngày và khoảng giờ chồng lấn.
- **Mong đợi:** chỉ một yêu cầu được ghi; yêu cầu còn lại nhận lỗi xung đột.
- **Dự đoán từ mã nguồn:** API đọc danh sách hiện tại, kiểm tra khả dụng, rồi mới insert bằng truy vấn riêng; chưa có giao dịch/khóa ngăn race condition.
- **Vị trí:** `app/api/reservations/route.js` và `src/server/reservationRepository.js`.

### BUG-05 — Tăng số khách sau khi chọn bàn nhỏ không tự bỏ lựa chọn bàn

- **Bước tái hiện:** chọn bàn 2 chỗ, sau đó đổi số khách thành 4 và gửi form.
- **Mong đợi:** tự bỏ lựa chọn cũ hoặc yêu cầu chọn lại bàn hợp sức chứa trước khi gửi.
- **Dự đoán từ mã nguồn:** option trở thành disabled nhưng `form.tableId` không được đặt lại; server trả lỗi sức chứa.
- **Vị trí:** `app/components/CustomerPortal.jsx` và `app/components/ReservationManager.jsx`, `updateForm`/`handleChange`.

### BUG-06 — Tra cứu admin có thể lọc trên dữ liệu cũ

- **Bước tái hiện:** mở admin, tạo/cập nhật một đặt bàn từ phiên khác, rồi tra cứu số điện thoại trên phiên admin đang mở.
- **Mong đợi:** kết quả tra cứu lấy bản ghi mới nhất từ database.
- **Dự đoán từ mã nguồn:** `searchByPhone` gọi `loadData()` nhưng bỏ qua dữ liệu trả về, sau đó lọc state `reservations` cũ.
- **Vị trí:** `app/components/ReservationManager.jsx`, `searchByPhone`.

### BUG-07 — Form admin xóa ngày sau khi tạo một đặt bàn

- **Bước tái hiện:** tạo đặt bàn thành công trong admin, sau đó thử tạo lượt thứ hai mà không nhập lại ngày.
- **Mong đợi:** ngày trở về hôm nay hoặc được giữ để nhập nhanh lượt tiếp theo.
- **Dự đoán từ mã nguồn:** sau khi thành công, form được đặt thành `DEFAULT_FORM` có `date: ''`; input ngày bắt buộc nên không thể gửi tiếp.
- **Vị trí:** `app/components/ReservationManager.jsx`, `DEFAULT_FORM` và `handleSubmit`.

### BUG-08 — Tra cứu không khớp số điện thoại có dấu cách/gạch nối

- **Bước tái hiện:** tra cứu cùng số đã đặt nhưng nhập theo dạng `0912 345 678` hoặc `0912-345-678`.
- **Mong đợi:** chuẩn hóa về 10 chữ số và tìm được lượt đặt.
- **Dự đoán từ mã nguồn:** giao diện chỉ `trim()` hai đầu chuỗi; repository so khớp chính xác `phone = $1`.
- **Vị trí:** `app/components/CustomerPortal.jsx`, `searchReservations`; `src/server/reservationRepository.js`, `getReservations`.

### BUG-09 — Mã đặt bàn không phải số có thể trả lỗi 500

- **Bước tái hiện:** gửi `PATCH /api/reservations/abc` với trạng thái hợp lệ.
- **Mong đợi:** trả HTTP 400 hoặc 404 với thông báo mã đặt bàn không hợp lệ.
- **Dự đoán từ mã nguồn:** route đổi `id` thành `Number(id)` nhưng không kiểm tra `NaN` trước truy vấn PostgreSQL; lỗi có thể bị trả thành HTTP 500.
- **Vị trí:** `app/api/reservations/[id]/route.js`.

### BUG-10 — API cho phép chuyển trạng thái không hợp lệ theo vòng đời đặt bàn

- **Bước tái hiện:** đặt một lượt thành `cancelled`, sau đó gửi `PATCH` đổi lại `confirmed` hoặc chuyển thẳng từ `pending` sang `arrived`.
- **Mong đợi:** chỉ cho phép các bước chuyển trạng thái mà nghiệp vụ quy định.
- **Dự đoán từ mã nguồn:** route chỉ kiểm tra status nằm trong tập giá trị hợp lệ, không kiểm tra trạng thái hiện tại và quy tắc chuyển tiếp.
- **Vị trí:** `app/api/reservations/[id]/route.js`, `ALLOWED_STATUS`.

## Ngoài đặc tả — rủi ro cần nhóm/giảng viên xác nhận (3 mục)

| ID | Rủi ro | Vì sao ngoài đặc tả hiện có | Tình trạng |
|---|---|---|---|
| OOS-01 | Trang `/admin` chưa yêu cầu đăng nhập | Charter chưa định nghĩa xác thực nhân viên; cần chốt có bổ sung vào phạm vi không. | Chưa kiểm thử quyền truy cập |
| OOS-02 | API `GET /api/reservations` không có `phone` trả danh sách đầy đủ, gồm tên và số điện thoại | API phục vụ admin nhưng hiện chưa có phân quyền; yêu cầu bảo vệ dữ liệu chưa được đặc tả. | Chưa kiểm thử truy cập ngoài UI |
| OOS-03 | API đặt/cập nhật chưa có giới hạn tần suất hoặc chống gửi tự động | Rate limit/anti-bot chưa nằm trong tiêu chí MVP hiện tại. | Chưa kiểm thử tải/abuse |

## Bằng chứng kiểm thử

| ID | Môi trường / build | Kết quả thực tế | Ảnh hoặc log | Người kiểm thử / ngày |
|---|---|---|---|---|
| Điền sau khi tái hiện |  |  |  |  |
