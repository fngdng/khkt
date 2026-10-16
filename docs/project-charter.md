# Project Charter

## 1. Project Title
Hệ thống quản lý đặt bàn nhà hàng sử dụng Node.js

## 2. Mục tiêu
- Số hóa quy trình đặt bàn, giảm sai sót khi nhận booking thủ công.
- Quản lý trạng thái bàn theo thời gian thực và tránh trùng lịch.
- Cung cấp nền tảng để mở rộng sang quản lý menu, hóa đơn và báo cáo sau này.

## 3. Phạm vi
### In scope
- Tạo, tra cứu, hủy đặt bàn.
- Gán bàn theo số lượng khách và khung giờ.
- Kiểm tra xung đột lịch đặt bàn.
- Bộ test tự động và CI trên GitHub Actions.

### Out of scope
- Thanh toán online.
- Tích hợp thiết bị POS.
- Ứng dụng mobile native.

## 4. Stakeholders
- Nhóm phát triển
- Giáo viên hướng dẫn
- Chủ nhà hàng / quản lý vận hành
- Nhân viên lễ tân

## 5. Deliverables
- Tài liệu WBS và Gantt chart.
- Bộ test tự động cho logic đặt bàn.
- Pipeline CI chạy xanh trên GitHub Actions.
- Prototype Node.js cho logic nghiệp vụ cơ bản.

## 6. Success Criteria
- Pull request có trạng thái CI xanh.
- Chức năng cốt lõi có test tự động.
- Tiến độ dự án được theo dõi bằng WBS và Gantt rõ ràng.

## 7. Constraints
- Thời gian đồ án giới hạn trong học kỳ.
- Nền tảng triển khai ưu tiên Node.js và GitHub.
- Mã nguồn cần đủ đơn giản để trình bày và bảo trì.