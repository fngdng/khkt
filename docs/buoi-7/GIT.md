# Buổi 7 — Quy ước Git và phát hành đầu tiên

Repo: [fngdng/khkt](https://github.com/fngdng/khkt). Tài liệu B7 nằm trong `docs/buoi-7/`. Xem [CONFIG.md](CONFIG.md) và [STAKEHOLDERS.md](STAKEHOLDERS.md).

## 1. Nhánh và commit

- `main`: nhánh tích hợp; thay đổi mới qua PR, không push trực tiếp.
- `work`: nhánh làm việc hiện có; không mặc nhiên là bản được nghiệm thu. Sau bài B7, ưu tiên nhánh ngắn cho từng issue thay vì gom nhiều nhiệm vụ.
- Tạo nhánh từ bản `main` cập nhật: `feature/<issue>-<mo-ta>`, `fix/<issue>-<mo-ta>`, `docs/<issue>-<mo-ta>`.
- Commit gọn một mục đích: `feat: ...`, `fix: ...`, `docs: ...`; nêu nội dung cụ thể, liên kết issue nếu có. Chỉ stage file thuộc nhiệm vụ, tránh `git add .` khi có thay đổi khác.
- Cập nhật nhánh cuối ngày có làm việc. Không commit secret, build output hoặc dependency đã cài; giữ lockfile khi sửa thư viện.

## 2. Quy trình Pull Request

1. Tạo issue gồm mục tiêu, phạm vi, người làm, người duyệt và tiêu chí hoàn thành; liên kết ID backlog/PBI.
2. Tạo nhánh, làm thay đổi và chạy kiểm tra phù hợp. PR tài liệu kiểm tra link/nội dung; PR code chạy test/lint và kiểm chứng phần thay đổi.
3. Mở PR về `main`: mô tả vấn đề, kết quả mới, cách kiểm tra, bằng chứng và phần chưa kiểm. Không viết “CI xanh” nếu chưa xác minh workflow.
4. Ít nhất một người khác review. Phong review frontend/tài liệu; Phúc review backend/DB; nếu reviewer là tác giả thì giao thành viên khác. Đăng kiểm tra tên, link và hiện vật bài nộp.
5. Sửa nhận xét, thống nhất `DECISION:` khi đổi API/schema/phạm vi. Chỉ merge khi reviewer đồng ý và các kiểm tra bắt buộc đạt. Khuyến nghị bật branch protection yêu cầu PR/review/CI; chưa xác nhận đã bật.
6. Sau merge, CC kiểm tra SHA trên nhánh đích, gắn tag và đẩy tag; tạo gói từ chính tag đó. Không kéo thay đổi chưa commit vào gói bàn giao.

Xung đột: thông báo người sửa cùng file, thống nhất nội dung, xử lý từng đoạn và kiểm tra lại trước commit. Không force-push nhánh chung; không sửa lịch sử/tag đã công bố. Nhánh riêng chỉ được viết lại khi đã thống nhất với người review.

## 3. SemVer và quy ước tag

Tag có dạng `vMAJOR.MINOR.PATCH`. PATCH cho sửa lỗi tương thích, MINOR cho thêm chức năng tương thích, MAJOR cho thay đổi phá vỡ hợp đồng khi API đã ổn định. Trong giai đoạn `0.y.z`, thay đổi API tăng MINOR và ghi hướng dẫn chuyển đổi. Mỗi lần demo/phát hành chọn phiên bản phù hợp, kiểm tra tag chưa tồn tại, tạo annotated tag và ghi SHA, nội dung, kiểm thử, giới hạn, khác biệt với bản trước.

Không dùng `--force` để gán lại tag. Sai bản phát hành phải đính chính và phát hành phiên bản mới. Tag và gói bàn giao bất biến; sửa working tree sau tag không làm thay đổi snapshot.

## 4. Mốc đầu tiên `v0.1.0` — Sprint 1 hiện tại

**Phạm vi:** mốc đầu tiên của bài B7, chụp lại mã MVP và hồ sơ đã commit; chưa tuyên bố ứng dụng đã được kiểm chứng trọn luồng. Tag được tạo trên commit bổ sung ba tài liệu B7, kế tiếp commit nền `84229f3d1a0682e44a134ec760d8d7603cb564fe`. Tra SHA chính xác bằng `git rev-parse 'v0.1.0^{commit}'`; chú thích tag chứa SHA đầy đủ. Không nhúng SHA commit chứa chính file này vào nội dung file để tránh tham chiếu vòng.

| Nội dung ghi chú phát hành | Kết quả / phạm vi |
|---|---|
| Snapshot | Next.js, API đặt bàn, PostgreSQL schema/dữ liệu mẫu, test/workflow và tài liệu đang được Git theo dõi; thêm `docs/buoi-7/CONFIG.md`, `STAKEHOLDERS.md`, `GIT.md`. |
| So với bản trước | Chưa có tag phát hành trước trong repo local lúc chuẩn bị B7; đây là mốc tag đầu tiên. So với commit nền: bổ sung kế hoạch cấu hình, stakeholder và quy ước Git. |
| Kiểm tra đã chạy | `npm test` thành công trên mã nền trong lần chuẩn bị B7; Node runner ghi 1 test file đạt, 0 lỗi. Thay đổi phát hành chỉ là tài liệu; không suy ra bộ nghiệm thu B5 đã đạt. Kiểm tra cấu trúc tài liệu và link trước commit. |
| Chưa kiểm tra | Build, lint, web/DB, luồng giao diện/API đầy đủ, đồng thời và backup/restore chưa được kiểm chứng cho phát hành này; chưa xác minh CI GitHub hoặc phê duyệt của thành viên. |
| Hiện vật ngoài commit | Học liệu HTML B7 chưa được đưa vào commit này. Các thao tác xóa file B6 trong working tree không thuộc thay đổi phát hành; snapshot vẫn chứa phiên bản B6 đã commit trước đó. |
| Chính sách mốc B7 | Gắn tag mốc hiện tại theo yêu cầu bài; chưa coi đây là kết quả quy trình review + CI + merge hoàn chỉnh. Các phát hành tiếp theo tuân thủ mục 2 và ưu tiên bản có luồng chạy được. |

**Nguồn nhận diện phiên bản đồ án:** tag Git. `package.json` còn giá trị package private `1.0.0`; giá trị này chưa phải lịch sử phát hành và cần được thống nhất trước mốc ổn định.

## 5. Tạo, công bố và kiểm tra

CC kiểm tra trạng thái và đảm bảo chỉ commit file của nhiệm vụ; không tự ghi nhận review đã diễn ra. Khi tạo tag đầu tiên, thay `<release-commit-sha>` bằng SHA đầy đủ của commit B7, không dùng nguyên placeholder:

```bash
git status --short
git tag --list
git tag -a v0.1.0 <release-commit-sha> -F /tmp/khkt-v0.1.0-notes.txt
git show --no-patch v0.1.0
git push origin refs/tags/v0.1.0
git ls-remote origin refs/tags/v0.1.0 'refs/tags/v0.1.0^{}'
```

Ghi chú trong file tạm phải có SHA, nội dung snapshot và kiểm thử đúng bảng trên. Với các mốc sau, chọn phiên bản mới và commit đã merge/kiểm chứng. Dùng lệnh sau để tra lại hoặc tạo gói nguồn, không cần đổi working tree đang có thay đổi:

```bash
git rev-parse 'v0.1.0^{commit}'
git ls-tree -r --name-only v0.1.0
git archive --format=zip --output=/tmp/khkt-v0.1.0.zip v0.1.0
```

Link nộp khi tag đã được đẩy thành công: [repo tại tag v0.1.0](https://github.com/fngdng/khkt/tree/v0.1.0), [danh sách tag](https://github.com/fngdng/khkt/tags). Tag Git không yêu cầu tạo thêm một GitHub Release. Nếu push chưa thành công, chỉ báo tag local và tiếp tục công bố; không coi link remote là bằng chứng có sẵn. Bài thực hành không đặt hạn nộp trong quy ước này.
