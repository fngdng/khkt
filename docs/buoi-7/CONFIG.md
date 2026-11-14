# Buổi 7 — Kế hoạch quản lý cấu hình

Đồ án: **Hệ thống quản lý đặt bàn nhà hàng** · CSE3045. Tài liệu của bài B7 đặt trong `docs/buoi-7/`, không bổ sung nội dung từng buổi vào README chung. Không đặt hạn nộp trong kế hoạch này.

## 1. Quản lý những gì?

| Đối tượng cấu hình | Vị trí / nội dung | Cách nhận diện phiên bản |
|---|---|---|
| Mã ứng dụng | `app/`, `src/`, API, giao diện khách và nhân viên | Đường dẫn + commit SHA |
| Cơ sở dữ liệu | `docker/postgres/init/01-init.sql`, `database.md`; schema và dữ liệu mẫu | Commit chứa schema; thay đổi sau khởi tạo cần script migration riêng |
| Môi trường và thư viện | `package.json`, `package-lock.json`, `.env.example`, Docker và workflow CI | Commit + lockfile; lưu tên biến, không lưu secret |
| Tài liệu dự án | Charter, WBS, API, kiến trúc, B4 backlog Excel/wireframe, B5 rủi ro/chất lượng, B6/B7 | Đường dẫn + commit; file Excel là hiện vật có phiên bản, tránh sửa đồng thời |
| Kiểm thử và bằng chứng | `test/`, checklist/log/ảnh được bổ sung khi chạy thật | Commit kiểm thử, người chạy, điều kiện, kết quả mong đợi/thực tế |
| Gói bàn giao | Snapshot nguồn từ tag và ghi chú phát hành | Tag SemVer + SHA; tạo archive từ đúng tag |

Không đưa `node_modules`, `.next`, file `.env.local`, mật khẩu hoặc dump chứa dữ liệu khách thật vào Git. Git không sao lưu dữ liệu trong Docker volume.

## 2. Vai trò và trách nhiệm?

| Vai trò | Thành viên | Trách nhiệm |
|---|---|---|
| Quản lý cấu hình (CC), quản lý tag | Đặng Thanh Phong — 23110329 | Kiểm tra SHA, nội dung gói, backup và tạo/push tag; phụ trách backend/DB |
| Reviewer phát hành, điều phối Sprint 1 | Phùng Xuân Phúc — 23110211 | Đối chiếu snapshot và checklist; review thay đổi backend/DB; phụ trách frontend |
| Hồ sơ bàn giao, stakeholder | Đỗ Hải Đăng — 23110332 | Cập nhật tài liệu, ghi chú phát hành, quyết định, phản hồi và link minh chứng |

Người sửa mở PR; ít nhất một thành viên khác rà soát. Phong duyệt phần frontend/tài liệu, Phúc duyệt phần backend/DB; phần việc do người duyệt tự sửa phải giao người khác review. CC tạo tag theo kết luận review, không dùng tag làm bằng chứng đã được phê duyệt. Phân công này kế thừa vai chuyên môn B4 và quy trình B6; khi đổi người phải ghi `DECISION:` trong issue/PR.

CC bàn giao sau mỗi Sprint theo vòng **Phong → Phúc → Đăng**, độc lập với vai điều phối. Bàn giao gồm tag/SHA cuối, thay đổi chưa hợp nhất, backup gần nhất, cách phục hồi và rủi ro đang mở.

## 3. Công cụ?

Git lưu lịch sử; GitHub lưu repo, PR, issue và tag; GitHub Actions chạy test/lint theo workflow. Node.js/Next.js, npm lockfile và Docker Compose dùng tái lập môi trường. PostgreSQL lưu dữ liệu; `pg_dump`/`pg_restore` phục vụ backup. Excel dùng cập nhật backlog B4; người sửa thông báo để tránh xung đột file nhị phân. Chưa có bằng chứng branch protection hoặc backup tự động được bật; đây là các quy ước cần cấu hình/kiểm chứng, không coi đã triển khai.

## 4. Điểm mốc?

| Mốc | Thành phần phải tìm lại được | Phiên bản |
|---|---|---|
| Chuẩn bị Sprint 0 | Repo, phạm vi, phân vai, backlog, wireframe | Các commit B4, không tạo ngược một tag lịch sử chưa có |
| Mốc hiện tại Sprint 1 / B7 | Mã MVP, schema, test, tài liệu đã commit và ba tài liệu B7; ghi rõ giới hạn kiểm chứng | `v0.1.0`, tag đầu tiên cho bài B7 |
| Demo tiếp theo | Luồng đặt → duyệt → tra cứu/hủy đã kiểm chứng; log/ảnh, hướng dẫn và lỗi còn mở | `v0.2.0` nếu thêm khả năng tương thích; `v0.1.1` nếu chỉ sửa lỗi |
| Nghiệm thu ổn định | Hợp đồng API được chốt và tiêu chí nghiệm thu được kiểm tra | `v1.0.0` khi đủ điều kiện, chưa tuyên bố hiện tại |

