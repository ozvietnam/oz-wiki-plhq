# Báo cáo đóng gói lô TB-TCHQ → hs-code-api

- Vào: `/Users/ozvietnamdesktop/Projects/oz-wiki/data/customs/processed/tracuuhs-detail-2026-10-15-goi-103.json` — 3 bản ghi
- Ra: `/Users/ozvietnamdesktop/Projects/oz-wiki/data/customs/lo/tracuuhs-2026-10-15-goi-103.json` — **3 bản ghi đạt** (trùng trong lô bỏ: 0)
- Cần xử tay: **0**

## Vào lô
- 3839/TB-TCHQ (2019-06-11) → 96039010 — Tập hợp các đoạn monofilament polyeste, được bó thành dạng hình trụ tr…
- 4142/TB-TCHQ (2018-07-13) → 96035000 — Bàn chải, dạng đĩa tròn, đế bằng nhựa Polypropylen đường kính 200 mm d…
- 4144/TB-TCHQ (2018-07-13) → 96035000 — Bàn chải, kích thước dài x rộng x cao (168x70x60) mm, đế bằng nhựa pol…


## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)

## Bước tiếp
1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).
2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.
3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).
