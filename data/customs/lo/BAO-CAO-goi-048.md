# Báo cáo đóng gói lô TB-TCHQ → hs-code-api

- Vào: `data/customs/processed/tracuuhs-detail-2026-10-14-goi-048.json` — 20 bản ghi
- Ra: `data/customs/lo/tracuuhs-2026-10-14-goi-048.json` — **7 bản ghi đạt** (trùng trong lô bỏ: 0)
- Cần xử tay: **13**

## Vào lô
- 6256/TB-TCHQ (2018-10-24) → 35040000 — Lactoferrin, quy cách đóng gói: 5kg/bao, Nguyên liệu sản xuất sữa - La…
- 1671/TB-TCHQ (2020-03-17) → 35051090 — Unifilma HVY-Dextrin(5cartonx1kg)-Nguyên liệu cho sản xuất mỹ phẩm- Hà…
- 1673/TB-TCHQ (2020-03-17) → 35051090 — Rheopearl HC-Dextrin(5cartonx10kg)-Nguyên liệu cho sản xuất mỹ phẩm- H…
- 3819/TB-TCHQ (2022-09-15) → 35061000 — Thông báo 3819/TB-TCHQ 2022 kết quả xác định trước mã số keo hai mặt D…
- 5147/TB-TCHQ (2023-10-05) → 35061000 — Thông báo 5147/TB-TCHQ 2023 kết quả xác định trước mã số | HSTC…
- 924/TB-TCHQ (2019-02-15) → 37013000 — Nguyên liệu, vật tự sử dụng trong ngành in: THERMAL CTP PLATES (Bản in…
- 3236/TB-TCHQ (2018-06-08) → 37013000 — Đế bản nhôm CTCP (UV-PII), chưa nhạy, dùng trong công nghệ in (1030x80…


## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)
- 4791/TB-TCHQ/2024 → 35040000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4791/TB-TCHQ 2024 kết quả xác định trước mã số FORTIGEL B SA | HSTC"
- 5682/TB-TCHQ/2023 → 35040000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5682/TB-TCHQ 2023 kết quả xác định trước mã số PEPTIPLUS XP aggl | HST"
- 1703/TB-TCHQ/2023 → 35061000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1703/TB-TCHQ 2023 kết quả xác định trước mã số Chất kết dính ELOCTITE "
- 1704/TB-TCHQ/2023 → 35061000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1704/TB-TCHQ 2023 kết quả xác định trước mã số đối với Chất kết dính E"
- 1705/TB-TCHQ/2023 → 35061000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1705/TB-TCHQ 2023 kết quả xác định trước mã số chất kết dính các polym"
- 1706/TB-TCHQ/2023 → 35061000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1706/TB-TCHQ 2023 xác định trước mã số Chất kết dính làm từ Epoxy LOCT"
- 3312/TB-TCHQ/2024 → 35061000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3312/TB-TCHQ năm 2024 kết quả xác định trước mã số đối với DOUBLE TAPE"
- 3566/TB-TCHQ/2022 → 20052022: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3566/TB-TCHQ 2022 kết quả xác định trước mã số keo dán LOCTITE BONDACE"
- 3568/TB-TCHQ/2022 → 20052022: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3568/TB-TCHQ 2022 kết quả xác định trước mã số keo dán LOCTITE BONDAGE"
- 5678/TB-TCHQ/2022 → 35079000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5678/TB-TCHQ 2022 kết quả xác định trước mã số đối với Probind TXo | H"
- 4368/TB-TCHQ/2022 → 37024400: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4368/TB-TCHQ 2022 kết quả xác định trước mã số sản phẩm SUNFORT AQ 209"
- 5420/TB-TCHQ/2022 → 37079090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5420/TB-TCHQ 2022 kết quả xác định trước mã số đối với QR D1 | HSTC"
- 5421/TB-TCHQ/2022 → 37079090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5421/TB-TCHQ 2022 kết quả xác định trước mã số đối với UR F1 | HSTC"

## Bước tiếp
1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).
2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.
3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).
