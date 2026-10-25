# Tổ chức Scrum và Backlog Sprint 0

**Dự án:** Bếp Nhà — hệ thống đặt và quản lý bàn nhà hàng  
**Ngày lập:** 23/10/2026  
**Repository:** [github.com/fngdng/khkt](https://github.com/fngdng/khkt)

## 1. Quy trình làm việc

Nhóm thống nhất sử dụng Scrum để phát triển sản phẩm theo từng Sprint ngắn. Mỗi Sprint có mục tiêu, backlog, phần tăng trưởng sản phẩm có thể trình diễn, buổi review và retrospective. Scrum Master điều phối các buổi họp và gỡ vướng; nhóm cập nhật tiến độ trên GitHub Issues/Pull Requests.

> Đề xuất ban đầu: Sprint dài 1–2 tuần; nhóm xác nhận độ dài và lịch họp trước khi bắt đầu Sprint đầu tiên.

## 2. Phân vai thành viên

Điền tên thật của thành viên trước khi nộp. Một thành viên có thể kiêm nhiều trách nhiệm nếu nhóm ít người.

| Vai trò | Thành viên | Trách nhiệm chính |
|---|---|---|
| Scrum Master / điều phối | **Phong** | Điều phối Scrum, theo dõi vướng mắc, nhắc cập nhật tiến độ và hỗ trợ nhóm giữ nhịp Sprint. Đồng thời tham gia backend và frontend. |
| Backend | **Phong, Phúc** | Cùng phụ trách API đặt bàn, kiểm tra trùng lịch/sức chứa và lưu dữ liệu PostgreSQL. |
| Frontend | **Phong, Phúc** | Cùng phụ trách giao diện khách hàng và admin, kết nối API và xử lý trạng thái thao tác. |
| Báo cáo / tài liệu | **Đăng** | Cập nhật README, đặc tả, backlog, biên bản review và ảnh/link demo. |

## 3. Mục tiêu Sprint 0

Thống nhất cách làm Scrum, phân vai và thống nhất phạm vi MVP; chuẩn bị môi trường và kịch bản để nhóm có thể trình diễn luồng đặt bàn cơ bản.

## 4. Product Backlog cho Sprint 0

Ưu tiên theo MVP. Các tính năng đã có mã nguồn trong repository vẫn cần được nhóm chạy thử và xác nhận trước khi đánh dấu hoàn thành.

| ID | Ưu tiên | Công việc | Điều kiện chấp nhận | Phụ trách | Trạng thái |
|---|---|---|---|---|---|
| S0-01 | Must | Thống nhất mục tiêu MVP, người dùng và luồng chính | Nhóm thống nhất: khách tạo/tra cứu/hủy; nhân viên duyệt và cập nhật trạng thái. | Scrum Master + cả nhóm | Chưa xác nhận |
| S0-02 | Must | Chốt phân vai và cách phối hợp trên GitHub | Bảng phân vai có tên; thống nhất tạo branch, Issue, Pull Request và review trước khi merge. | Phong + cả nhóm | Đã điền vai; nhóm xác nhận cách phối hợp |
| S0-03 | Must | Chuẩn bị môi trường chạy dự án | Có hướng dẫn cấu hình `.env.local`, PostgreSQL và chạy ứng dụng; thành viên có thể mở trang khách và `/admin`. | Backend + tài liệu | Cần xác nhận |
| S0-04 | Must | Kiểm tra luồng khách đặt bàn | Khách nhập thông tin, chọn bàn hoặc tự động chọn; hệ thống từ chối bàn không đủ chỗ/trùng lịch và lưu yêu cầu. | Frontend + backend | Có mã nguồn, cần demo |
| S0-05 | Must | Kiểm tra luồng admin duyệt bàn | Admin xem danh sách, duyệt, ghi nhận khách đến hoặc hủy; trạng thái được lưu lại sau khi tải lại trang. | Frontend + backend | Có mã nguồn, cần demo |
| S0-06 | Should | Kiểm tra tra cứu và hủy bằng số điện thoại | Khách tra cứu được các lượt đặt theo số điện thoại và hủy một lượt chưa bị hủy. | Frontend + backend | Có mã nguồn, cần demo |
| S0-07 | Must | Chạy kiểm tra tự động và sửa lỗi trước demo | `npm test` và `npm run lint` chạy thành công; ghi lại kết quả hoặc liên kết CI. | Backend + cả nhóm | Cần chạy |
| S0-08 | Must | Chuẩn bị demo MVP cho lớp | Có kịch bản demo 2–3 phút và ảnh chụp hoặc link ứng dụng; lưu bằng chứng trong repository. | Frontend + tài liệu | Chưa có ảnh/link public |

## 5. Demo ý tưởng / MVP

- **Repository nhóm:** [https://github.com/fngdng/khkt](https://github.com/fngdng/khkt)
- **Màn khách:** route `/`; mã nguồn `app/page.js` và `app/components/CustomerPortal.jsx`.
- **Màn nhân viên:** route `/admin`; mã nguồn `app/admin/page.js` và `app/components/ReservationManager.jsx`.
- **Kịch bản demo:** tạo đặt bàn và chọn bàn → tra cứu bằng số điện thoại → thử hủy → vào `/admin` duyệt hoặc cập nhật trạng thái → tải lại để xác nhận dữ liệu được lưu.
- **Chạy demo tại máy phát triển:** cấu hình `.env.local`, chạy `npm run db:up`, sau đó `npm run dev`; mở `http://localhost:5000` và `http://localhost:5000/admin`.
- **Ảnh hoặc link demo public:** `[Bổ sung sau khi nhóm chụp màn hình hoặc deploy thành công]`.

## 6. Definition of Done cho Sprint 0

- Bảng phân vai đã điền tên thành viên và được cả nhóm xác nhận.
- Backlog có người phụ trách và trạng thái được cập nhật sau khi chạy thử.
- Kịch bản MVP trình diễn được hoặc ghi rõ vướng mắc môi trường.
- Có ảnh/link demo và repository/Pull Request được đính kèm khi nộp.
