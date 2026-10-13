# Báo cáo đóng gói lô TB-TCHQ → hs-code-api

- Vào: `data/customs/processed/tracuuhs-detail-2026-10-14-goi-037.json` — 20 bản ghi
- Ra: `data/customs/lo/tracuuhs-2026-10-14-goi-037.json` — **4 bản ghi đạt** (trùng trong lô bỏ: 0)
- Cần xử tay: **16**

## Vào lô
- 3862/TB-TCHQ (2019-06-12) → 30049099 — Chất làm đầy khớp, mô, loại MD-MUSCLE, dạng lỏng dùng để điều trị ở kh…
- 3863/TB-TCHQ (2019-06-12) → 30049099 — Chất làm đầy khớp, mô, loại MD-TISSUE, dạng lỏng dùng để điều trị các …
- 3913/TB-TCHQ (2019-06-13) → 30042091 — Thuốc thú y dùng trong chăn nuôi: Pulmotil AC (240 ml/lo) - NK theo TT…
- 4323/TB-TCHQ (2019-07-01) → 30042099 — Thuốc thú y dùng trong trại chăn nuôi: Gentaguard 10% Injection (100ml…


## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)
- 3861/TB-TCHQ/2019 → null: ma_hs không phải 8 số — "Vercel Security Checkpoint"
- 3904/TB-TCHQ/2024 → 30043290: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3904/TB-TCHQ 2024 kết quả xác định trước mã số Thuốc Seretide Accuhale"
- 4097/TB-TCHQ/2024 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4097/TB-TCHQ 2024 kết quả xác định trước mã số ALATROL SYRUP | HSTC"
- 4098/TB-TCHQ/2024 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4098/TB-TCHQ 2024 kết quả xác định trước mã số đối với SEDNO SYRUP | H"
- 4099/TB-TCHQ/2024 → 30049089: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4099/TB-TCHQ 2024 kết quả xác định trước mã số đối với Cordarone | HST"
- 4100/TB-TCHQ/2024 → 30049089: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4100/TB-TCHQ 2024 kết quả xác định trước mã số Cordarone 150mg/3ml | H"
- 4101/TB-TCHQ/2024 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4101/TB-TCHQ 2024 kết quả xác định trước mã số đối với Lovenox | HSTC"
- 4127/TB-TCHQ/2023 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4127/TB-TCHQ 2023 kết quả xác định trước mã số đối với Thuốc COAPROVEL"
- 4215/TB-TCHQ/2024 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4215/TB-TCHQ 2024 kết quả xác định trước mã số Marial hộp | HSTC"
- 4796/TB-TCHQ/2022 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4796/TB-TCHQ 2022 kết quả xác định trước mã số đối với PAPILOCARE | HS"
- 4945/TB-TCHQ/2023 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4945/TB-TCHQ 2023 kết quả xác định trước mã số | HSTC"
- 5062/TB-TCHQ/2022 → 30049059: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5062/TB-TCHQ 2022 kết quả xác định trước mã số đối với Hialcorb cold |"
- 5283/TB-TCHQ/2024 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5283/TB-TCHQ 2024 kết quả xác định trước mã số đối với ATRI PLUS INJ |"
- 5284/TB-TCHQ/2024 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5284/TB-TCHQ 2024 kết quả xác định trước mã số đối với ETMINE | HSTC"
- 5285/TB-TCHQ/2024 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5285/TB-TCHQ 2024 kết quả xác định trước mã số LEGOMUX | HSTC"
- 5750/TB-TCHQ/2023 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 5750/TB-TCHQ 2023 kết quả xác định trước mã số | HSTC"

## Bước tiếp
1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).
2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.
3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).
