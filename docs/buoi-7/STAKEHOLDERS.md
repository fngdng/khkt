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

## 4. Kế hoạch trao đổi và xác nhận nhu cầu

Bảng dưới là **kế hoạch trao đổi**, chưa phải kết quả phỏng vấn. Đầu mối liên hệ ghi ngày, người tham gia và bằng chứng sau khi thực hiện; không điền câu trả lời thay cho bên liên quan. Không đặt lịch cụ thể khi chưa thống nhất với người tham gia.

| ID | Câu hỏi cần trao đổi | Thời điểm / hình thức đề xuất | Kết quả cần ghi lại | Trạng thái xác nhận |
|---|---|---|---|---|
| SH-01 | Phạm vi MVP hiện tại có phù hợp đồ án không? Khi demo cần bằng chứng nào? Phần nào nên ưu tiên ở Sprint tiếp theo? | Mentoring hoặc Review gần nhất; trao đổi trực tiếp, tổng hợp vào issue | Ý kiến về phạm vi, tiêu chí nghiệm thu và ưu tiên; người xác nhận và link biên bản | Chưa có phản hồi được ghi nhận trong tài liệu này |
| SH-02 | Ai phụ trách và review từng PBI? Có trở ngại hoặc phụ thuộc nào? Các quyết định đang mở cần chốt là gì? | Planning và cập nhật hằng ngày qua issue/chat; tổng kết tại Retro | Người làm/duyệt, thứ tự công việc, trở ngại và DECISION liên quan | Đã có tên và vai trò trong hồ sơ nhóm; sức chứa và cam kết từng PBI cần xác nhận |
| SH-03 | Nhà hàng nhận đặt trước bao lâu? Khung giờ và thời lượng sử dụng bàn thế nào? Khi nào duyệt/hủy? Quy tắc chọn bàn và xử lý hết bàn là gì? | Khi tìm được đại diện nhà hàng; phỏng vấn ngắn trước khi chốt nghiệp vụ | Quy tắc nghiệp vụ, trường hợp ngoại lệ và tiêu chí kiểm tra được người đại diện xác nhận | Chưa có đại diện thực tế; hiện là giả định nghiệp vụ của nhóm |
| SH-04 | Nhân viên cần thấy thông tin nào trước tiên? Cách duyệt/hủy hiện tại có dễ hiểu không? Khi trùng lịch hoặc khách không đến thì xử lý thế nào? | Dùng thử trang admin với dữ liệu mẫu cuối Sprint | Các bước thao tác, điểm gây nhầm, lỗi tái hiện được và đề xuất cải tiến | Chưa có kết quả dùng thử được ghi nhận |
| SH-05 | Form có trường nào khó hiểu? Khách có tìm được trạng thái và thao tác hủy không? Thông báo lỗi có giúp sửa dữ liệu không? | Dùng thử luồng đặt → tra cứu/hủy trên điện thoại hoặc máy tính sau demo | Khả năng hoàn thành luồng, chỗ bị kẹt và phản hồi về thông tin hiển thị | Chưa có kết quả dùng thử được ghi nhận |
| SH-06 | Nhóm có được cấp tài nguyên không? Ai quản trị? Giới hạn tài nguyên, cổng truy cập, sao lưu và cách báo sự cố là gì? | Trước khi triển khai lên tài nguyên được cấp; trao đổi qua kênh đơn vị cung cấp | Điều kiện sử dụng, đầu mối sự cố, quyền truy cập và trách nhiệm sao lưu; không ghi secret vào issue | Chưa xác nhận tài nguyên hoặc đầu mối thực tế |
| SH-07 | Người xem có hiểu vấn đề và luồng MVP sau phần demo không? Phần trình bày hoặc giao diện nào cần làm rõ? | Hỏi nhanh sau demo trên lớp; không bắt buộc tham gia | Góp ý tự nguyện được tổng hợp, tách khỏi yêu cầu đã cam kết | Chưa có góp ý được ghi nhận trong tài liệu này |

## 5. Mẫu ghi nhận phản hồi

Mỗi phản hồi thực tế dùng ID `FB-001`, `FB-002`… và liên kết stakeholder tương ứng. Lưu trong issue hoặc biên bản có lịch sử; bảng đăng ký chỉ giữ phần tóm tắt và link. Nếu một người thử đóng nhiều vai, ghi rõ vai đang thử; kết quả đóng vai nội bộ không thay cho xác nhận của đối tác thực tế.

```text
ID phản hồi: FB-<số>
Stakeholder: SH-<số> | Vai trò người phản hồi: ...
Loại nguồn: đối tác/người dùng thực tế | dùng thử nội bộ | góp ý trên lớp
Ngày ghi nhận: ... | Người ghi: ...
Bối cảnh: Sprint, tag/commit, màn hình hoặc tài liệu được xem
Nội dung phản hồi: ...
Minh chứng: link issue/PR/biên bản; ảnh đã loại bỏ dữ liệu cá nhân nếu có
Phân loại: lỗi | yêu cầu mới | câu hỏi | góp ý trải nghiệm
Tác động: người dùng bị ảnh hưởng, phạm vi, thời gian và rủi ro liên quan
Đề xuất xử lý: ...
Người phụ trách: ... | Người phê duyệt: ...
Quyết định: chưa chốt | tiếp nhận | hoãn | không tiếp nhận (kèm lý do)
Liên kết PBI/issue thực hiện: ...
Trạng thái xử lý: mới ghi nhận | đang làm rõ | đã chốt hướng xử lý | đang làm | chờ kiểm chứng | đóng
Kết quả kiểm chứng và phản hồi lại cho người góp ý: ...
```

**Ví dụ minh họa — không phải phản hồi đã thu thập:** khi người đóng vai lễ tân đề nghị hiển thị rõ ngày giờ trong danh sách admin, ghi nguồn là “dùng thử nội bộ”, liên kết SH-04 và đánh giá giao diện hiện tại trước khi tạo PBI. Chỉ ghi “đã cải thiện” sau khi có thay đổi, kết quả kiểm tra và người duyệt; không tự ghi nhà hàng đã đồng ý.

## 6. Theo dõi việc xử lý phản hồi

1. Đầu mối tiếp nhận phản hồi, xác nhận đã nhận và tạo bản ghi theo mẫu; phản hồi khẩn áp dụng quy tắc báo tin xấu của nhóm.
2. Người phụ trách làm rõ nhu cầu, đối chiếu phạm vi MVP và phân biệt lỗi với yêu cầu mới. Nếu chưa đủ thông tin, giữ trạng thái đang làm rõ và ghi câu hỏi còn mở.
3. Người phê duyệt ghi `DECISION:` trong issue: tiếp nhận, hoãn hoặc không tiếp nhận cùng lý do. Đề xuất mới không tự trở thành cam kết của Sprint đang chạy.
4. Khi thực hiện, liên kết issue với PR và commit; kiểm tra kết quả theo tiêu chí đã chốt. Việc sửa phản hồi không làm thay đổi tag phát hành cũ.
5. Thông báo kết quả hoặc lý do hoãn cho người góp ý, ghi bằng chứng kiểm chứng rồi mới đóng. Cuối Review, Đăng tổng hợp số phản hồi mới, đã xử lý, còn mở và các việc cần chuyển Sprint.

Nếu chưa có buổi trao đổi hoặc phản hồi thực tế, báo cáo rõ **chưa thực hiện/chưa có dữ liệu**. Giữ bản đăng ký này như kế hoạch để nhóm tiếp tục cập nhật sau khi làm việc với các bên.
