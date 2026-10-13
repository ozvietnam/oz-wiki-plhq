# Báo cáo đóng gói lô TB-TCHQ → hs-code-api

- Vào: `data/customs/processed/tracuuhs-detail-2026-10-14-goi-098.json` — 20 bản ghi
- Ra: `data/customs/lo/tracuuhs-2026-10-14-goi-098.json` — **6 bản ghi đạt** (trùng trong lô bỏ: 0)
- Cần xử tay: **14**

## Vào lô
- 6108/TB-TCHQ (2018-10-17) → 85235130 — Thẻ định vị GPS (thẻ SD) dùng cho hệ thống dẫn đường trang bị trên xe …
- 238/TB-TCHQ (2022-01-19) → 85258059 — Thông báo 238/TB-TCHQ 2022 kết quả xác định trước mã số Camera ảnh nhi…
- 491/TB-TCHQ (2022-02-16) → 85255000 — Thông báo 491/TB-TCHQ 2022 kết quả xác định trước mã số bộ định tuyến …
- 2978/TB-TCHQ (2018-05-29) → 85269200 — Thông báo 2978/TB-TCHQ 2018 kết quả xác định trước mã số Điều khiển củ…
- 477/TB-TCHQ (2025-01-24) → 85286200 — Thông báo 477/TB-TCHQ 2025 kết quả xác định trước mã số đối với Máy ch…
- 7389/TB-TCHQ (2018-12-17) → 85319090 — Nhãn báo động dùng cho hệ thống báo động chống trộm. Cấu tạo gồm: tấm …


## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)
- 2395/TB-TCHQ/2022 → 85176259: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 2395/TB-TCHQ 2022 kết quả xác định trước mã số đối với Thiết bị liên l"
- 6440/TB-TCHQ/2024 → 85176259: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 6440/TB-TCHQ 2024 kết quả xác định trước mã số Thiết bị đeo tay Huawei"
- 6441/TB-TCHQ/2024 → 85176259: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 6441/TB-TCHQ 2024 kết quả xác định trước mã số Thiết bị đeo tay Huawei"
- 6442/TB-TCHQ/2024 → 85176259: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 6442/TB-TCHQ 2024 kết quả xác định trước mã số | HSTC"
- 6443/TB-TCHQ/2024 → 85176259: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 6443/TB-TCHQ 2024 kết quả xác định trước mã số đeo tay Huawei Watch GT"
- 6444/TB-TCHQ/2024 → 85176259: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 6444/TB-TCHQ 2024 kết quả xác định trước mã số | HSTC"
- 2491/TB-TCHQ/2022 → 85182990: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 2491/TB-TCHQ 2022 kết quả xác định trước mã số đối với Loa dùng cho đi"
- 214/TB-TCHQ/2023 → 28102022: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 214/TB-TCHQ 2023 kết quả xác định trước mã số đối với P-MOD YDCM065UNG"
- 215/TB-TCHQ/2023 → 85249100: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 215/TB-TCHQ 2023 kết quả xác định trước mã số đối với LCM Liquid Cryst"
- 971/TB-TCHQ/2024 → 85249100: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 971/TB-TCHQ năm 2024 về kết quả xác định trước mã số đối với LCD O-cel"
- 535/TB-TCHQ/2025 → 85299054: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 535/TB-TCHQ 2025 kết quả xác định trước mã số Semi finished PCB for TV"
- 878/TB-TCHQ/2025 → 85334000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 878/TB-TCHQ 2025 xác định trước mã Cảm biến nhiệt độ nước làm mát cho "
- 879/TB-TCHQ/2025 → 85334000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 879/TB-TCHQ 2025 kết quả xác định trước mã số Cảm biến đo nhiệt độ dùn"
- 206/TB-TCHQ/2018 → 85369019: description có tên doanh nghiệp — "Cầu nối nguồn điện/ phụ kiện terminal block YS CT-10 AF điện áp dưới 1000V dùng "

## Bước tiếp
1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).
2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.
3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).
