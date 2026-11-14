# Buổi 7 — Bản đăng ký các bên liên quan

Đồ án: **Hệ thống quản lý đặt bàn nhà hàng** · CSE3045. Đầu mối tổng hợp: **Đỗ Hải Đăng — 23110332**.

Quyền lực là mức ảnh hưởng tới phạm vi, nguồn lực hoặc nghiệm thu; quan tâm là mức cần theo dõi kết quả dự án. Phân loại là đánh giá ban đầu của nhóm, cần xác nhận khi tiếp xúc. Chủ nhà hàng, nhân viên và khách bên dưới là nhóm người dùng mục tiêu, chưa có thông tin một đơn vị hoặc cá nhân thực tế đã tham gia; không coi họ đã đồng ý yêu cầu.

## 1. Ma trận quyền lực × quan tâm

| | Quan tâm cao | Quan tâm thấp |
|---|---|---|
| Quyền lực cao | **Quản lý sát sao** — cùng làm rõ yêu cầu, tham gia mốc quyết định | **Giữ hài lòng** — báo cáo ngắn theo mốc, xin ý kiến khi ảnh hưởng quyền hạn |
| Quyền lực thấp | **Giữ cho hiểu rõ** — demo, hướng dẫn và thu phản hồi thường xuyên | **Theo dõi** — cập nhật nhẹ, tăng mức tham gia khi nhu cầu thay đổi |

## 2. Bản đăng ký

| ID | Định danh / vai trò | Nhu cầu và ảnh hưởng chính | Quyền lực | Quan tâm | Nhóm ma trận | Chiến lược / kênh / thời điểm | Đầu mối nhóm |
|---|---|---|---|---|---|---|---|
| SH-01 | Giảng viên phụ trách CSE3045 — chưa ghi tên cá nhân | Đánh giá học phần, góp ý phạm vi và bằng chứng; có quyền nghiệm thu bài tập | Cao | Cao | Quản lý sát sao | Báo cáo ngắn tại Review/mentoring; cung cấp repo, tag, kết quả thật và phần chưa kiểm; xin làm rõ tiêu chí trước khi đổi phạm vi lớn. | Đặng Thanh Phong |
| SH-02 | Nhóm phát triển: Phong 23110329, Phúc 23110211, Đăng 23110332 | Thực hiện và chịu trách nhiệm tiến độ, chất lượng, quyết định kỹ thuật | Cao | Cao | Quản lý sát sao | Cập nhật issue/PR mỗi ngày có làm; Planning/Review/Retro theo Sprint; chốt quyết định bằng DECISION, phân công rõ người làm/duyệt. | Phùng Xuân Phúc — điều phối Sprint 1 |
| SH-03 | Chủ/quản lý nhà hàng mục tiêu — chưa xác định đối tác | Quyết định chấp nhận nghiệp vụ, quy tắc gán bàn và trạng thái; ảnh hưởng phạm vi sử dụng | Cao | Cao | Quản lý sát sao | Khi có đối tác, phỏng vấn trước Sprint; demo cuối Sprint, xác nhận quy tắc sức chứa/giờ/hủy; ghi yêu cầu thành issue, không suy diễn yêu cầu từ wireframe. | Đặng Thanh Phong |
| SH-04 | Nhân viên lễ tân dùng trang admin — người dùng mục tiêu | Cần danh sách rõ, duyệt/hủy nhanh và tránh trùng bàn; cung cấp phản hồi vận hành | Thấp | Cao | Giữ cho hiểu rõ | Mời dùng thử theo checklist cuối Sprint; quan sát thao tác duyệt/hủy/tải lại, hướng dẫn ngắn; tổng hợp lỗi có bước tái hiện vào issue. | Phùng Xuân Phúc |
| SH-05 | Khách đặt bàn thử nghiệm — người dùng mục tiêu | Cần form dễ hiểu, tra cứu đúng và bảo vệ thông tin; ảnh hưởng trải nghiệm sản phẩm | Thấp | Cao | Giữ cho hiểu rõ | Thử luồng đặt → tra cứu/hủy với dữ liệu mẫu sau mốc demo; hỏi khó khăn và thông báo giới hạn xác minh SĐT; không ghi dữ liệu cá nhân thật vào repo. | Phùng Xuân Phúc |
| SH-06 | Đơn vị/người cấp tài nguyên phòng máy hoặc VPS, nếu được cấp | Có quyền giới hạn truy cập/tài nguyên nhưng không cần theo dõi từng tính năng | Cao | Thấp | Giữ hài lòng | Trước triển khai, xác nhận quyền dùng và cấu hình; báo ngắn thay đổi tài nguyên hoặc sự cố ảnh hưởng hạ tầng; không gửi toàn bộ hội thoại phát triển. Chưa khẳng định nhóm đã có VPS. | Đặng Thanh Phong |
| SH-07 | Các nhóm bạn/người xem demo trong lớp | Tham khảo ý tưởng, góp ý giao diện; không quyết định phạm vi hay nghiệm thu nhóm | Thấp | Thấp | Theo dõi | Cung cấp demo công khai ở mốc trình bày; nhận góp ý tự nguyện, tổng hợp sau buổi; không kéo vào họp nội bộ thường xuyên. | Đỗ Hải Đăng |

## 3. Quản lý và kiểm soát sự tham gia

Đăng cập nhật danh sách cuối mỗi Sprint hoặc khi xuất hiện người ảnh hưởng mới. Mỗi phản hồi có ID stakeholder, mô tả, ngày ghi nhận, issue liên quan, người xử lý và trạng thái. Với bên chưa xác định, bước tiếp theo là tìm người đại diện và xác nhận nhu cầu; không ghi giả tên hoặc buổi phỏng vấn.

Phong/Phúc đánh giá tác động phạm vi, kỹ thuật và rủi ro trước khi nhận yêu cầu; ưu tiên sản phẩm do đầu mối nhóm phê duyệt theo phân vai. Hai bên yêu cầu khác nhau phải được làm rõ và ghi quyết định, không hứa riêng qua chat. Đánh giá lại quyền lực/quan tâm khi chuyển từ demo lớp sang dùng thử thực tế; ví dụ người xem trở thành tester thường xuyên thì chuyển từ Theo dõi sang Giữ cho hiểu rõ.

Báo tin xấu sớm cho người bị ảnh hưởng, nêu bối cảnh, tác động và phương án; thông báo khẩn trong chat/gọi, sau đó ghi issue/PR. Trước mỗi Review, kiểm tra bên cần tham gia đã nhận thông tin, phản hồi đã có người nhận và các cam kết chưa hoàn thành được nêu rõ.
