# Báo cáo đóng gói lô TB-TCHQ → hs-code-api

- Vào: `data/customs/processed/tracuuhs-detail-2026-10-14-goi-036.json` — 20 bản ghi
- Ra: `data/customs/lo/tracuuhs-2026-10-14-goi-036.json` — **10 bản ghi đạt** (trùng trong lô bỏ: 0)
- Cần xử tay: **10**

## Vào lô
- 732/TB-TCHQ (2023-02-21) → 30049099 — Thông báo 732/TB-TCHQ 2023 kết quả xác định trước mã số Thuốc Phosphal…
- 2036/TB-TCHQ (2020-03-30) → 30049051 — Thuốc thú y dùng trong trại chăn nuôi: Pracetam 20% Oral Solution (5 l…
- 2344/TB-TCHQ (2018-05-02) → 30043290 — Thông báo 2344/TB-TCHQ 2018 kết quả xác định trước mã số đối với Thuốc…
- 2719/TB-TCHQ (2018-05-17) → 30042071 — Thông báo 2719/TB-TCHQ 2018 sửa đổi thay thế kết quả xác định trước mã…
- 3134/TB-TCHQ (2019-05-21) → 30042099 — Dược phẩm có chứa hoạt chất kháng sinh Neomycin sulphate, kháng sinh N…
- 3163/TB-TCHQ (2019-05-21) → 30042090 — Thuốc thú y dùng trong trại chăn nuôi: Tylosine 20% (100 ml/lo) - Nk t…
- 3308/TB-TCHQ (2018-06-12) → 30042091 — Thông báo 3308/TB-TCHQ 2018 kết quả xác định trước mã số mặt hàng Thuố…
- 3750/TB-TCHQ (2019-06-06) → 30042099 — Tân dược OTOFA Auri Fl/10ml hộp/1 lọ Dung dịch nhỏ tai. (Rifamycin sod…
- 3859/TB-TCHQ (2019-06-12) → 30049099 — Chất làm đầy khớp, mô, loại MD-NECK, dạng lỏng dùng để điều trị khớp c…
- 3860/TB-TCHQ (2019-06-12) → 30049099 — Chất làm đầy khớp, mô, loại MD-NEURAL, dạng lỏng dùng để điều trị vị t…


## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)
- 1107/TB-TCHQ/2023 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1107/TB-TCHQ 2023 kết quả xác định trước mã số Differin Cream 0,1% | H"
- 1715/TB-TCHQ/2023 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1715/TB-TCHQ 2023 kết quả xác định trước mã số đối với Thuốc Tavanic |"
- 1771/TB-TCHQ/2023 → 30042091: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1771/TB-TCHQ 2023 kết quả xác định trước mã số Thuốc Rodogyl | HSTC"
- 1800/TB-TCHQ/2023 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1800/TB-TCHQ 2023 xác định trước mã số NeiMed Sirus Rinse Kit 60 sache"
- 1801/TB-TCHQ/2023 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1801/TB-TCHQ 2023 kết quả xác định trước mã số Neilmed Sinus Rinse 10 "
- 1802/TB-TCHQ/2023 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1802/TB-TCHQ 2023 kết quả xác định trước mã số NeilMed Sinus Rinse Ped"
- 1972/TB-TCHQ/2022 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 1972/TB-TCHQ 2022 kết quả xác định trước mã số đối với Colpofix | HSTC"
- 2258/TB-TCHQ/2024 → 30043900: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 2258/TB-TCHQ năm 2024 về kết quả xác định trước mã số đối với Tân dược"
- 2688/TB-TCHQ/2022 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 2688/TB-TCHQ 2022 kết quả xác định trước mã số đối với CICATRIDINA Vag"
- 3664/TB-TCHQ/2024 → 30049099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Thông báo 3664/TB-TCHQ 2024 kết quả xác định trước mã số Stipsipeg baby | HSTC"

## Bước tiếp
1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).
2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.
3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).
