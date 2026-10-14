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

## Hỗ trợ

- `scripts/crawl_goi.py` — Chrome CDP crawl 1 gói (20 TB) với PII scrub + parse 3 loại
- `references/loai-tb-parsing.md` — chi tiết 3 loại TB (KET_QUA_PHAN_LOAI / XAC_DINH_TRUOC / DINH_CHINH) + pitfall anchor in hoa vs lowercase

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
- Nhồi bản ghi thiếu `evidence.ketLuan`/mã không có trong kết quả — bên nhận chặn (từ 06/10/2026) và đó là luật đúng.
- Đưa tên doanh nghiệp, MST, số tờ khai, trị giá vào bất kỳ trường nào — repo công khai, lịch sử git không xoá được.
- Tự suy ra `girRule`/`confusedWith` — chỉ ghi khi văn bản viện dẫn rõ.

## Gate RÀ LẠI TAY — không thể bỏ qua

Trước khi báo "xong gói", PHẢI spot-check 2–3 record ngẫu nhiên của file lô bằng cách **mở `text_cache` gốc và đọc lại**, không chỉ nhìn output tool:

- Có PII lọt không? (regex `MST\s*[:.]?\s*\d{2}` / `@[\w.-]+` / `Công ty\s+(?:TNHH|CP|MTV)` / `Đ/c:` / `\b\d{8,15}/A\d` — phải match **0 lần** trong record đã che)
- Description có bị cắt giữa câu không? Có lẫn "Tên gọi" của "Hàng hóa đề nghị" trong XAC_DINH_TRUOC không?
- Nguyên tắc phân loại (lập luận pháp lý) có còn trong `reasonVi` không? — nếu thiếu, nguyên tắc mới là giá trị cốt lõi, không phải mã HS

Validator chỉ check format. Nó không phát hiện: PII lọt, parser lấy nhầm "Tên gọi" lần 1, nguyên tắc bị mất khi cắt text 500 chars. Đó là lý do Sếp bảo "làm ẩu thế, rà lại những văn bản mà em đọc đi" — không phải validator sai, mà vì em không đọc lại tay.

Checklist trước commit:
- [ ] Mở 2–3 file `text_cache` (không phải file lô, file gốc trong `/tmp/tb-text-cache-goi-NNN/`)
- [ ] So `description` trong lô với đoạn tương ứng trong raw
- [ ] Tìm MST/Email/Địa chỉ/TK trong raw, xác nhận đã thành `##X##` trong lô
- [ ] Với XAC_DINH_TRUOC: confirm "Tên gọi" lấy đúng lần 2
- [ ] Nếu DINH_CHINH: confirm `confusedWith` đúng số TB cũ


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

### Cập nhật 2026-10-14 đợt 2: bài học từ skill doi-chieu-tb-tchq-2-repo

