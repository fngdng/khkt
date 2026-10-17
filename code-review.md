# Đánh giá dự án: Hệ thống quản lý đặt bàn nhà hàng

| Mục | Nội dung |
|---|---|
| Ngày đánh giá | 17/10/2026 |
| Phiên bản được đánh giá | Nhánh `main`, commit `49d3320` (Merge pull request #7 từ `fngdng-patch-2`) |
| Người soạn | [điền tên] |
| Phạm vi | Toàn bộ mã nguồn, cấu hình, tài liệu trong repository |

## 1. Phương pháp và phạm vi kiểm chứng

Tài liệu này được soạn với sự hỗ trợ của công cụ AI (Claude) dựa trên việc đọc toàn bộ mã nguồn. Người soạn cần tự đối chiếu các nhận định với mã nguồn trước khi dùng làm căn cứ.

**Đã kiểm chứng bằng cách chạy thật**

- `npm test`: 5/5 test pass (Node 22 trên môi trường Linux, và Node 24 trên máy Windows của người soạn).
- `npm ci` thành công trên Node 24 (344 gói).
- `npm run lint` khi chưa cài dependency: thất bại (xem mục V08).
- Hành vi chuyển đổi kiểu `DATE` của thư viện `pg` theo múi giờ (xem mục V04).

**Chưa kiểm chứng (đánh giá qua đọc mã)**

- `next build`, giao diện trên trình duyệt, kết nối PostgreSQL thật, `npm run lint` khi đã cài dependency.
- Trạng thái thật của CI trên tab Actions của GitHub.
- Cách nhóm đang triển khai trên VPS.

## 2. Tổng quan

Đồ án học phần CSE3045 (Trường Đại học Việt Nhật). Ứng dụng web gồm:

- Trang khách `/`: đặt bàn, tra cứu bằng số điện thoại, hủy đặt bàn.
- Trang quản trị `/admin`: tạo đặt bàn, xem sơ đồ bàn, duyệt, ghi nhận khách đến, hủy.
- API REST (Next.js Route Handlers) và PostgreSQL 16 chạy bằng Docker Compose.
- CI bằng GitHub Actions, tài liệu Project Charter và WBS/Gantt.

Chi tiết kiến trúc xem [architecture.md](architecture.md), API xem [api.md](api.md), database xem [database.md](database.md).

## 3. Điểm mạnh

- **Tách logic nghiệp vụ khỏi hạ tầng.** `src/reservationService.js` là hàm thuần, không phụ thuộc database nên kiểm thử dễ.
- **Truy vấn tham số hóa** (`$1`, `$2`) trong `reservationRepository.js`, không có nguy cơ SQL injection ở các truy vấn hiện có.
- **Schema có ràng buộc:** `CHECK` cho trạng thái, sức chứa, thời lượng; khóa ngoại từ `reservations.table_id` sang `tables.id`; có index theo số điện thoại và khung giờ.
- **Dễ dựng lại môi trường:** có `.env.example`, `docker-compose.yml`, README tiếng Việt, script nạp dữ liệu mẫu.
- **Có quy trình kỹ thuật cơ bản:** CI, Project Charter, WBS và Gantt (Mermaid).
- **`.gitignore` đúng cách:** chặn `.env.*` nhưng giữ `.env.example`.
- **Giao diện có chú ý trải nghiệm:** validation phía client, thông báo trạng thái, `role="status"`, `aria-live`.

## 4. Vấn đề phát hiện

Mức độ: **Cao** (ảnh hưởng dữ liệu, bảo mật hoặc kết quả sai), **Vừa** (sai lệch hành vi hoặc rủi ro có điều kiện), **Thấp** (vệ sinh mã, tài liệu).

### 4.1 Mức cao

| Mã | Vị trí | Vấn đề | Hướng khắc phục gợi ý |
|---|---|---|---|
| V01 | `app/api/reservations/route.js` dòng 50 đến 73 | **Race condition khi đặt bàn.** Luồng POST đọc toàn bộ đặt bàn, kiểm tra xung đột trong bộ nhớ rồi mới insert, không có transaction hay khóa. Hai yêu cầu đồng thời có thể cùng giữ một bàn trong một khung giờ. | Đưa kiểm tra và insert vào một transaction có khóa (`SELECT ... FOR UPDATE`), hoặc dùng ràng buộc loại trừ (`EXCLUDE USING gist`, cần extension `btree_gist`) để database tự chặn trùng lịch. |
| V02 | `app/admin/page.js`; `app/api/reservations/[id]/route.js` dòng 7 đến 39 | **Không có xác thực.** Ai biết địa chỉ cũng vào được `/admin` và gọi `PATCH` để duyệt hoặc hủy đặt bàn của người khác. | Thêm đăng nhập cho trang admin và kiểm tra quyền ở các route thay đổi dữ liệu. |
| V03 | `app/api/reservations/route.js` dòng 21 đến 34 | **Lộ dữ liệu cá nhân.** `GET /api/reservations` không kèm `phone` trả về toàn bộ tên và số điện thoại cho bất kỳ ai gọi. Tra cứu theo số điện thoại cũng không có bước xác minh. | Tách endpoint dành cho admin (có xác thực) khỏi endpoint tra cứu của khách; cân nhắc mã đặt bàn hoặc OTP. README ghi rõ thiết kế "không cần tài khoản", nhóm cần quyết định mức rủi ro chấp nhận được. |
| V04 | `src/server/reservationRepository.js` dòng 42, 94, 133 | **Ngày đặt bàn có thể lệch một ngày theo múi giờ của máy chạy server.** Repository dùng `row.reservation_date.toISOString().slice(0, 10)`. Thư viện `pg` trả kiểu `DATE` thành đối tượng `Date` ở 00:00 theo giờ địa phương của server, nên khi đổi sang UTC, ngày bị lùi lại trên máy có múi giờ phía đông UTC. Đã kiểm chứng: với `TZ=Asia/Ho_Chi_Minh`, giá trị `2026-10-17` trả về `2026-10-16`; với `TZ=UTC` thì đúng. Hệ quả: hiển thị sai ngày và kiểm tra xung đột so sánh sai ngày. | Lấy ngày dưới dạng chuỗi từ SQL (ví dụ `to_char(reservation_date, 'YYYY-MM-DD')` hoặc `reservation_date::text`), hoặc đăng ký lại bộ phân tích kiểu `DATE` của `pg` để trả chuỗi. |

### 4.2 Mức vừa

| Mã | Vị trí | Vấn đề | Hướng khắc phục gợi ý |
|---|---|---|---|
| V05 | `app/api/reservations/route.js` dòng 30, 76; `[id]/route.js` dòng 35; `tables/route.js` dòng 11 | Các route trả `details: error.message` cho client, có thể lộ thông tin nội bộ của database hoặc kết nối. | Ghi log phía server, chỉ trả thông báo chung cho client. |
| V06 | `app/api/reservations/[id]/route.js` dòng 5, 13 | Cập nhật trạng thái không kiểm tra luồng chuyển: có thể chuyển `cancelled` sang `arrived`, hoặc "hồi sinh" lượt đã hủy mà không kiểm tra xung đột lại. `id` không phải số sẽ gây lỗi 500 thay vì 400. | Định nghĩa bảng chuyển trạng thái hợp lệ; kiểm tra lại xung đột khi mở lại; trả 400 cho `id` không hợp lệ. |
| V07 | `src/reservationService.js` dòng 44, 56 đến 67 | Chỉ kiểm tra đặt bàn ở phía client về ngày trong quá khứ (`min` ở `CustomerPortal.jsx` dòng 153), server không chặn. `Date.parse` chấp nhận nhiều chuỗi không đúng định dạng ngày ISO. Kiểm tra xung đột chỉ so cùng `date`, nên đặt bàn vắt qua nửa đêm không được tính. Không có giờ mở cửa hay thời lượng tối đa. | Kiểm tra ngày theo định dạng `YYYY-MM-DD` chặt chẽ, chặn quá khứ, quy định giờ mở cửa và thời lượng tối đa ở server. |
| V08 | `.github/workflows/ci.yml` dòng 23 đến 27; `package.json` (script `lint`) | **Workflow CI không có bước cài dependency** (`npm ci`), nhưng bước thứ hai chạy `npm run lint`, tức `eslint . && node --check ...`, cần ESLint và các cấu hình trong `node_modules`. Đã kiểm chứng: khi chưa cài dependency, lệnh này thất bại (`ERR_MODULE_NOT_FOUND`). Bước `npm test` thì vẫn chạy được vì test chỉ dùng module có sẵn của Node. CI rất có thể đang đỏ ở bước này, cần đối chiếu với tab Actions. CI cũng chưa chạy `next build`. | Thêm `npm ci` trước các bước kiểm tra; bổ sung bước `next build` (có thể cần biến môi trường `DATABASE_URL` giả vì `db.js` ném lỗi khi thiếu biến). |
| V09 | `src/reservationService.js` dòng 134; `app/api/reservations/route.js` dòng 70; `test/reservationService.test.js` dòng 86 | Không nhất quán về trạng thái: `createReservation` trả `confirmed`, route lại ghi đè thành `pending`, còn test khẳng định `confirmed`. Test đang xác nhận hành vi không phải luồng thực tế. | Thống nhất một nơi quyết định trạng thái ban đầu và cập nhật test cho khớp. |
| V10 | `app/components/ReservationManager.jsx` dòng 8, 132 | Múi giờ không nhất quán: `DEFAULT_FORM.date` viết cứng `'2026-10-17'`; thống kê "Hôm nay" dùng `new Date().toISOString()` (UTC) nên có thể sai trong khung 0h đến 7h sáng giờ Việt Nam. Trang khách thì dùng giờ `Asia/Ho_Chi_Minh` (`CustomerPortal.jsx` dòng 12 đến 21). | Dùng chung một hàm lấy ngày theo múi giờ Việt Nam và bỏ ngày viết cứng. |

### 4.3 Mức thấp

| Mã | Vị trí | Vấn đề |
|---|---|---|
| V11 | `docker-compose.yml` | Cổng `5433:5432` mở trên mọi giao diện mạng và mật khẩu mặc định `restaurant_pass`. Chấp nhận được cho môi trường phát triển; khi triển khai lên VPS cần giới hạn cổng (`127.0.0.1:5433:5432`) và đổi mật khẩu. Chưa biết nhóm triển khai thế nào nên đây là rủi ro cần kiểm tra. |
| V12 | `src/server/db.js` dòng 7 đến 9 | Ném lỗi ngay khi import nếu thiếu `DATABASE_URL`, có thể làm `next build` thất bại khi không có biến môi trường. |
| V13 | `src/server/reservationRepository.js` | `getReservations()` luôn đọc toàn bộ bảng khi kiểm tra xung đột. Ổn với quy mô đồ án, nên lọc theo ngày khi dữ liệu lớn dần. |
| V14 | `docker/postgres/init/01-init.sql` | Hai đặt bàn mẫu cố định ngày `2026-10-17`, sau này thành dữ liệu quá khứ. |
| V15 | `src/reservationService.js` dòng 126 | `id: res-${n}` do service sinh ra là thừa, vì database tự sinh `id` (kiểu `SERIAL`). |
| V16 | `app/api/reservations/route.js` dòng 38, 45, 46 | JSON hỏng trả về 500 thay vì 400; `Number(null)` và `Number("")` thành `0` thay vì báo thiếu trường. |
| V17 | `package.json` | `eslint ^10.12.0` không khớp khai báo peer của các plugin trong `eslint-config-next` (hỗ trợ tối đa eslint 9), gây cảnh báo `ERESOLVE`. `npm ci` còn báo 5 lỗ hổng mức high (chưa xác định thuộc gói nào). Không dùng `npm audit fix --force` khi chưa thống nhất với nhóm. |
| V18 | `index.html` | Trang bìa còn placeholder "Tên đồ án của nhóm" và "Nhóm []". |
| V19 | `docs/project-charter.md`, `docs/wbs-gantt.md` | Tài liệu mô tả "prototype Node.js cho logic nghiệp vụ", trong khi sản phẩm hiện là ứng dụng Next.js và PostgreSQL; mục "trạng thái bàn theo thời gian thực" hiện chỉ có nút "Tải lại". |
| V20 | `README.md` | Tệp có BOM đầu tệp (UTF-8 with BOM), nên thống nhất bằng `.editorconfig`. |

## 5. Kiểm thử

- 5 test hiện có chỉ phủ lớp logic thuần, chạy nhanh và ổn định.
- **Thiếu:** nhánh chọn bàn cụ thể (bàn không tồn tại, thiếu chỗ, trùng lịch); các ca biên (kết thúc đúng lúc bắt đầu thì không xung đột); lượt đã hủy; kiểm tra định dạng ngày; không có test cho API hay repository.

## 6. Thứ tự ưu tiên đề xuất

1. V08: sửa CI trước tiên vì ảnh hưởng đến toàn bộ quy trình kiểm tra (chỉ cần thêm bước cài dependency).
2. V04 và V01: đảm bảo dữ liệu đặt bàn không sai ngày và không trùng bàn.
3. V02, V03, V05: bảo mật trước khi mở rộng sử dụng thật.
4. V06, V07, V09, V10: độ đúng của nghiệp vụ.
5. Các mục thấp và cập nhật tài liệu.

Các mục từ V01 đến V10 đều cần sửa mã cũ nên nên được ghi thành Issue riêng để nhóm thống nhất người thực hiện trước khi sửa.
