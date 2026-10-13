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

## Kinh nghiệm từ goi-058 (2026-10-13, 17 bản mới)

### Bài học kỹ thuật

1. **tracuuhs.com = SPA** — KHÔNG fetch được bằng `curl` (chỉ thấy HTML rỗng).
   - **Dùng Playwright Python** với `wait_until="networkidle"` mới lấy được text.
   - Mẫu code: `tools/crawl_goi_058.py` (đã mở PR #186).

2. **Mã HS trên tracuuhs chỉ hiển thị 4 số + ".."** (vd "Mã HS: 3824..").
   - Mã 8 số đầy đủ **CHỈ** có trong `reasonVi` dạng dotted (`3824.81.00`).
   - Regex ưu tiên: `\\b(\\d{4}\\.\\d{2}\\.\\d{2})\\b` → bỏ dấu chấm.
   - Fallback: `\\b(\\d{8})\\b` rồi `\\b(\\d{4}\\.\\d{2})\\b`.

3. **Che thông tin trước khi ghi file** (CONTRIBUTING + luật privacy):
   - Tên DN: `(Công ty|Cty|C\\.ty|Tập đoàn)\\s+[A-ZÀ-Ỹ][^,.\\n]{2,80}` → `##DN##`
   - MST: `\\b\\d{10}(?:-\\d{3})?\\b` hoặc `\\b\\d{13}\\b` → `##MST##`
   - Số tờ khai: `\\b\\d{6,8}/[A-Z]\\d{1,3}\\b` → `##MST##/TK`

4. **Envelope format** bên nhận (`hs-code-api/scripts/validate-community.mjs`):
   - `contributor` PHẢI là **object** `{name: "...", github: "..."}`, KHÔNG phải string.
   - Tool `dong-goi-lo` (oz-wiki-plhq) ghi string → phải sửa tay sau khi tool chạy.

5. **Trùng bản ghi khi merge**:
   - Cùng `hsCode` đã có trong kho → `merge-community.mjs` skip (đúng luật "không nhân bản").
   - 17 bản crawl → chỉ 5 bản thực sự mới (12 trùng hsCode).
   - **Trước khi PR**: luôn chạy `validate-community.mjs` ở hs-code-api để check trùng.

### Workflow chuẩn (5 bước)

\`\`\`
1. Comment "nhận goi-NNN" trên issue #185 (tránh 2 agent trùng gói)
2. Python script (Playwright): crawl 20 URL, 1.5s/URL, che DN/MST/TK
3. npm run dong-goi-lo → 20/20 đạt
4. Copy sang hs-code-api/data/community/tb-tchq/ + node scripts/validate-community.mjs
5. Sửa 2 thứ thường gặp: (a) contributor object, (b) loại trùng → 17 bản
6. node scripts/merge-community.mjs + sync-doc-counts + test
7. Commit + push 2 PR (oz-wiki-plhq + hs-code-api)
8. Comment "xong goi-NNN" trên #185
\`\`\`

### Quyết định có nên nhận gói tiếp không

- **Nên nhận** nếu: gói có `nhom_hs` còn mỏng trong kho (vd Ch.38 mới chỉ 30+ bản vs 2.083 tổng)
- **Cân nhắc** nếu: gói thuộc chương đã có nhiều bản (vd Ch.04, Ch.29 thường xuyên cập nhật)
- **Bỏ qua** nếu: chương quá lớn (>50 TB) — chia nhỏ gói tiếp theo
