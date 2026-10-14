# Báo cáo đóng gói lô TB-TCHQ → hs-code-api

- Vào: `data/customs/processed/tracuuhs-detail-2026-10-13-goi-103.json` — 3 bản ghi
- Ra: `data/customs/lo/tracuuhs-2026-10-13-goi-103.json` — **3 bản ghi đạt** (trùng trong lô bỏ: 0)
- Cần xử tay: **0**

## Vào lô
- 3839/TB-TCHQ (2019-06-11) → 96039010 — tờ khai hải quan: Sợi filament dùng làm cọ sơn, dài - Tập hợp các đoạn…
- 4142/TB-TCHQ (2018-07-13) → 96035000 — Đầu đá mài bằng kim cương nhân tạo. - Bàn chải, dạng đĩa tròn, đế bằng…
- 4144/TB-TCHQ (2018-07-13) → 96035000 — Đầu mài đá bằng kim cương nhân tạo. - Bàn chải, kích thước dài x rộng …


## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)

## Bước tiếp
1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).
2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.
3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).
