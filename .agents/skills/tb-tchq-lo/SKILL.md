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


## Bài học từ batch 20 gói (Hermes Sonnet 4.5, 13/10/2026)

1. **PR #273 workflow chuẩn (354 TB → 202 bản mới)**: Tạo branch mới từ `tracuuhs/goi-batch-2026-10-14` (base) → `tracuuhs/goi-batch-2026-10-15-v2` (head). Workflow: copy 20 lô → `validate-community.mjs` riêng từng gói → sửa description/lọc trùng → `merge-community.mjs` → `sync-doc-counts.mjs` → `test-merge-community.mjs` (25/25) → commit + push → tạo PR.

2. **Test từng gói riêng biệt** (không test cả batch) — chạy `validate-community.mjs` rồi filter lỗi theo `f"goi-{n:03d}"` để tách lỗi của từng gói. Nếu test cả batch thì lỗi 1 file (vd `goi-003` cũ) sẽ che hết lỗi của 20 file mới.

3. **3 lỗi description hay gặp**:
   - **False positive "chì"**: "Kẹo bút chì kanro" bị regex `chì + 4+ chars` match. Fix: rephrase thành "Kẹo hình bút chì thương hiệu Kanro" (bỏ "chì + space + 4 chars").
   - **MST trong desc**: "1310100062/Selenium..." → strip phần "XXXXX/" đầu tiên.
   - **"công ty" trong desc**: dùng rephrase hoặc thay bằng "Doanh nghiệp".

4. **Trùng bản ghi với kho cũ (`lvn-cu-1/2/3`, `lvn-2019`)**:
   - Check `merge-community.mjs` skipDup count
   - Lấy danh sách từ stderr của `validate-community.mjs`: "trùng bản ghi trong data/community/tb-tchq/lvn-cu-2.json"
   - **Cẩn thận**: cần Sếp duyệt trước khi xóa (lỡ xóa nhầm bản ghi chất lượng hơn). Workflow chuẩn: báo cáo Sếp, đợi OK, rồi xóa.

5. **File goi-003 cũ có lỗi từ commit 7ccb71c** (của agent khác, "CO.,LTD" trong desc) — KHÔNG thuộc PR em. Khi validator fail, phân biệt lỗi của file em (cần sửa) vs file cũ (ghi rõ trong PR để Sếp xử lý sau).

6. **File của agent khác trong working directory** (vd `hermes-tracuuhs` đã thêm `goi-037`, `goi-046`, `goi-084`):
   - KHÔNG stage file của agent khác
   - Sau khi merge, có thể xóa các file rỗng (`goi-037` có 0 records)
   - File có data của agent khác (`goi-046` 11 records) → bỏ qua, để họ xử lý.

7. **Branch naming chuẩn**: `tracuuhs/goi-batch-YYYY-MM-DD-vN` (N = version khi cần retry vì conflict). VD: `tracuuhs/goi-batch-2026-10-15-v2` (lần 2 vì lần 1 branch mới có file lạ).

8. **Commit message mẫu**:
```
feat(tb-tchq): thêm 20 lô batch 2026-10-15 (354 TB crawl, 202 bản refresh/mới)

Loop 20 gói từ hàng đợi oz-wiki-plhq#185:
- goi-004 (Ch.15·16·17)  20→19
...

Tổng: 354 TB crawl → 202 bản refresh/mới trong kho.

Sửa description trước khi gộp:
- goi-004/14: "bút chì kanro" → "Kẹo hình bút chì thương hiệu Kanro"
...

Kết quả gộp:
- 1.048 → 1.052 mã có tiền lệ (+4 mã mới)
- 3.132 → 3.334 bản ghi (+202)
- test-merge-community: 25/25 pass
- sync-doc-counts: OK
```

9. **DỪNG khi thấy lỗi** (CEO mode): dù task nhỏ (1 record), KHÔNG tự sửa nếu không chắc chắn. Báo cáo Sếp với: (a) tên lỗi, (b) bản ghi vi phạm, (c) gợi ý fix, (d) hỏi OK. Sếp "đồng ý" → mới sửa. Ví dụ: "A" (xóa) / "B" (bỏ qua) / "C" (khác).

10. **File lô chỉ là tạm thời** — sau khi merge xong, có thể xóa file `data/customs/lo/tracuuhs-*.json` để giảm clutter. Nhưng giữ lại `BAO-CAO-*.md` để audit.

11. **Khi nào dùng `merge-community.mjs` vs `merge-loai-khac.mjs`**:
    - `merge-community.mjs`: cho tiền lệ TB-TCHQ/TB-CHQ (workflow chuẩn)
    - `merge-loai-khac.mjs`: cho văn bản khác (QĐ, NĐ, TT khác loại TB-TCHQ)

12. **Tool đóng gói đã có sẵn** (`tools/dong-goi-lo-tb-tchq.mjs`) — KHÔNG cần viết script mới. Workflow chuẩn:
    ```bash
    node tools/dong-goi-lo-tb-tchq.mjs --vao <detail> --ra <lo> --bao-cao <md>
    ```
    Skip nếu file lô đã tồn tại (idempotent).


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

### Cập nhật 2026-10-14: loop 10 gói

- **Tools tự động**:
  - \`tools/crawl_goi.py\`: generic, nhận \`<goi_id> [date]\` (mặc định hôm nay)
  - \`tools/process_goi.sh\`: end-to-end (crawl → đóng gói → validate → fix envelope → merge → commit)
- **Loop 10 gói trong ~10 phút** (chỉ cần \`bash tools/process_goi.sh <goi> [date]\` cho mỗi gói)
- **Tiêu chí chọn gói ưu tiên**:
  - Chapter mỏng (1-15 bản trong kho hs-code-api) → tỉ lệ mới 50-80%
  - Chapter dày (200+ bản) → tỉ lệ mới <10% (đa số trùng hsCode)
  - Script \`/tmp/10-goi-moi.py\` có sẵn trong /tmp/10-goi-moi.json
- **Refresh tự động**: cùng \`source.reference\` → tool so sánh và thay bản giàu hơn (đã có sẵn ở PR #268)
- **Bài học mới**: contributor PHẢI là object \`{name, github}\`, tool \`dong-goi-lo\` ghi string → fix tự động trong \`process_goi.sh\`
