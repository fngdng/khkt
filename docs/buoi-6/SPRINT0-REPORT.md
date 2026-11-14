# Buổi 6 — Báo cáo hoàn thiện Sprint 0 và phạm vi Sprint 1

**Đồ án:** Hệ thống quản lý đặt bàn nhà hàng · CSE3045.  
**Ngày rà soát:** 14/11/2026.  
**Repo nhóm:** [fngdng/khkt](https://github.com/fngdng/khkt). Bài thực hành trên lớp, **không đặt hạn nộp**.

## 1. Căn cứ và cách đánh giá

Sprint 0 là giai đoạn chuẩn bị bắt đầu từ Buổi 4. Sprint 1 là giai đoạn phát triển/kiểm chứng MVP sau đó, không đổi tên các việc chuẩn bị thành một Sprint 0 mới.

Báo cáo đối chiếu trực tiếp **10 mục S0-01–S0-10 trong file Excel B4 hiện tại**, không dựa vào con số 20 còn sót trong phần mô tả trước khi rà soát. Phạm vi lịch sử được giữ theo file đã lưu, không tự tạo thêm ID hoặc thay đổi kết quả quá khứ.

- **Xong:** có đầu ra đáp ứng tiêu chí và bằng chứng kiểm tra tương ứng.
- **Dang dở:** đã có một phần hoặc chưa có đủ bằng chứng nghiệm thu; bao gồm việc chưa xác nhận bắt đầu. Có mã nguồn không đồng nghĩa chạy đúng.
- **Bỏ:** nhóm chủ động loại khỏi Sprint và ghi lý do; hiện chưa có bằng chứng quyết định bỏ mục nào.

Các bằng chứng Git dưới đây lấy từ lịch sử repo local; chưa xác minh trạng thái truy cập trên GitHub hoặc kết quả CI từ xa. Link commit dẫn đến phiên bản đã lưu; các tài liệu B6 mới cần được commit/push để có permalink riêng.

| Mã bằng chứng | Hiện vật / commit |
|---|---|
| B4 | [Commit ea993bb — bài Buổi 4](https://github.com/fngdng/khkt/commit/ea993bb30c169dfffc3e2c45d62ad0bb45468945); [backlog Excel hiện tại](../buoi-4/backlog-sprint-0.xlsx); [phân vai/phạm vi/kịch bản](../buoi-4/sprint-0.md); [wireframe](../buoi-4/mvp-wireframe.svg). |
| B4-H | [Commit merge 98773bb](https://github.com/fngdng/khkt/commit/98773bb99b788de84754957b3662b064edf4b697): có thay đổi backlog và tài liệu B4; là căn cứ cần đối chiếu bản Excel hiện tại. |
| B5 | [Commit fca603c — rủi ro và chất lượng](https://github.com/fngdng/khkt/commit/fca603c4bda7b0be66f84ef7e1ed33ac86ca490b); [RISKS.md](../RISKS.md), [QUALITY.md](../QUALITY.md). |
| MVP | [Commit 77d6652 — mã ứng dụng/API/DB](https://github.com/fngdng/khkt/commit/77d6652a6e5e0c0e885cccd4ff5c8428553f9c28); [API](../../api.md), [database](../../database.md), [schema và dữ liệu mẫu](../../docker/postgres/init/01-init.sql). |
| UI | [Commit 159dac6 — giao diện khách](https://github.com/fngdng/khkt/commit/159dac6c869bd123583ede61134cc4c9907628a1); [commit c616396 — admin/CI](https://github.com/fngdng/khkt/commit/c616396950c9440dae70a0c4d9dc2f2d3a7b9c77). |

## 2. Kết quả từng hạng mục Sprint 0

| ID B4 | Hạng mục trong Excel | Trạng thái | Bằng chứng và phần đã có | Phần còn thiếu / hành động tiếp |
|---|---|---|---|---|
| S0-01 | Chốt quy trình Scrum và phân vai | Xong | B4: tài liệu nêu chọn Scrum, đủ tên/MSSV và vai trò ba thành viên; README liên kết tài liệu. | B6 bổ sung RACI và luân phiên trong [TEAM.md](TEAM.md). |
| S0-02 | Chốt yêu cầu và phạm vi MVP | Xong | B4: mô tả khách/nhân viên, luồng đặt → duyệt → tra cứu; nêu ngoài phạm vi thanh toán, POS, mobile native. | Duy trì phạm vi; thay đổi mới theo R6 của B5 và quy trình DECISION. |
| S0-03 | Thiết lập bảng công việc và lịch họp | Dang dở | B4 có backlog và quy trình bốn cột; B6 có quy ước đề xuất trong TEAM.md. | Chưa có link Project/issue, xác nhận lịch họp và Product Owner. Phong tổ chức chốt ở Planning; liên quan B5 R5/R6. |
| S0-04 | Rà soát môi trường Next.js và PostgreSQL | Dang dở | MVP: có schema, Docker, cấu hình mẫu và README; có thể chạy test logic tại lần rà soát này. | Chưa có bằng chứng khởi động DB/web trên máy thành viên. Đối chiếu B5 QUALITY: Tài liệu và khả năng tái lập demo. |
| S0-05 | Phác thảo giao diện và luồng MVP | Xong | B4: SVG có form khách, màn hình nhân viên, tra cứu và trạng thái; file XML đã được kiểm tra cấu trúc. | Wireframe đáp ứng demo ý tưởng; không dùng thay bằng chứng ứng dụng chạy. |
| S0-06 | Rà soát schema và API tối thiểu | Dang dở | MVP: có GET bàn, tạo/tra cứu, PATCH trạng thái, tài liệu API/DB. | Chưa có log gọi API với DB thật và kết quả lỗi; kiểm chứng lưu trạng thái, sức chứa, đồng thời. B5 R1/R2/R3; QUALITY: Xung đột và Vòng đời trạng thái. |
| S0-07 | Kiểm chứng giao diện khách hàng | Dang dở | UI: có CustomerPortal cho đặt/tra cứu/hủy. | Chưa có ảnh/log gửi yêu cầu thật và tra cứu trạng thái pending. B5 R4; QUALITY: Nhập liệu và tra cứu đặt bàn. |
| S0-08 | Kiểm chứng giao diện nhân viên | Dang dở | UI: có ReservationManager và trang admin. | Chưa có bằng chứng duyệt/hủy, tải lại và đối chiếu DB. B5 R3; QUALITY: Vòng đời và lưu trạng thái đặt bàn. |
| S0-09 | Kiểm tra quy tắc đặt bàn và tích hợp | Dang dở | Có [test logic](../../test/reservationService.test.js), [workflow CI](../../.github/workflows/ci.yml); npm test thành công tại lần rà soát này. | Lint chưa chạy được do thiếu ESLint; chưa kiểm chứng luồng tích hợp/đồng thời và đủ bộ ca B5. R1/R2/R3 còn mở; không kết luận CI xanh. |
| S0-10 | Chuẩn bị minh chứng và demo trên lớp | Dang dở | B4: link repo, wireframe, hướng dẫn và kịch bản 2–3 phút. | Chưa có biên bản demo, ảnh chạy thực tế hoặc xác nhận review chéo; B5 QUALITY: Tài liệu và khả năng tái lập demo. |

**Tổng hợp: 3 xong, 7 dang dở, 0 bỏ.** Sprint 0 đã có khung repo, phạm vi, phân vai và phác thảo; chưa đủ bằng chứng để tuyên bố hoàn tất toàn bộ. Các phần chưa xong được đưa vào phạm vi kiểm chứng Sprint 1 bên dưới, vẫn giữ trạng thái lịch sử của Sprint 0.

## 3. Kiểm tra thực tế và giới hạn bằng chứng

Lần rà soát tại working tree dựa trên commit `ff0278331f159bd600007a3146cdc7f65917e6fa` (chưa gồm commit bài B6):

| Kiểm tra | Kết quả ghi nhận |
|---|---|
| `npm test`, Node.js v24.22.2 | Exit code 0; đầu ra runner ghi 1 test file đạt, 0 lỗi. File hiện có 5 lời gọi `test(...)`; kết quả này không thay cho các bộ 8/10/10 ca nghiệm thu B5. |
| `npm run lint` | Exit code 127, `eslint: not found`; chưa có kết quả lint sản phẩm. Cần cài dependencies theo lockfile rồi chạy lại trên môi trường chuẩn. |
| Chạy web/DB, UI, build, kiểm tra đồng thời | Chưa thực hiện trong lần rà soát; chưa có minh chứng đạt. |
| Thư mục `docs/evidence/quality/` | Chưa có bằng chứng được Git theo dõi tại thời điểm rà soát. Các đường dẫn trong QUALITY.md hiện là nơi dự kiến lưu kết quả. |

B5 còn để trống tên phụ trách trong RISKS/QUALITY. Sprint 1 cần thay bằng tên đã xác nhận theo TEAM.md. R1 về đặt đồng thời và R4 về tra cứu/hủy theo SĐT vẫn cần xử lý/đánh giá; không hạ mức rủi ro chỉ vì có kế hoạch. Test logic hiện kiểm tra kết quả `confirmed` ở module dịch vụ; cần đối chiếu với luồng API lưu `pending`, không dùng kết quả module làm bằng chứng trạng thái ban đầu của API.

## 4. Phạm vi Sprint 1 — khung thực hiện 1–2 tuần

**Mục tiêu:** kiểm chứng MVP đặt → duyệt → tra cứu/hủy trên dữ liệu mẫu, có bằng chứng tái lập và khắc phục lỗi chặn luồng. Danh sách dưới đây là phạm vi làm việc cho Sprint 1 trong bài B6; chưa có bằng chứng nhóm đã chốt Planning hoặc bắt đầu từng PBI. Điều phối viên Sprint 1 Phùng Xuân Phúc cần ghi xác nhận lựa chọn/capacity vào issue. Không gán ngày khởi động, hạn nộp hoặc tiến độ thực tế khi chưa có xác nhận.

| PBI | Giá trị / kết quả cần giao | R thực hiện | A duyệt | Tiêu chí hoàn thành và minh chứng | Kế thừa B4/B5 |
|---|---|---|---|---|---|
| PBI-01 — Chạy được môi trường và theo dõi việc | Thành viên có thể bắt đầu và biết rõ ai làm gì | Đặng Thanh Phong | Phùng Xuân Phúc | Chốt PO/lịch họp, có link bảng việc; cài đúng dependencies, chạy DB/web và lint/test; ghi lệnh, môi trường, kết quả trong issue và checklist demo. | S0-03/04/09; R5, QUALITY: tái lập demo |
| PBI-02 — Khách tạo đặt bàn đúng quy tắc | Yêu cầu hợp lệ được lưu; yêu cầu sai hoặc bàn không phù hợp bị từ chối | Đặng Thanh Phong | Phùng Xuân Phúc | API lưu `pending`, tra cứu lại đúng; chạy 8/8 ca xung đột/gán bàn và 10/10 ca nhập liệu/tra cứu theo B5; thử hai request đồng thời cùng bàn/giờ, ghi kết quả và sửa nếu vẫn lưu trùng. Lưu log tại `docs/evidence/quality/booking-conflicts.md` và `input-lookup.md`. | S0-06/09; R1/R2; QUALITY: xung đột, nhập liệu |
| PBI-03 — Khách thao tác đặt/tra cứu/hủy | Khách hoàn tất luồng trên giao diện với dữ liệu mẫu | Phùng Xuân Phúc | Đặng Thanh Phong | Form báo thành công/lỗi rõ; tra cứu thấy đặt vừa tạo; hủy cập nhật sau tải lại; kiểm tra SĐT không tồn tại; chụp ảnh, ghi kết quả và giới hạn bảo vệ theo R4. | S0-07; R4; QUALITY: nhập liệu/tra cứu |
| PBI-04 — Nhân viên duyệt và lưu trạng thái | Khách và nhân viên thấy cùng trạng thái sau xử lý | Phùng Xuân Phúc | Đặng Thanh Phong | Chốt bảng chuyển trạng thái với backend; chạy 6 ca hợp lệ và 4 ca sai/ID không tồn tại theo B5; đối chiếu DB sau tải lại. Lưu `docs/evidence/quality/reservation-status.md`; nếu cần sửa API, Phong R và Phúc A cho phần API theo RACI. | S0-06/08/09; R3; QUALITY: vòng đời |
| PBI-05 — Demo có bằng chứng và bàn giao | Người khác tái lập được luồng MVP từ tài liệu | Đỗ Hải Đăng | Đặng Thanh Phong | Điền tên phụ trách B5; tổng hợp log/ảnh do R kỹ thuật cung cấp; người review khởi động theo README ≤10 phút và kiểm tra 5/5 đường dẫn B5; ghi checklist tại `docs/evidence/quality/demo-readiness.md`; tập demo 2–3 phút và link PR/repo. | S0-10; R5/R6; QUALITY: tái lập demo |

**Trình tự dự kiến:** tuần đầu chốt PBI-01, kiểm chứng PBI-02 và phối hợp sửa lỗi API; frontend dùng hợp đồng API để rà soát PBI-03/04. Tuần tiếp theo hoàn tất tích hợp, bộ ca B5 và PBI-05. Nếu nhóm chọn Sprint một tuần, giảm số PBI theo sức chứa và ghi quyết định; không giảm tiêu chí nghiệm thu để báo xong.

**Điều kiện Done Sprint 1:** đạt tiêu chí PBI và ngưỡng B5 liên quan, có kết quả thực tế kèm commit/PR, review của A theo TEAM.md, cập nhật tài liệu, không còn lỗi chặn luồng demo. PBI chưa đạt chuyển tiếp bằng issue và ghi lý do. Các việc này được thực hiện trong Sprint; bài B6 trên lớp chỉ yêu cầu tài liệu, không yêu cầu viết frontend thật.

**Ngoài phạm vi:** thanh toán online, POS, mobile native và tính năng mở rộng ngoài MVP. R4 chưa được xem là đã giải quyết bằng xác thực; chỉ demo dữ liệu mẫu, đánh giá biện pháp bảo vệ trước khi dùng dữ liệu thật.

## 5. Cách nộp và cập nhật

Bài nộp gồm [TEAM.md](TEAM.md) và báo cáo này trong thư mục `docs/buoi-6/` theo cách tổ chức bài của nhóm, liên kết từ README. Sau khi commit/push, dùng [repo nhóm](https://github.com/fngdng/khkt) hoặc PR chứa hai file để nộp. Chưa có PR mới cho B6 tại thời điểm soạn báo cáo; không ghi đã nộp hoặc đã được duyệt. Khi có kết quả kiểm chứng, bổ sung permalink commit/PR, người chạy và kết quả vào từng hạng mục, không ghi đè bằng chứng cũ.
