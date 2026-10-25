# WBS and Gantt

## WBS

| WBS | Hạng mục               | Kết quả                                                         |
| --- | ------------------------ | ----------------------------------------------------------------- |
| 1.0 | Khởi động dự án     | Xác định mục tiêu, phạm vi, charter                         |
| 1.1 | Phân tích yêu cầu    | Xác định use case đặt bàn cốt lõi                         |
| 1.2 | Lập kiến trúc sơ bộ | Chốt Node.js, luồng dữ liệu, cấu trúc thư mục             |
| 1.3 | Thiết kế nghiệp vụ   | Quy tắc gán bàn, kiểm tra xung đột, trạng thái đặt bàn |
| 2.0 | Phát triển lõi        | Viết module quản lý đặt bàn                                 |
| 2.1 | Viết test               | Test validation, conflict, table assignment                       |
| 2.2 | Thiết lập CI           | GitHub Actions chạy test và lint                                |
| 2.3 | Hoàn thiện tài liệu  | Charter, WBS, Gantt, hướng dẫn chạy                           |
| 3.0 | Hoàn thiện nộp bài   | Review, tạo PR, chụp trạng thái CI xanh                       |

## Gantt

```mermaid
gantt
    title Kế hoạch thực hiện đồ án quản lý đặt bàn nhà hàng
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Khởi động
    Chốt đề tài và Project Charter     :a1, 2026-10-03, 1d
    Phân tích yêu cầu                  :a2, after a1, 1d

    section Thiết kế và phát triển
    Thiết kế nghiệp vụ                 :b1, after a2, 2d
    Phát triển module Node.js          :b2, after b1, 2d
    Viết test tự động                  :b3, after b2, 1d

    section Tích hợp và nộp bài
    Cấu hình GitHub Actions CI         :c1, after b3, 1d
    Rà soát tài liệu và tạo PR         :c2, after c1, 1d
```
