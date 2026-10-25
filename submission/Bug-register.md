# Sổ bug — Bếp Nhà

**Nguồn ghi nhận:** rà soát mã nguồn, chưa chạy tái hiện. Mục B-01 đến B-10 được ánh xạ vào baseline yêu cầu trong `SRS.md`. Mục OOS-01 đến OOS-03 nằm ngoài baseline tính năng hiện tại, nên được ghi là đề xuất/backlog để nhóm xác nhận, không trình bày như lỗi đã chứng minh.

## Bug trong phạm vi đặc tả (10)

| ID | Mức độ | Liên kết yêu cầu | Tiêu đề / bước tái hiện | Kết quả hiện tại | Kết quả mong đợi |
|---|---|---|---|---|---|
| B-01 | Critical | NFR-01, FR-04 | Gọi `GET /api/reservations` không truyền `phone`. | API trả toàn bộ tên, số điện thoại và lịch đặt cho người gọi công khai. | Khách chỉ đọc được dữ liệu sau bước xác minh; nhân viên phải xác thực và được phân quyền. |
| B-02 | Critical | NFR-03, FR-05 | Gửi `PATCH /api/reservations/{id}` với `{"status":"cancelled"}` mà không đăng nhập. | API cho cập nhật lượt đặt theo ID mà không xác minh quyền sở hữu hay vai trò. | Chỉ chủ lượt đặt đã xác minh hoặc nhân viên được phân quyền mới được hủy. |
| B-03 | Critical | NFR-03, FR-08 | Gửi `PATCH` cập nhật trạng thái mà không có phiên nhân viên. | API cho phép người ngoài thao tác `confirmed`/`arrived` trên dữ liệu. | Bắt buộc xác thực và quyền nhân viên cho thay đổi nội bộ. |
| B-04 | Major | FR-08 | Với một lượt đã `cancelled`, gọi `PATCH` đặt lại `confirmed` hoặc `arrived`; thử tương tự với các trạng thái khác. | API chỉ kiểm tra trạng thái đích có nằm trong danh sách cho phép; không kiểm tra chuyển trạng thái hợp lệ. | Từ chối chuyển trạng thái không hợp lệ theo state machine được thống nhất. |
| B-05 | Major | FR-03, NFR-02 | Gửi đồng thời hai `POST` cho cùng bàn và khung giờ đang trống. | Kiểm tra lịch và ghi dữ liệu là hai bước riêng; cả hai request có thể cùng thấy bàn trống rồi cùng lưu. | Kiểm tra và giữ bàn phải nguyên tử; chỉ một request được nhận. |
| B-06 | Major | BR-04, FR-03 | Gọi API trực tiếp với ngày quá khứ hoặc chuỗi ngày được `Date.parse` chấp nhận nhưng không theo `YYYY-MM-DD`. | Server chỉ kiểm tra `Date.parse`; không áp dụng ngày tối thiểu ở giao diện và không buộc định dạng ISO chặt. | Từ chối ngày quá khứ và đầu vào không đúng định dạng ngày đã công bố. |
| B-07 | Major | BR-06, FR-03 | Tạo lượt đặt cùng bàn lúc 23:30 kéo dài 120 phút; tạo lượt khác hôm sau lúc 00:30. | Hàm xung đột chỉ so ngày bằng nhau nên không phát hiện hai khoảng thời gian thực tế giao nhau. | So sánh khoảng thời gian qua ranh giới ngày và từ chối trùng. |
| B-08 | Major | NFR-01, FR-03 | Gửi JSON không hợp lệ hoặc body `null` đến `POST /api/reservations`. | Lỗi parse/truy cập trường bị bắt chung và trả 500. | Trả 400 với thông báo validation ổn định, không coi input sai là lỗi máy chủ. |
| B-09 | Major | NFR-01 | Gây lỗi truy vấn DB rồi gọi API bị ảnh hưởng. | Handler đưa `error.message` vào trường `details` trong phản hồi 500. | Ghi chi tiết ở log máy chủ; phản hồi công khai không tiết lộ thông tin nội bộ. |
| B-10 | Minor | API contract, FR-08 | Gọi `PATCH /api/reservations/abc` hoặc ID không phải số nguyên dương. | `Number(id)` thành `NaN`, lỗi truy vấn có thể bị trả thành 500. | Kiểm tra ID trước truy vấn và trả 400 hoặc 404 nhất quán. |

## Ngoài đặc tả hiện tại (3 đề xuất cần xác nhận)

| ID | Loại | Tiêu đề | Vì sao ngoài baseline | Đề xuất |
|---|---|---|---|---|
| OOS-01 | Cải tiến | Gửi xác nhận/nhắc lịch qua email hoặc SMS. | URD hiện tại chưa yêu cầu kênh thông báo; giao diện chỉ báo kết quả trên web. | Chốt nhà cung cấp, nội dung, thời điểm gửi và xử lý gửi thất bại trước khi bổ sung. |
| OOS-02 | Cải tiến | Xuất danh sách đặt bàn CSV/XLSX. | Đặc tả hiện tại mới có xem/lọc trên trang, chưa yêu cầu xuất báo cáo. | Bổ sung tiêu chí quyền truy cập, bộ lọc và định dạng nếu nhà hàng cần. |
| OOS-03 | Cải tiến | Cấu hình giờ hoạt động và giới hạn thời lượng/số khách. | Project chưa có dữ liệu cấu hình giờ mở cửa hoặc quy tắc giới hạn nghiệp vụ. | Chủ nhà hàng xác nhận chính sách; sau đó đưa thành yêu cầu có thể kiểm thử. |

File `Bug-register.csv` có cùng 13 mục để nhập vào Google Sheets. B-01…B-10 cần tái hiện trước khi chốt; OOS là backlog đề xuất, không phải lỗi đã xác minh.