Mỗi mốc phát hành phải gắn annotated tag. B7 cho phép tag snapshot hiện tại dù chưa có luồng được kiểm chứng trọn; các phát hành tiếp theo áp dụng PR → review → CI đạt → merge → tag → gói bàn giao. Ghi chú phát hành luôn nêu SHA, hiện vật, kết quả kiểm tra, phần chưa kiểm và thay đổi so với bản trước.

## 5. Quy ước đặt tên và SemVer?

- Thư mục bài học: `docs/buoi-<số>/`; tài liệu B7: `CONFIG.md`, `STAKEHOLDERS.md`, `GIT.md`.
- Nhánh: `feature/<issue>-<mo-ta>`, `fix/<issue>-<mo-ta>`, `docs/<issue>-<mo-ta>`; dùng chữ thường, không dấu, dấu gạch nối. Nếu chưa có issue, dùng mô tả và bổ sung liên kết trong PR.
- Tag: `vMAJOR.MINOR.PATCH`, ví dụ `v0.1.0`; số phiên bản là `0.1.0`, chữ `v` là tiền tố tag.
- PATCH: sửa lỗi tương thích; MINOR: thêm chức năng tương thích; MAJOR: thay đổi không tương thích sau khi API ổn định. Với `0.y.z`, sản phẩm còn thử nghiệm; quy ước nhóm tăng MINOR khi thay đổi hợp đồng API và ghi hướng dẫn chuyển đổi. Không ngụ ý phiên bản 0.x đã có cam kết API ổn định.
- `package.json` hiện ghi `1.0.0` của package private, chưa được nhóm dùng làm lịch sử phát hành. Tag Git và ghi chú là nguồn nhận diện mốc đồ án hiện tại; cần thống nhất đồng bộ manifest trước mốc ổn định, không coi giá trị package là bằng chứng đã phát hành v1.0.0.

Không sửa nội dung hoặc di chuyển tag đã công bố. Phát hiện sai thì ghi đính chính và tạo phiên bản mới; không force-push tag.

## 6. Quy ước thay đổi?

Tạo issue → làm rõ và ghi tiêu chí → giao người làm/reviewer → nhánh riêng → commit → PR → review/kiểm tra → merge. Đẩy nhánh ít nhất cuối ngày có thay đổi; không đưa việc chưa review thẳng vào `main`. Nhánh `work` hiện có được xem là nhánh làm việc lịch sử, không mặc nhiên là bản đã nghiệm thu.

Issue theo dõi: Mới → Làm rõ → Chờ duyệt → Đã duyệt → Đang làm → Review → Đóng. Lỗi chỉ đóng sau khi chạy lại ca lỗi; yêu cầu đổi sau nghiệm thu tạo issue mới liên kết issue cũ. Quyết định dùng comment `DECISION:` nêu bối cảnh, lựa chọn, tác động API/DB, người duyệt và việc tiếp theo. Thay đổi DB phải có cách nâng cấp/khôi phục; sửa init SQL không tự cập nhật volume đã tồn tại.

CC rà soát mỗi cuối Sprint: file và tag khớp SHA, link minh chứng truy vết được, ghi chú đúng kết quả thực tế, không có secret và có backup. Xung đột phải được người liên quan thống nhất; không chọn toàn bộ một phía mà bỏ qua thay đổi người khác.

## 7. Sao lưu và phục hồi?

| Nội dung | Người / chu kỳ đề xuất | Cách sao lưu và kiểm chứng |
|---|---|---|
| Mã nguồn, tag, tài liệu đã commit | CC cuối ngày có thay đổi và mỗi mốc | Push đúng nhánh/tag lên GitHub; cuối Sprint tạo `git bundle create khkt-<version>.bundle --all`, lưu một bản ở thiết bị/nơi riêng; kiểm tra bằng `git bundle verify`. |
| PostgreSQL | Người backend trước thay đổi schema và mỗi ngày có dữ liệu demo quan trọng | Dùng `pg_dump -Fc` với đúng kết nối của môi trường; lưu file ngoài repo, giới hạn quyền truy cập; không đưa mật khẩu vào lệnh chia sẻ/log. |
| File môi trường thật | Người giữ môi trường khi thay đổi | Lưu bí mật ở nơi riêng có kiểm soát truy cập; repo chỉ lưu `.env.example` và mô tả tên biến. |

Giữ tối thiểu 3 bản backup gần nhất và bản của mốc demo hiện tại, nếu dung lượng cho phép. Mỗi Sprint thử phục hồi vào thư mục/DB thử riêng: clone hoặc restore bundle, checkout tag, cài từ lockfile, restore dump bằng `pg_restore`, chạy kiểm tra luồng mẫu. Ghi ngày, người thực hiện, tag/SHA và kết quả. Không phục hồi đè DB đang sử dụng khi chưa thống nhất. Các bước trên là kế hoạch; chưa có log xác nhận đã backup/restore trong bài B7.

Quy trình thao tác và ghi chú tag đầu tiên: [GIT.md](GIT.md). Danh sách bên liên quan: [STAKEHOLDERS.md](STAKEHOLDERS.md).
