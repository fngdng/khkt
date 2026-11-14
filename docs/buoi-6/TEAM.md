# Buổi 6 — Phân vai RACI và quy ước giao tiếp

Đồ án: **Hệ thống quản lý đặt bàn nhà hàng** · CSE3045.

Tài liệu áp dụng từ Sprint 1; kế thừa [phân vai Buổi 4](../buoi-4/sprint-0.md). Đây là quy ước làm việc được đề xuất cho nhóm thực hiện; việc xác nhận của thành viên được ghi trong issue/PR của bài Buổi 6. Bài thực hành không đặt hạn nộp.

## 1. Thành viên và trách nhiệm chuyên môn

| Thành viên | MSSV | Phụ trách |
|---|---|---|
| Đặng Thanh Phong | 23110329 | Backend, cơ sở dữ liệu; Scrum Master/điều phối Sprint 0 |
| Phùng Xuân Phúc | 23110211 | Frontend khách hàng và nhân viên; tích hợp giao diện/API |
| Đỗ Hải Đăng | 23110332 | Báo cáo, tài liệu, biên bản và tổng hợp minh chứng |

## 2. Ma trận RACI

**R — Responsible:** trực tiếp thực hiện, cập nhật tiến độ và cung cấp bằng chứng. **A — Accountable:** duyệt đầu ra và chịu trách nhiệm cuối cùng. **C — Consulted:** được hỏi ý kiến trước khi chốt. **I — Informed:** được thông báo kết quả.

Mỗi hàng dưới đây có **đúng một A và một R**, giao cho hai người khác nhau để có review chéo. A chỉ duyệt khi tiêu chí nghiệm thu đáp ứng; R không tự chuyển việc sang Done khi chưa được duyệt. Khi bàn giao phải cập nhật bảng bằng issue/PR, không tự phát sinh thêm A hoặc R.

| Mảng công việc | Đặng Thanh Phong | Phùng Xuân Phúc | Đỗ Hải Đăng |
|---|---|---|---|
| Yêu cầu, phạm vi và thứ tự ưu tiên Product Backlog | A | C | R |
| Schema PostgreSQL và dữ liệu mẫu | R | A | I |
| API đặt bàn, gán bàn và kiểm tra xung đột | R | A | C |
| Giao diện khách: tạo, tra cứu và hủy đặt bàn | A | R | C |
| Giao diện nhân viên: danh sách, duyệt và cập nhật trạng thái | A | R | C |
| Kiểm thử logic, lint và kiểm soát đồng thời | R | A | C |
| Kiểm thử tích hợp và minh chứng luồng MVP | A | R | C |
| Báo cáo, hướng dẫn chạy và hồ sơ bài nộp | A | C | R |
| Chuẩn bị kịch bản và tổng hợp kết quả demo | C | A | R |

A của hạng mục kỹ thuật có trách nhiệm làm theo checklist và xem bằng chứng, không chỉ duyệt dựa trên chuyên môn của R. Khi chưa đủ khả năng kiểm tra, A yêu cầu giải thích hoặc làm việc cặp cùng R; chưa đánh dấu đạt.

## 3. Luân phiên điều phối theo Sprint

| Sprint | Người điều phối | Người hỗ trợ/bàn giao |
|---|---|---|
| Sprint 0 | Đặng Thanh Phong | Đỗ Hải Đăng tổng hợp tài liệu |
| Sprint 1 | Phùng Xuân Phúc | Đặng Thanh Phong hỗ trợ quy trình và trở ngại kỹ thuật |
| Sprint 2 | Đỗ Hải Đăng | Phùng Xuân Phúc bàn giao |
| Sprint 3 | Đặng Thanh Phong | Đỗ Hải Đăng bàn giao |

Sau Sprint 3, lặp lại thứ tự **Phong → Phúc → Đăng**. Điều phối viên tổ chức Planning/Daily/Review/Retrospective, nhắc cập nhật bảng việc và kết nối người hỗ trợ khi bị kẹt. Vai này không thay thế người làm, A của từng mảng hay tự quyết thay cả nhóm.

Cuối mỗi Sprint, người cũ bàn giao link backlog, việc chưa xong, rủi ro, quyết định còn mở và kế hoạch họp. Nếu người đến lượt vắng, nhóm ghi người thay cùng phạm vi bàn giao trong issue trước khi áp dụng. Chuyên môn backend/frontend/tài liệu giữ theo bảng thành viên, trừ khi có quyết định bàn giao riêng.

Đặng Thanh Phong phụ trách phê duyệt ưu tiên/phạm vi trong ma trận; đây là đầu mối tạm thời, không phải bằng chứng nhóm đã chính thức bổ nhiệm Product Owner. Nhóm cần xác nhận Product Owner và lịch họp tại Planning Sprint 1, ghi `DECISION:` trong issue.

## 4. Kênh giao tiếp và thời gian phản hồi

Dùng giờ Việt Nam. Các mốc phản hồi dưới đây là quy ước vận hành đề xuất, không phải hạn nộp bài. Nhóm xác nhận nền tảng chat và lịch họp trong issue khởi động Sprint 1.

