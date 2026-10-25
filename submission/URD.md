# URD — Tài liệu yêu cầu người dùng

## 1. Thông tin chung

| Mục | Nội dung |
|---|---|
| Sản phẩm | Bếp Nhà — ứng dụng đặt bàn nhà hàng |
| Phiên bản tài liệu | 1.0 |
| Cơ sở lập | Mã nguồn Next.js, API và schema PostgreSQL hiện có |
| Ngày lập | 25/10/2026 |

## 2. Bối cảnh và mục tiêu

Khách cần gửi yêu cầu đặt bàn trực tuyến và tra cứu các lượt đặt bằng số điện thoại. Nhân viên nhà hàng cần xem danh sách, xác nhận yêu cầu, ghi nhận khách đến hoặc hủy lượt đặt. Hệ thống lưu lịch đặt, thời lượng, số khách, bàn được gán và trạng thái.

## 3. Phạm vi

**Trong phạm vi:** trang khách, tra cứu theo số điện thoại, chọn ngày/giờ/số khách/thời lượng/bàn, tự gán bàn, kiểm tra sức chứa và trùng khung giờ; trang nhân viên để tạo, lọc, xem và cập nhật lượt đặt; PostgreSQL để lưu dữ liệu.

**Chưa thể hiện trong project:** đăng nhập và phân quyền nhân viên, thanh toán/đặt cọc, email hoặc SMS, quản lý giờ mở cửa, cấu hình bàn qua giao diện, báo cáo xuất file.

## 4. Vai trò

| Vai trò | Nhu cầu |
|---|---|
| Khách hàng | Gửi yêu cầu đặt bàn và xem lượt đặt bằng số điện thoại đã cung cấp |
| Nhân viên | Tạo và quản lý lượt đặt, xác nhận, đánh dấu khách đã đến hoặc hủy |

## 5. User stories

| Mã | User story | Ưu tiên |
|---|---|---|
| US-01 | Là khách, tôi muốn gửi yêu cầu với ngày, giờ, số khách và thông tin liên hệ để giữ chỗ. | Must |
| US-02 | Là khách, tôi muốn chọn bàn hoặc để hệ thống tự chọn bàn đủ chỗ và không bị trùng lịch. | Must |
| US-03 | Là khách, tôi muốn tra cứu các lượt đặt bằng số điện thoại đã dùng. | Must |
| US-04 | Là khách, tôi muốn hủy lượt đặt của mình khi không còn nhu cầu. | Should |
| US-05 | Là nhân viên, tôi muốn xem và lọc danh sách đặt bàn theo ngày, trạng thái, số điện thoại. | Must |
| US-06 | Là nhân viên, tôi muốn tạo lượt đặt tại quầy với cùng quy tắc kiểm tra bàn. | Must |
| US-07 | Là nhân viên, tôi muốn xác nhận, ghi nhận khách đã đến hoặc hủy lượt đặt. | Must |

## 6. Tiêu chí nghiệm thu ở mức người dùng

- US-01: thông tin hợp lệ được lưu ở trạng thái chờ xác nhận; lỗi dữ liệu được hiển thị cho người gửi.
- US-02: bàn đủ sức chứa được chọn; không được tạo hai lượt đặt chồng giờ trên cùng bàn.
- US-03: tra cứu trả về các lượt có số điện thoại trùng khớp.
- US-04: khách có thể gửi yêu cầu hủy và thấy trạng thái cập nhật.
- US-05: nhân viên lọc được ngày/trạng thái/số điện thoại và tải lại dữ liệu.
- US-06: nhân viên tạo lượt đặt được qua cùng API và quy tắc gán bàn.
- US-07: trạng thái được cập nhật và xuất hiện trong danh sách sau khi tải lại.

## 7. Giả định cần chủ dự án xác nhận

Project không nêu giờ hoạt động, giới hạn tối đa số khách/thời lượng, quy trình xác minh quyền tra cứu/hủy, hay các trạng thái chuyển hợp lệ. Các điều này cần được xác nhận trước khi dùng URD làm baseline nghiệm thu chính thức.