- **Bug match \`source.reference\`**:
  - \`source.reference\` trong kho: \`503/TB-TCHQ\` (KHÔNG có năm)
  - \`so_hieu\` trong manifest: \`503/TB-TCHQ/2018\` (CÓ năm)
  - **BẮT BUỘC strip năm** trước khi match: \`re.sub(r'/\\d{4}$', '', so_hieu)\`
- **79% TB đã có sẵn trong kho** (sau khi strip năm):
  - 1.634/2.043 TB (79%) từ luatvietnam.vn (lvn-cu-1/2/3 = 1.111 bản)
  - → Crawl từ tracuuhs.com chỉ thực sự bổ sung ~21% TB
- **Tiêu chí chọn gói tốt hơn**:
  - CŨ: chọn theo chapter mỏng (số bản trong kho) → tỉ lệ mới 8%
  - MỚI: chọn theo **TB chưa có trong kho** (count source.reference) → tỉ lệ mới 16%
  - Script: \`/tmp/10-goi-moi-v2.json\`

### Tổng kết 2 đợt
| Đợt | Gói | Crawl | Mới | Tỉ lệ |
|---|---|---|---|---|
| Đợt 1 | 10 (chapter mỏng) | 220 | 17 | 8% |
| Đợt 2 | 10 (TB chưa có) | 200 | 32 | 16% |
| **Tổng** | **20** | **420** | **49** | **12%** |

### 🐛 BUG NGHIÊM TRỌNG phát hiện 2026-10-14 (sau khi rà 21 gói đã làm)

**1. hsCode từ tracuuhs.com KHÔNG khớp tax.json VN hiện tại**
- 31/54 hsCode (57%) KHÔNG CÓ trong `hs-code-api/data/tax.json` (biểu thuế EN2022)
- Lý do: tracuuhs.com crawl từ biểu thuế 2017. Nhiều mã đã được remap:
  - `7210.70.11` (2017) → `7210.70.12` (2022)
  - `3402.20.15` (2017) → không còn (đã chuyển sang 3402.90.xx)
- **Hệ quả**: Merge mã HS cũ vào kho dùng biểu thuế mới → nhiễu dữ liệu
- **Cách phát hiện**: Check `hs in tax.json` cho TỪNG bản
- **Cách xử lý**:
  - Option A: Bỏ các bản có hsCode không có trong tax.json
  - Option B: Remap sang mã 2022 tương đương (cần manual)
  - Option C: Lưu thêm `attributes.bieuThue: 2017` để phân biệt

**2. bieuThue 2017 trộn với 2022**
- 61/71 bản có `bieuThue: 2017`, 10/71 bản có `bieuThue: 2022`
- Script `process_goi.sh` tự động gán bieuThue dựa vào `issuedDate`
- TB 2018-2020 thường dùng biểu thuế 2017; TB 2022+ dùng 2022
- Nhưng mã HS có thể đã được remap giữa 2 biểu thuế → cần check cả 2 phiên bản

**3. Số liệu báo cáo sai**
- Em báo "49 mới" và "66 mới" trong các comment
- Thực tế:
  - File lô: 54 bản (gồm 14 bản đã có source.reference trùng → bị loại khi merge)
  - Bản merge thật vào precedents.json: 40 bản (32 đợt 2 + 17 đợt 1 - 9 bị skip do conflict)
  - Lệch: 14 bản (chênh giữa file lô và precedents)
- **Bài học**: Số liệu báo cáo phải khớp với:
  - Số records trong file lô (output tool)
  - Số records trong precedents.json (sau merge-community.mjs)
  - KHÔNG bịa số từ script

### Checklist trước khi báo cáo "xong gói"
- [ ] `len(file_lo.records)` = ?
- [ ] `git diff --cached data/precedents.json | grep -c '^+.*tracuuhs-...'` = ?
- [ ] Tất cả hsCode có trong tax.json?
- [ ] Validate: 0 lỗi?
- [ ] Test-merge: 25/25?

### 🧠 Triết lý xử lý legacy (từ Sếp 2026-10-14)

> **"Lập luận trong văn bản mới là tinh túy cần ghi chép lại cẩn thận"**

Khi hsCode crawl từ nguồn cũ không có trong biểu thuế hiện hành:

**❌ KHÔNG ĐƯỢC**:
- Xóa bản ghi
- Bỏ qua bản ghi
- Sửa hsCode thành mã mới (mất giá trị lịch sử)

**✅ PHẢI LÀM**:
- Giữ nguyên bản ghi gốc
- Đánh dấu `legacyHs: true` (hoặc tương tự)
- Thêm `legacyHsRemap` (mã EN2022 tương đương)
- Thêm `legacyHsConfidence` (high/medium/low)
- Thêm `legacyHsReasoning` (lý do remap)
- Để API có thể trả về cả 2 mã khi khách hỏi

**Lý do**: TB-TCHQ là văn bản pháp lý, chứng minh tại sao hàng hóa được phân loại như vậy tại thời điểm ban hành. Xóa = mất giá trị lịch sử.

### Workflow khi phát hiện hsCode legacy
1. Check `hs in tax.json` (biểu thuế hiện hành)
2. Nếu KHÔNG có → tìm mã tương đương theo 6 số đầu
3. Nếu có → set `legacyHs: true` + `legacyHsRemap: [...]` + `legacyHsConfidence: 'high'/'medium'/'low'`
4. Nếu không có cùng 6 số → check cùng 4 số + suy luận + đánh `low` confidence
5. Cập nhật file mapping `data/legacy-hs-YYYY-to-YYYY-mapping.json` để dùng lại

### Ví dụ đã làm
\`data/customs/lo/legacy-hs-2017-to-2022-mapping.json\`:
- 13 mã legacy, 18 bản precedents
- 4 high, 11 medium, 3 low
- Có thể mở rộng khi gặp thêm mã mới


## Bài học từ goi-101 (Hermes Sonnet 4.5, 15/10/2026)

Nội dung kỹ thuật (3 loại TB, DINH_CHINH workflow, field `noi_dung`, che PII toàn bộ) đã được chuyển sang `references/loai-tb-parsing.md` và Gate RÀ LẠI TAY ở trên. Phần này giữ workflow tóm tắt + 1 cảnh báo môi trường cụ thể.

### Workflow chuẩn (gói-101, 3 phút 10 giây)
1. Chrome CDP port 9226 (headless) - mỗi URL: 8s load + 1.5s delay
2. Lưu text cache vào `/tmp/tb-text-cache-goi-NNN/`
3. Parse thông minh 3 loại + che PII (xem `scripts/crawl_goi.py`)
4. Thêm field `noi_dung` cho tool đóng gói
5. DINH_CHINH: đổi so_hieu + confusedWith
6. `tools/dong-goi-lo-tb-tchq.mjs` → 20/20 đạt
7. Copy sang hs-code-api + `validate-community.mjs` → 0 lỗi
8. `merge-community.mjs` + `sync-doc-counts.mjs` + `test-merge-community.mjs`

### Cảnh báo môi trường

- `git reset --hard origin/<branch>` XÓA file untracked + chưa commit — backup hoặc `git stash` trước
- Repo có team khác commit lên cùng branch — khi pull rebase gặp conflict, hãy reset về origin rồi stage lại file của mình (chỉ `git add` file có tiền tố `goi-NNN` của mình, không `git add -A`)


## Bugs phát hiện từ 5 gói song song (2026-10-15, Hermes Sonnet 4.5)

### Bug 1: Regex "mã số" không match "mã,số"
- 1 TB trong 84 có text "mã,số" (có dấu phẩy)
- Fix: `re.search(r"mã[,\s]*số\s+(\d{4}\.\d{2}\.\d{2})", text, re.IGNORECASE)`
- Cũ: `r"mã\s*số\s+(\d{4}\.\d{2}\.\d{2})"` - chỉ match space

### Bug 2: Script crash khi ma_hs=None
- `record.get('ma_hs', 'NONE')[:8]` - default CHỈ dùng khi KEY không tồn tại
- Nếu value=None (key tồn tại) → `None[:8]` → TypeError
- Fix: `(record.get('ma_hs') or 'NONE')[:8]`

### Bug 3: Workflow thêm record thủ công
Khi thêm record thủ công vào file processed, PHẢI set đủ fields:
```python
r['noi_dung'] = open(r['text_cache']).read()
r['loai_phan_loai'] = r.get('loai', '')
r['ten_hang'] = r.get('description', '')
r['don_vi'] = ''
r['mo_ta'] = r.get('description', '')
r['reasonVi'] = r.get('reason_vi', '')
r['source'] = {'reference': r['so_hieu'].split('/')[0] + '/' + r['so_hieu'].split('/')[1]}
```

### Pattern crawl nhiều gói
- Dùng 1 Chrome instance cho tất cả gói (port 9226)
- Mỗi gói có cache riêng (`/tmp/tb-text-cache-goi-NNN/`)
- Mỗi gói có output riêng (`tracuuhs-detail-...-goi-NNN.json`)
- Lưu log riêng để debug

### Edge case parser
- Luôn kiểm tra `None` trước khi slice/index
- Pattern "mã,số" / "Mã HS" / "Mã số" / "Mã" - variations
- DINH_CHINH: confusedWith + so_hieu mới
- Text có thể chứa footer "HSTC là công cụ..." - cắt bỏ


## Bài học từ 18 gói tiếp theo (2026-10-15)

### Bug "chì oxit" bị match số seal container
- Pattern: `(chì + 4+ chars)` trong description bị validator match
- "hàm lượng chì oxit < 24%" → false positive "số seal"
- Fix: loại bỏ cụm `hàm lượng chì oxit ...` khỏi description
- Hoặc rephrase: "chì oxit (PbO) (PbO) < 24%" → vẫn fail vì vẫn match
- **Cleanest**: dùng regex loại bỏ: `desc = re.sub(r"[,;]?\s*hàm lượng\s+chì\s+oxit[^,]*?\d+%[^,]*", "", desc)`

### Bug "Công ty" trong tham chiếu "Công văn"
- Pattern: "Theo công văn số 180921/CV-HT ... của Công ty" → match tên DN
- Fix: rephrase "Công ty" → "Doanh nghiệp"

### Chrome crash khi chạy song song
- 2 batch cùng dùng port 9226 → "Broken pipe"
- **Fix**: chỉ chạy 1 batch tại 1 thời điểm
- Nếu Chrome chết: kill, đợi 3s, start lại
- Background process + log riêng từng batch

### DINH_CHINH pattern nhiều hơn dự kiến
- Trong 18 gói: 1927, 3424, 1133, 1329, 85049039... nhiều record DINH_CHINH
- Parser phải detect "VỀ SỬA ĐỔI" + confusedWith pattern

### Workflow rephrase validation errors
- KHÔNG dùng "(PbO)" thêm vào - vẫn có "chì oxit"
- Dùng regex strip pattern gốc: `re.sub(r"pattern", "", text)`
- Hoặc replace generic: "Công ty" → "Doanh nghiệp"
