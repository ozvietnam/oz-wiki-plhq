# Báo cáo đóng gói lô TB-TCHQ → hs-code-api

- Vào: `data/customs/processed/tracuuhs-detail-2026-10-14-goi-102.json` — 20 bản ghi
- Ra: `data/customs/lo/tracuuhs-2026-10-14-goi-102.json` — **10 bản ghi đạt** (trùng trong lô bỏ: 0)
- Cần xử tay: **10**

## Vào lô
- 4418/TB-TCHQ (2022-10-21) → 90191090 — Thông báo 4418/TB-TCHQ 2022 kết quả xác định trước mã số dụng cụ mát x…
- 4419/TB-TCHQ (2022-10-21) → 90191090 — Thông báo 4419/TB-TCHQ 2022 kết quả xác định trước mã số thanh lăn mát…
- 4420/TB-TCHQ (2022-10-21) → 90191090 — Thông báo 4420/TB-TCHQ 2022 kết quả xác định trước mã số ống lăn mát x…
- 7274/TB-TCHQ (2018-12-11) → 90279010 — Túi chứa mẫu khí thở (bằng nhựa) chuyên dùng để xét nghiệm, kiểm tra v…
- 1093/TB-TCHQ (2020-02-25) → 94019099 — Bộ vỏ bọc ghế bằng da thuộc tổng hợp đã phủ PU 01 mặt. Gồm: Tay vịn: D…
- 252/TB-TCHQ (2021-01-18) → 94054099 — Bộ đèn chiếu tia UV công suất 600W, hoạt động bằng điện 220VAC, gồm: 0…
- 866/TB-TCHQ (2019-02-12) → 94054060 — Bóng đèn đi ốt phát quang LED dùng cho bể bơi (đèn dùng dưới nước) khô…
- 2551/TB-TCHQ (2018-05-11) → 94054099 — Cục phát quang của thiết bị kiểm tra quang học của camera kỹ thuật số,…
- 954/TB-TCHQ (2019-02-19) → 96019011 — Tấm trang trí bằng vỏ ốc xà cừ hình dáng kiểu caro đã xử lý bề mặt, đã…
- 3831/TB-TCHQ (2019-06-11) → 96039010 — Tập hợp các đoạn monofilament polyeste, được bó thành dạng hình trụ tr…


## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)
- 3819/TB-TCHQ/2021 → 90191010: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3819/TB-TCHQ 2021 kết quả xác định trước mã số The Vzusa | HSTC"
- 681/TB-TCHQ/2024 → 90318090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 681/TB-TCHQ 2024 kết quả xác định trước mã số Vòng đeo đo sóng điện nã"
- 4615/TB-TCHQ/2024 → 90318090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4615/TB-TCHQ 2024 kết quả xác định trước mã số đối với Sensor assay So"
- 2411/TB-TCHQ/2018 → 903300: ma_hs không phải 8 số — "Linh kiện thay thế cho tai nghe y tế Littman dòng Classic III, gồm: bộ màng nghe"
- 4706/TB-TCHQ/2024 → 91021200: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4706/TB-TCHQ 2024 kết quả xác định trước mã số đối với Huawei Band 9 |"
- 3739/TB-TCHQ/2022 → 94032090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3739/TB-TCHQ 2022 kết quả xác định trước mã số tủ rack hiệu VRS15 660 "
- 3741/TB-TCHQ/2022 → 94032090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3741/TB-TCHQ 2022 kết quả xác định trước mã số tủ rack | HSTC"
- 5628/TB-TCHQ/2023 → 94032090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5628/TB-TCHQ 2023 xác định trước mã số hàng hóa | HSTC"
- 6132/TB-TCHQ/2024 → 94054260: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 6132/TB-TCHQ 2024 kết quả xác định trước mã số Bộ đèn LED 1000W mã 10C"
- 5875/TB-TCHQ/2024 → 21102024: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5875/TB-TCHQ 2024 kết quả xác định trước mã số đối với ORBOOT EARTH | "

## Bước tiếp
1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).
2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.
3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).
