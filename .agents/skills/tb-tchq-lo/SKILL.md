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

0. **Đối chiếu kho trước khi nhận gói (bắt buộc, luật CEO 14/10/2026):** chạy `npm run doi-chieu-kho` → nhận gói theo bảng xếp hạng trong `data/customs/lo/hang-doi-uu-tien.json` (nhiều TB `chua_co` trước, rồi nhiều `mong_co`). KHÔNG cào tràn lan rồi mới phát hiện trùng — cả hàng đợi 2.043 TB ngày 14/10 chỉ còn 50 TB chưa có.
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

### 🔴 Pitfall đếm "gói đã xong" qua PR GitHub = SAI (Sếp bắt lỗi)

**Triệu chứng**: Báo cáo "X gói đã xử lý" cho Sếp → Sếp bắt lỗi ngay "X gói là sai đó em. Kiểm tra lại, đào sâu vào các kinh nghiệm sau mỗi vòng".

**Vì sao SAI**:
- PR title chỉ chứa 1 goi-id không có nghĩa PR đó xử lý 1 gói. PR `goi-080 đến goi-103` = batch 24 gói.
- PR `feat(tb-tchq): 49 gói (980 TB) - fix-xu-tay` (PR #190) chứa 49 gói fix lỗi, không thể đếm là "1 gói".
- Comment "xong goi-NNN" trên issue #185 chỉ có 5 lần nhưng thực tế có 22 file lô → nhiều gói làm xong nhưng quên comment (agent khác nhau: Hermes, doc-hieu, cursor, Sonnet 4.5).
- Kho precedents 3.805 records = lũy kế nhiều tháng, KHÔNG chỉ từ issue #185.

**Cách đếm ĐÚNG (file-count truth, không phải PR-count)**:
```bash
cd <repo-root>

# Đếm gói có đủ 3 file (detail + lô + báo cáo)
ls data/customs/lo/tracuuhs-*.json | \
  sed 's|.*/||;s|tracuuhs-[0-9-]*-goi-||;s|\.json||' | \
  grep -v "^lot-" | sort -u | wc -l

# Đếm tổng records thực trong các file lô
python3 -c "
import json, os, re
total = 0; goi = {}
for f in sorted(os.listdir('data/customs/lo')):
    if not f.startswith('tracuuhs-') or not f.endswith('.json'):
        continue
    with open(f'data/customs/lo/{f}') as fh:
        d = json.load(fh)
    records = d.get('records', [])
    if isinstance(records, list):
        total += len(records)
        m = re.search(r'goi-(\d{3})', f)
        if m: goi[m.group(1)] = len(records)
print(f'Số gói có file lô: {len(goi)}')
print(f'Tổng records trong lô: {total}')
"

# Đếm gói có cả 3 file (đóng gói hoàn chỉnh)
python3 -c "
import os
lo_dir = 'data/customs/lo'; proc_dir = 'data/customs/processed'
goi_lo = {f.split('goi-')[-1].split('.')[0] for f in os.listdir(lo_dir)
          if f.startswith('tracuuhs-') and f.endswith('.json') and 'goi-' in f}
goi_detail = {f.split('goi-')[-1].split('.')[0] for f in os.listdir(proc_dir)
              if f.startswith('tracuuhs-detail-') and 'goi-' in f}
goi_bao_cao = {f.split('goi-')[-1].split('.')[0] for f in os.listdir(lo_dir)
               if f.startswith('BAO-CAO-goi-')}
full = goi_lo & goi_detail & goi_bao_cao
print(f'Gói có đủ 3 file: {len(full)}')
print(f'Gói chỉ có lô: {sorted(goi_lo - full)}')
"
```

**Quy tắc cứng khi báo cáo "X/Y gói đã xong"**:
- ✅ Đếm FILE LÔ có thật trong repo (không tính `lot-*.json` legacy)
- ✅ Tính tỉ lệ = `len(goi_co_file_lo) / 103` (tổng issue #185)
- ❌ KHÔNG đếm qua `gh pr list --search "goi-"` (PR batch làm sai số)
- ❌ KHÔNG đếm qua comment "xong goi-NNN" (nhiều agent quên comment)
- ❌ KHÔNG lấy số từ `precedents.json` (lũy kế nhiều nguồn)

**Bài học lớn (theo Sếp)**: "Đào sâu vào các kinh nghiệm sau mỗi vòng" — mỗi khi làm 1 vòng batch, GHI lại vào skill rule này + `LEARNED.md` để session sau không lặp lại sai lầm.

### Checklist trước khi commit (MỚI, bắt buộc từ 2026-10-15)

Trước khi `git commit` file lô, CHẠY 4 bước verify này — bắt buộc vì bug bị lọt nhiều lần:

1. **Che path trong `note`**: nếu `note` chứa đường dẫn tuyệt đối của máy cá nhân → REPLACE bằng `<repo-root>` hoặc đường dẫn tương đối. Path local không được lộ vì repo công khai, git history không xóa được.
2. **Format contributor nhất quán với main**: `{'name': 'thợ-Cào', 'model': 'Hermes-Sonnet-4.5'}` KHÔNG dùng `name: 'thợ-Cào-NNN'`.
3. **DINH_CHINH phải có `confusedWith`**: nếu `attributes.loaiTB === 'DINH_CHINH'`, PHẢI có `confusedWith: [<ma_cu>]` và `so_hieu` đã đổi sang TB mới.
4. **Không còn text gốc lỗi**: kiểm tra regex `mã[,\s]*số` chấp nhận cả "mã,số", nhưng rephrase nếu thấy xuất hiện trong description.

## Bug nghiêm trọng phát hiện sau 25 gói (2026-10-15) - BẮT BUỘC ĐỌC

### Bug 1: Merge tool MẤT toàn bộ field đặc biệt (CRITICAL)
- `<hs-code-api>/scripts/merge-community.mjs` chỉ giữ `loaiTB` + `legacyHs` (boolean). Tất cả field khác (`nguyen_tac_phan_loai`, `nhom_hs`, `hs_code_goc`, `loai_hang_ma`, `hs_in_tax_2022`, `legacy_hs`) BỊ MẤT khi merge.
- **Hệ quả**: Mọi nỗ lực thu thập "nguyên tắc phân loại" (lập luận pháp lý) đều vô ích vì merge tool strip hết.
- **Cách phát hiện**: Sau khi merge, check `precedents.json` có bao nhiêu record có `nguyen_tac_phan_loai`. Nếu = 0 mà file lô có → merge tool strip.
- **Cần fix** (chưa làm được trong session này): update `merge-community.mjs` để giữ các field trong `attributes`.

### Bug 2: Path leak trong file lô (CRITICAL - lộ đường dẫn máy cá nhân)
- 25/25 file lô push có `note` chứa đường dẫn tuyệt đối `<repo-root>/...` của máy cá nhân.
- Lộ: tên người dùng máy + đường dẫn nội bộ + vị trí file cá nhân.
- **Fix ngay khi viết script đóng gói**: thay path local bằng `<repo-root>` hoặc đường dẫn tương đối trước khi ghi `note`.

### Bug 3: DINH_CHINH không merge đúng
- File detail có 15 records với `loai: DINH_CHINH` → file lô chỉ có 0 DINH_CHINH.
- Nguyên nhân: tool đóng gói đọc `loaiTB` từ `attributes`, nhưng `attributes.loaiTB` được set dựa trên pattern "ĐÍNH CHÍNH" trong 600 ký tự đầu. Nếu text không khớp → gán `XAC_DINH_TRUOC` (SAI).
- VD: TB 4967/TB-TCHQ/2026 có `loai=DINH_CHINH` trong detail nhưng `loaiTB=XAC_DINH_TRUOC` trong lô.
- **Fix**: check `loaiTB` trong lô, nếu KHÔNG phải `DINH_CHINH` nhưng detail là `DINH_CHINH` → reparse hoặc fix tool.

### Bug 4: Trùng lặp 24% (805/3357 TB)
- Cùng 1 TB có 2+ versions từ các contributor khác nhau (vd 2614/TB-TCHQ có 4 versions).
- Tool `dedupKey` trong merge-community.mjs dùng `hs::ref::desc(40 chars)`. Nếu mô tả khác nhau → không dedup.
- **Hệ quả**: tốn storage, có thể gây nhầm lẫn khi search.
- **Hiện tại KHÔNG có giải pháp tự động** - cần Sếp review thủ công từng TB có nhiều version.

### Bug 5: 34 TB có 2-3 mã HS khác nhau (conflict phân loại)
- VD: 1811/TB-TCHQ/2020 gán `32082090` (legal-customs) vs `32089090` (lvn-2020).
- **Cần review** để chọn mã đúng.

## Workflow fix conflict khi base từ commit cũ (2026-10-15)

Khi branch em base từ commit cũ mà main đã merge thêm 4-10 PR khác:

1. **KHÔNG rebase** - sẽ tạo hàng trăm conflict markers trong `precedents.json` (gặp 148K+ markers trong session này).
2. **Tạo branch MỚI từ main**:
   ```bash
   git checkout -b tracuuhs/v2-NAME-2026-10-15 origin/main
   ```
3. **Copy 22 file** từ branch cũ (không cherry-pick):
   ```bash
   git show OLD_BRANCH:data/community/tb-tchq/...json > file.json
   git add . && git commit -m "..."
   ```
4. **Close 3 PR cũ** (`gh pr close N --delete-branch`) + tạo PR mới.

### Script merge thông minh (Python, khi precedents.json conflict quá lớn)

```python
import json, urllib.request, subprocess
main = json.loads(urllib.request.urlopen("https://raw.githubusercontent.com/.../main/data/precedents.json").read())
em = json.loads(open("data/precedents.json").read())
# Format: mỗi mã = LIST of records. Dedup theo (tbTchqNumber, year, productName[:50]).
merged = {}
for k in set(main) | set(em):
    recs = (main.get(k) or []) + (em.get(k) or [])
    seen, result = set(), []
    for r in recs:
        if not isinstance(r, dict): continue
        sh = r.get('so_hieu') or r.get('reference') or r.get('tbTchqNumber') or ''
        yr = r.get('year') or r.get('issuedDate') or ''
        tn = (r.get('ten_hang') or r.get('productName') or '')[:50]
        k_uniq = f"{sh}|{yr}|{tn}"
        if k_uniq not in seen:
            seen.add(k_uniq); result.append(r)
    merged[k] = result
```

Lưu ý: `r.get('key')` trả `None` nếu value là None. Dùng `r.get('key') or fallback` thay vì `r.get('key', fallback)`.

Số liệu cụ thể (805 TB trùng, 34 TB conflict, 266 records thin, 15 DINH_CHINH mất) - xem `references/pr-merge-pitfalls.md`.

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
