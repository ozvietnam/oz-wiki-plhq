# Báo cáo đóng gói lô TB-TCHQ → hs-code-api

- Vào: `data/customs/processed/tracuuhs-detail-2026-10-14-goi-095.json` — 20 bản ghi
- Ra: `data/customs/lo/tracuuhs-2026-10-14-goi-095.json` — **5 bản ghi đạt** (trùng trong lô bỏ: 0)
- Cần xử tay: **15**

## Vào lô
- 5950/TB-TCHQ (2024-11-29) → 84313990 — Thông báo 5950/TB-TCHQ 2024 kết quả xác định trước mã số đối với Con l…
- 5951/TB-TCHQ (2024-11-29) → 84313990 — Thông báo 5951/TB-TCHQ 2024 kết quả xác định trước mã số Con lăn giảm …
- 573/TB-TCHQ (2019-01-24) → 84733090 — SAS000536AĐầu cài phía trên của bút cảm ứng dùng cho điện thoại di độn…
- 1909/TB-TCHQ (2018-04-10) → 84798939 — Thông báo 1909/TB-TCHQ 2018 kết quả xác định trước mã số Đơn vị sản xu…
- 701/TB-TCHQ (2019-01-30) → 84804900 — Cây lấy mẫu có nhôm Sampling Probe (have AL) IMM-S1/A1-1145, hàng mới …


## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)
- 5922/TB-TCHQ/2024 → null: ma_hs không phải 8 số — "Vercel Security Checkpoint"
- 715/TB-TCHQ/2025 → 84248990: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 715/TB-TCHQ 2025 kết quả xác định trước mã số đối với Bình xịt mũi | H"
- 1538/TB-TCHQ/2023 → 84287000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1538/TB-TCHQ 2023 kết quả xác định trước mã số đối với Robot tự hành A"
- 2106/TB-TCHQ/2023 → 84439990: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 2106/TB-TCHQ 2023 kết quả xác định trước mã số Con lăn trung gian IDLE"
- 3270/TB-TCHQ/2018 → 84561100: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3270/TB-TCHQ 2018 kết quả xác định trước mã số hệ thống đánh dấu kim c"
- 2580/TB-TCHQ/2023 → 84714190: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 2580/TB-TCHQ 2023 xác định trước mã số Màn hình tương tác cảm ứng LED "
- 5501/TB-TCHQ/2023 → 84714190: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5501/TB-TCHQ 2023 kết quả xác định trước mã số | HSTC"
- 5666/TB-TCHQ/2022 → 84713090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5666/TB-TCHQ 2022 kết quả xác định trước mã số kính thực tế ảo HoloLen"
- 437/TB-TCHQ/2025 → 84733090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 437/TB-TCHQ 2025 kết quả xác định trước mã số HPE Synergy 12000 Frame "
- 939/TB-TCHQ/2025 → 84733090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 939/TB-TCHQ 2025 Kết quả xác định trước mã số Vỏ phía trên của trạm nộ"
- 940/TB-TCHQ/2025 → 84733090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 940/TB-TCHQ 2025 kết quả xác định trước mã số đối với Vỏ phía dưới của"
- 2470/TB-TCHQ/2022 → 84798939: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 2470/TB-TCHQ 2022 kết quả xác định trước mã số đối với Electric tailga"
- 3812/TB-TCHQ/2023 → 84798969: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3812/TB-TCHQ 2023 kết quả xác định trước mã số đối với Propeller Posit"
- 4708/TB-TCHQ/2024 → 84798969: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4708/TB-TCHQ 2024 kết quả xác định trước mã số đối với Wearable thermo"
- 3582/TB-TCHQ/2022 → 84818099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3582/TB-TCHQ 2022 kết quả xác định trước mã số máy sấy tay Dyson WD04 "

## Bước tiếp
1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).
2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.
3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).
