# Báo cáo đóng gói lô TB-TCHQ → hs-code-api

- Vào: `data/customs/processed/tracuuhs-detail-2026-10-14-goi-094.json` — 20 bản ghi
- Ra: `data/customs/lo/tracuuhs-2026-10-14-goi-094.json` — **5 bản ghi đạt** (trùng trong lô bỏ: 0)
- Cần xử tay: **15**

## Vào lô
- 1967/TB-TCHQ (2018-04-12) → 82090000 — Thanh vonfram dùng để sản xuất mũi khoan (CARBIDE) phi 6x45 (CTS20D) -…
- 899/TB-TCHQ (2019-02-14) → 83111090 — Điện cực bằng kim loại cơ bản dạng que, đã được phủ chất trợ dung, để …
- 900/TB-TCHQ (2019-02-14) → 83111090 — Điện cực bằng kim loại cơ bản dạng que, đã được phủ chất trợ dung, để …
- 1825/TB-TCHQ (2022-05-23) → 83113091 — Thông báo 1825/TB-TCHQ 2022 kết quả xác định trước mã số đối với dây h…
- 150/TB-TCHQ (2024-01-10) → 84145910 — Thông báo 150/TB-TCHQ 2024 kết quả xác định trước mã số ASSY-EU FAN MO…


## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)
- 3928/TB-TCHQ/2024 → 82073000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3928/TB-TCHQ 2024 kết quả xác định trước mã số COLD FORGING KNOCKOUT |"
- 3929/TB-TCHQ/2024 → 82073000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3929/TB-TCHQ 2024 kết quả xác định trước mã số đối với COLD FORGING PU"
- 3930/TB-TCHQ/2024 → 82073000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3930/TB-TCHQ 2024 kết quả xác định trước mã số COLD FORGING DIE | HSTC"
- 3964/TB-TCHQ/2024 → 83024190: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3964/TB-TCHQ 2024 kết quả xác định trước mã số đối với YUEGUO ALUMINUM"
- 3965/TB-TCHQ/2024 → 83024190: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3965/TB-TCHQ 2024 kết quả xác định trước mã số YUEGUO ALUMINUM CURTAIN"
- 3966/TB-TCHQ/2024 → 83024190: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3966/TB-TCHQ 2024 kết quả xác định trước mã số đối với YUEGUO ALUMINUM"
- 3743/TB-TCHQ/2019 → 83111090: description còn nhãn mục văn bản — "Thông báo 3743/TB-TCHQ 2019 kết quả phân loại hàng xuất khẩu que hàn | HSTC"
- 1259/TB-TCHQ/2023 → 20230106: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1259/TB-TCHQ 2023 kết quả xác định trước mã số Động cơ diesel cho tổ m"
- 123/TB-TCHQ/2025 → 84099149: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 123/TB-TCHQ 2025 kết quả xác định trước mã số Bộ căng xích cam thủy lự"
- 504/TB-TCHQ/2025 → 84123100: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 504/TB-TCHQ 2025 kết quả xác định trước mã số đối với Air cylinder | H"
- 869/TB-TCHQ/2025 → 84122100: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 869/TB-TCHQ 2025 kết quả xác định trước mã số đối với Hydraulic cylind"
- 3432/TB-TCHQ/2022 → 84145941: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3432/TB-TCHQ 2022 xác định trước mã số Máy sấy tay bằng gió không dùng"
- 3433/TB-TCHQ/2022 → 84145941: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3433/TB-TCHQ 2022 kết quả xác định trước mã số máy sấy tay Dyson HU02 "
- 4785/TB-TCHQ/2024 → 84145930: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4785/TB-TCHQ 2024 kết quả xác định trước mã số Buồng tắm khí dùng tron"
- 4433/TB-TCHQ/2021 → 84198919: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 4433/TB-TCHQ 2021 kết quả xác định trước mã số đối với Tủ ấm lạnh | HS"

## Bước tiếp
1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).
2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.
3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).
