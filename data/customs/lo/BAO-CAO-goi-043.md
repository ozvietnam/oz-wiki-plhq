# Báo cáo đóng gói lô TB-TCHQ → hs-code-api

- Vào: `data/customs/processed/tracuuhs-detail-2026-10-14-goi-043.json` — 20 bản ghi
- Ra: `data/customs/lo/tracuuhs-2026-10-14-goi-043.json` — **6 bản ghi đạt** (trùng trong lô bỏ: 0)
- Cần xử tay: **14**

## Vào lô
- 96/TB-TCHQ (2018-01-08) → 33079050 — Dung dịch nhỏ mắt dùng để chống khô mắt; Công dụng: Dùng để nhỏ mắt ch…
- 991/TB-TCHQ (2022-03-24) → 33079050 — Thông báo 991/TB-TCHQ 2022 kết quả xác định trước mã số Nhũ tương nhỏ …
- 1015/TB-TCHQ (2022-03-25) → 33079090 — Thông báo 1015/TB-TCHQ 2022 kết quả xác định trước mã số Genteal Lubri…
- 1326/TB-TCHQ (2018-03-14) → 33074990 — OASIS PRO MORNING BREEZE ROOM RE Chế phẩm khử mùi phòng, dạng lỏng Mới…
- 1980/TB-TCHQ (2019-04-08) → 33074990 — SÁP THƠM ( FARCENT FRIDGE Deodorizer- CHARCOAL 150g- FF 4035 HXE) - Ch…
- 2276/TB-TCHQ (2024-05-23) → 33074910 — Thông báo 2276/TB-TCHQ năm 2024 về kết quả xác định trước mã số đối vớ…


## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)
- 144/TB-TCHQ/2024 → 33079090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 144/TB-TCHQ năm 2024 kết quả xác định trước mã số đối với SYSTANE Gel "
- 176/TB-TCHQ/2022 → 33079090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 176/TB-TCHQ 2022 kết quả xác định trước mã số mặt nạ dưỡng da | HSTC"
- 680/TB-TCHQ/2019 → 33079030: description còn nhãn mục văn bản — "Miếng tẩy tế bào chết - MEFACTORY PIG PEELING PAD. Nhà sản xuất: ME FACOTORY. Hà"
- 1325/TB-TCHQ/2018 → 33074990: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "OASIS PRO RELAXING SPA 2X2L Chế phẩm khử mùi phòng, dạng lỏng Mới 100% (Mục 29)"
- 1548/TB-TCHQ/2024 → 33079050: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1548/TB-TCHQ năm 2024 kết quả xác định trước mã số đối với Systane Hyd"
- 3167/TB-TCHQ/2022 → 10062022: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3167/TB-TCHQ 2022 kết quả xác định trước mã số MS DRYCARE SKIN | HSTC"
- 3196/TB-TCHQ/2023 → 33079050: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3196/TB-TCHQ 2023 kết quả xác định trước mã số Systane Ultra UD Lubric"
- 4053/TB-TCHQ/2024 → 47162000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4053/TB-TCHQ 2024 kết quả xác định trước mã số Chilly gel detergente i"
- 4054/TB-TCHQ/2024 → 00000000: mã không thật (00/99) — "Thông báo 4054/TB-TCHQ 2024 kết quả xác định trước mã số Chilly Delicato Deterge"
- 4055/TB-TCHQ/2024 → 00000000: mã không thật (00/99) — "Thông báo 4055/TB-TCHQ 2024 kết quả xác định trước mã số Chilly Protect Detergen"
- 4238/TB-TCHQ/2021 → 33079090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4238/TB-TCHQ 2021 kết quả xác định trước mã số Chilly Con Antibatteric"
- 4239/TB-TCHQ/2021 → 33079090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4239/TB-TCHQ 2021 kết quả xác định trước mã số Chilly Delicato | HSTC"
- 4240/TB-TCHQ/2021 → 33079090: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4240/TB-TCHQ 2021 kết quả xác định trước mã số đối với Chilly Gel | HS"
- 4903/TB-TCHQ/2022 → 33079010: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4903/TB-TCHQ 2022 kết quả xác định trước mã số MS TOPFOAM ANIMAL | HST"

## Bước tiếp
1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).
2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.
3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).