| Kênh | Khi sử dụng | Kỳ vọng phản hồi / lưu vết |
|---|---|---|
| GitHub Issue — bất đồng bộ | Giao việc, câu hỏi yêu cầu, lỗi, rủi ro và thay đổi phạm vi | Người được tag xác nhận trong 24 giờ; cập nhật tiến độ ít nhất mỗi ngày có làm việc; kèm ID backlog/PBI. |
| GitHub Pull Request — bất đồng bộ | Review code/tài liệu, bàn giao và quyết định kỹ thuật | A hoặc reviewer xác nhận nhận review trong 24 giờ; nêu rõ yêu cầu sửa hoặc tiêu chí chấp nhận. |
| Chat nhóm — bất đồng bộ | Cập nhật ngắn hằng ngày, nhắc review, báo bị kẹt | Trước 21:00 ngày có làm việc: đã làm, sẽ làm, vướng mắc và link issue/PR. Tin thường phản hồi trong 24 giờ; quyết định phải chép về GitHub. |
| Họp trực tiếp hoặc gọi nhóm — đồng bộ | Planning, Review/Retro; bất đồng chưa giải quyết được qua issue; sự cố chặn nhiều người | Chốt lịch qua chat trước ít nhất 24 giờ cho họp thường; Daily tối đa 15 phút nếu cần. Người ghi biên bản cập nhật issue trong 24 giờ sau họp. |
| Chat khẩn + gọi trực tiếp — đồng bộ | Mất dữ liệu, lỗi nghiêm trọng, nguy cơ không demo được hoặc chặn công việc người khác | Báo ngay khi phát hiện cho R, A và điều phối viên; trong khung liên lạc 08:00–22:00, người nhận xác nhận trong 2 giờ. Nếu chưa phản hồi, gọi người dự phòng; ngoài khung giờ, xác nhận trước 10:00 hôm sau. |

Khi không thể đáp ứng thời gian phản hồi, thành viên báo trước khoảng thời gian vắng và người tiếp nhận. Không có phản hồi không được hiểu là đồng ý.

## 5. Ghi lại quyết định và thay đổi

Mỗi công việc có một issue ghi mục tiêu, R, A, tiêu chí nghiệm thu, trạng thái và link PR. PR nêu thay đổi, cách kiểm tra, kết quả và giới hạn. Quyết định trong chat/họp được R hoặc người ghi biên bản tổng hợp vào issue/PR liên quan, tag A xác nhận. Chỉ ghi đã phê duyệt khi có xác nhận rõ ràng.

Mẫu comment:

```text
DECISION: <tiêu đề quyết định>
Bối cảnh / vấn đề: ...
Các lựa chọn và tác động: ...
Kết luận / phạm vi áp dụng: ...
R thực hiện: ... | A phê duyệt: ...
Người bị ảnh hưởng (C/I): ...
Bằng chứng / issue / PR: ...
Thời điểm hiệu lực và việc cần theo dõi: ...
```

Thay đổi schema/API phải tag người frontend trước khi triển khai và cập nhật `api.md`/`database.md`. Yêu cầu ngoài MVP đưa vào Product Backlog để đánh giá, chỉ đưa vào Sprint đang chạy sau khi ghi tác động và A của phạm vi xác nhận. Người làm cùng file báo nhau trên issue để tránh xung đột.

## 6. Quy tắc báo tin xấu và diễn tập

Báo sớm ngay khi biết việc có nguy cơ trễ hoặc lỗi ảnh hưởng người khác; không chờ Daily/Review và không đổ lỗi. Gửi chat khẩn nếu bị chặn, đồng thời tạo/cập nhật issue. Tag **R, A theo ma trận và điều phối viên hiện tại**. Nếu người báo là R, tag A và điều phối viên.

Tin báo phải có: hiện tượng và thời điểm, dữ liệu/bước tái hiện, ảnh hưởng và việc bị chặn, điều đã thử, đề xuất xử lý, người cần hỗ trợ và thời điểm cập nhật tiếp theo. A cùng R chọn cách xử lý; điều phối viên sắp xếp hỗ trợ hoặc giảm phạm vi có ghi nhận. Nếu phát sinh rủi ro, cập nhật [RISKS.md](../RISKS.md); không tự đổi trạng thái rủi ro thành đã xử lý khi chưa có minh chứng.

**Tình huống diễn tập 5 phút:** Phong phát hiện POST đặt bàn lỗi, chặn Phúc tích hợp form. Phong báo chat và issue, tag Phúc (A của API, đồng thời điều phối Sprint 1), thông báo Đăng (C, cập nhật tài liệu). Nội dung: “POST đặt bàn trả lỗi khi dùng dữ liệu mẫu; form khách chưa thể kiểm chứng. Đã kiểm tra request; đề xuất cùng kiểm tra kết nối DB, tạm dùng mock để tiếp tục bố cục. Mình cập nhật lại sau 2 giờ.” Phúc xác nhận theo quy ước, chốt người hỗ trợ; Đăng ghi kết quả vào issue. Đây là kịch bản diễn tập, chưa phải biên bản đã thực hiện.

Người dự phòng: Phúc tiếp nhận thông tin backend và cùng Phong đọc hướng dẫn; Phong hỗ trợ giao diện khi Phúc vắng; Phúc hỗ trợ cập nhật tài liệu khi Đăng vắng. Việc đổi R/A chính thức phải được ghi lại, giữ đúng một A và một R mỗi hàng.
