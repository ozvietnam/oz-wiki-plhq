---
name: tb-tchq-lo
description: >
  Đóng gói tiền lệ TB-TCHQ đã crawl thành "lô" chuẩn rồi gửi sang kho tiền lệ của hs-code-api qua PR
  (data/community/tb-tchq → merge-community → /api/precedents). Use this whenever the task is to move
  crawled classification notices (tracuuhs.com, customs.gov.vn LV313, các file trong data/customs/processed/)
  into the hs-code-api precedent kho — "gửi lô TB-TCHQ", "nạp tiền lệ sang hs-code-api", "đóng gói lô",
  "xử lý batch tracuuhs", hoặc xử danh sách "cần xử tay" trong data/customs/lo/BAO-CAO-*.md.
  NOT for: trích bảng danh mục KTCN (luồng danh-muc-hs), sửa sổ đăng ký văn bản, hay crawl nội dung mới.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# /tb-tchq-lo — đóng gói lô tiền lệ TB-TCHQ gửi hs-code-api

## Role

Bạn là người **đóng gói và gửi** dữ liệu tiền lệ phân loại — không phải người tự suy luận pháp lý.
Nguyên tắc vàng: **thà thiếu còn hơn sai**. Bản ghi không đủ dữ kiện thì để vào báo cáo "cần xử tay",
KHÔNG nhồi vào lô, KHÔNG bịa trường.

## Đọc trước (theo thứ tự)

1. `docs/luong-tb-tchq.md` — hướng dẫn đầy đủ luồng này (5 bước + luật bên nhận + mẫu đã chạy).
2. `<hs-code-api>/docs/huong-dan-trich-tb-tchq.md` — hướng dẫn gốc từng trường (bên nhận).
3. `<hs-code-api>/scripts/validate-community.mjs` — luật máy kiểm (nguồn sự thật, không đoán).

## Vòng làm việc

1. Xác định nguồn: file detail trong `data/customs/processed/` hay danh sách "cần xử tay" của lô trước.
2. Đóng gói: `node tools/dong-goi-lo-tb-tchq.mjs --vao … --ra data/customs/lo/<tên-lô>.json --bao-cao …`
   — tool tự gán `attributes.loaiTB` (XAC_DINH_TRUOC / KET_QUA_PHAN_LOAI / DINH_CHINH) và trích `confusedWith`
   (mã bị bác / mã cũ trong đính chính, nguyên văn). Cặp mã khai → mã kết luận chỉ lấy từ nguồn tờ khai, không suy.
3. **Kiểm bằng validator thật**: chép tệp lô vào `data/community/tb-tchq/` bên hs-code-api → `node scripts/validate-community.mjs` → phải **0 lỗi**.
4. Gộp + PR: `merge-community.mjs` → `sync-doc-counts.mjs` → `test-merge-community.mjs` → commit cả lô + `data/precedents.json` (+ docs số đếm) → `gh pr create` (mô tả: nguồn, đạt/giữ lại, cảnh báo).
5. Xử tay `BAO-CAO-lot-*.md` → bổ sung vào lô sau, không sửa lô đã gộp.

## Không được làm

- Sửa tay từng bản ghi trong tệp lô — sửa **tool đóng gói** rồi chạy lại.
- Nhồi bản ghi thiếu `evidence.ketLuan`/mã không có trong kết luận — bên nhận chặn (từ 06/10/2026) và đó là luật đúng.
- Đưa tên doanh nghiệp, MST, số tờ khai, trị giá vào bất kỳ trường nào — repo công khai, lịch sử git không xoá được.
- Tự suy ra `girRule`/`confusedWith` — chỉ ghi khi văn bản viện dẫn rõ.

## Khi bị chặn

- Validator báo lỗi cùng loại nhiều bản ghi → cải tiến `tools/dong-goi-lo-tb-tchq.mjs`, ghi lý do trong commit.
- Validator chặn nhầm (model hàng trùng pattern) → giữ nguyên dữ liệu, ghi rõ trong PR để người review xác nhận.
