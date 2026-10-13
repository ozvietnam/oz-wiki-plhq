# Chuẩn mẫu Wiki Source Page - Hướng dẫn cho Agent mới

> File này hướng dẫn agent khác viết wiki source page theo đúng chuẩn oz-wiki-plhq.
> Đọc kỹ trước khi viết bất kỳ trang wiki nào.

## 1. Schema Frontmatter (BẮT BUỘC)

```yaml
---
id: <slug>                    # slug từ registry/van-ban/<slug>.yaml
title: "<Tên đầy đủ> — <phạm vi tóm tắt>"   # 80-120 ký tự, có thể unicode
type: source                  # LUÔN là "source" cho VB pháp luật
created: YYYY-MM-DD           # Ngày tạo
updated: YYYY-MM-DD           # Ngày cập nhật cuối
authors:
  - <cơ quan ban hành viết tắt>  # VD: BTC, BCT, BYT, BTTTT, BNNPTNT, BKHCN
year: YYYY                    # Năm ban hành (số nguyên)
source_type: legal            # LUÔN là "legal" cho VB
importance: 1-5               # 5=Luật, 4=NĐ, 3=TT, 2=QĐ, 1=Công văn
provenance: replayable|missing  # "replayable" nếu đã đọc toàn văn, "missing" nếu chỉ stub
confidence: high|medium|low|unverified  # Mức độ tin cậy
tags: [loai, nhanh, tu-khoa-1, tu-khoa-2]  # Xem bảng tags bên dưới
urls:
  - <nguồn bậc A: Công báo / datafiles>
  - <nguồn bậc B nếu có: vbpl.vn, thuvienphapluat.vn>
---
```

### Tags phổ biến (chọn 3-5)

| Nhóm | Tags |
|---|---|
| Loại VB | `luat`, `nghi-dinh`, `thong-tu`, `quyet-dinh`, `nghi-quyet` |
| Cơ quan | `bct`, `byt`, `bkhcn`, `btttt`, `bnnptnt`, `bldtbxh`, `bca`, `bqp`, `bnv`, `bxd` |
| Lĩnh vực | `thu-tuc-hai-quan`, `thue-xk-nk`, `kiem-tra-chuyen-nganh`, `kiem-tra-sau-thong-quan`, `khai-bao-hai-quan`, `ma-hs` |
| Trạng thái | `het-hieu-luc`, `sua-doi`, `bo-sung`, `thay-the`, `con-hieu-luc` |
| Đặc biệt | `stub` (khi chưa có toàn văn), `quantrong` (VB nền tảng) |

## 2. Cấu trúc Body (BẮT BUỘC theo thứ tự)

### 2.1. Summary (2-4 câu)

- Loại VB + số hiệu + ngày + hiệu lực
- Phạm vi điều chỉnh
- Cơ quan ban hành
- Tình trạng hiệu lực hiện tại (còn / hết / sẽ thay)

**Mẫu:**
> **Thông tư 38/2015/TT-BTC** ban hành 25/3/2015, hiệu lực từ 01/4/2015, quy định chi tiết thi hành Luật Hải quan 54/2014/QH13 về thủ tục HQ, kiểm tra giám sát HQ, thuế XK NK. **9 chương, 149 điều**. Đã được sửa đổi bởi 39/2018, 60/2019, 121/2025, 13/2015, 142/2026, 06/2026.

### 2.2. Tình trạng hiệu lực (table)

| Mốc | Sự kiện |
|---|---|
| DD/MM/YYYY | Cơ quan ban hành |
| DD/MM/YYYY | Có hiệu lực |
| DD/MM/YYYY | Sửa đổi bởi TT X |
| DD/MM/YYYY | Sẽ bị thay bởi Luật Y |

### 2.3. Cấu trúc (table chương/điều nếu có)

| Chương | Nội dung | Điều |
|---|---|---|
| I | Quy định chung | 1-15 |
| II | ... | 16-50 |

### 2.4. Nội dung từng chương/điều (CHO VB LỚN)

- Dùng `## Chương X — Tên (Điều A-B)`
- Dùng `### Điều N. Tên điều`
- Trích nguyên văn 1-3 câu đầu
- Tóm tắt nội dung bằng bullet points
- **KHÔNG chế** — viết đủ để người đọc hiểu nghĩa vụ pháp lý

**Mẫu:**
```markdown
### Điều 1. Phạm vi điều chỉnh
Quy định chi tiết thi hành Luật HQ 54/2014/QH13 về:
- Thủ tục HQ
- Kiểm tra, giám sát HQ
- Thuế XK, thuế NK
```

### 2.5. Căn cứ / Mục đích (nếu là TT/NĐ)

Liệt kê Luật / NĐ mà VB này hướng dẫn thi hành.

### 2.6. Quy trình liên quan (nếu là VB quy trình)

Mô tả từng bước: Bước 1 → Bước 2 → ... → Kết quả

### 2.7. Bảng quyết định nhanh (nếu có nhiều trường hợp)

VD: Bảng mã HS theo loại hình, bảng thuế suất theo FTA...

### 2.8. Related concepts (dùng wikilink concepts/slug HOẶC plain text)

```markdown
## Related concepts (chưa có wiki)
- kiem-tra-chuyen-nganh
- cong-bo-hop-quy
```

**LƯU Ý**: Nếu concept chưa có wiki → dùng plain text. Nếu có wiki → dùng wikilink theo schema.

### 2.9. Related sources (dùng plain text, KHÔNG wikilink cho sources)

```markdown
## Related sources
- thu-tuc-hai-quan-xnk (chưa có wiki)
- 39-2018-tt-btc (TT sửa đổi) - chưa có wiki
- 142-2026-tt-btc (TT thay thế một phần) - đã có wiki
```

### 2.10. Open questions (câu hỏi còn bỏ ngỏ)

```markdown
## Open questions
- Đã đối chiếu hiệu lực với TT 142/2026 chưa?
- Có còn hiệu lực từ 01/3/2027 không?
```

### 2.11. Notes (ghi chú kỹ thuật)

```markdown
## Notes
- Đã đọc toàn văn từ datafiles.chinhphu.vn
- File PDF 2MB, 188 trang
- OCR 200dpi tesseract vie
- Confidence: high vì đã đối chiếu nguyên văn
```

## 3. Mẫu cho VB HẾT HIỆU LỰC (stub)

**BẮT BUỘC** theo RULE của Sếp (2026-10-12): VB HET_HIEU_LUC chỉ tạo stub ngắn, KHÔNG nạp toàn văn.

```markdown
---
id: 11-2017-tt-bct
title: "TT 11/2017/TT-BCT — Tạm nhập tái xuất (lịch sử, hết hiệu lực 15/6/2018)"
type: source
created: 2026-10-10
updated: 2026-10-10
authors: [BCT]
year: 2017
source_type: legal
importance: 3
provenance: missing
confidence: medium
tags: [bct, stub, het-hieu-luc, tam-nhap-tai-xuat]
---

## Summary

**Stub page** — VB đã hết hiệu lực 15/6/2018, không nạp toàn văn.

- **Bãi bỏ bởi**: TT 12/2018/TT-BCT (Điều 17 khoản 2 điểm b)
- **Hiện áp dụng**: TT 12/2018/TT-BCT (sửa bởi 06/2021, 28/2021)

## Open questions

- Có cần đọc lại lịch sử để tra cứu gì không?
```

## 4. Quy trình crawl + viết wiki (8 bước)

Đã có skill chi tiết: `~/.hermes/profiles/legal-customs/skills/custom/read-vb-phap-luat-bot/SKILL.md`

Tóm tắt:

1. **Gate hiệu lực** — đọc `tinh_trang` trong YAML. CON_HIEU_LUC mới viết đầy đủ.
2. **Tải toàn văn** — ưu tiên congbaocdn.chinhphu.vn → datafiles.chinhphu.vn → vanban.chinhphu.vn → vbpl.vn (bậc B)
3. **Trích text** — `pdftotext` (PDF có text layer) hoặc OCR tesseract (PDF scan, 200dpi)
4. **Đọc toàn văn** — đọc HẾT, kể cả phụ lục, điều khoản chuyển tiếp
5. **Viết wiki** — theo schema ở mục 1-3
6. **Lint + test** — `node _lumina/scripts/lint.mjs --json` + `npm test` (49 passed, 0 failed, 0 cảnh báo)
7. **Commit + push + PR** — 1 VB = 1 commit = 1 PR, branch `doc-hieu/<slug>`
8. **Update registry** — cập nhật `toan_van` trong YAML nếu tải mới

## 5. Checklist trước khi PR

- [ ] Đã đọc HẾT toàn văn (không bỏ điều nào)
- [ ] Summary 2-4 câu có: số hiệu + ngày + hiệu lực + phạm vi
- [ ] Bảng Tình trạng hiệu lực (nếu là VB còn hiệu lực)
- [ ] Bảng Cấu trúc (nếu > 5 điều)
- [ ] Từng điều quan trọng đã trích nguyên văn
- [ ] Related sources/concepts (chưa wiki → plain text)
- [ ] Lint 0 errors, 0 warnings
- [ ] `npm test` 51 passed, 0 failed
- [ ] `tools/kiem-tra.mjs` 0 cảnh báo
- [ ] KHÔNG commit `dist/`, `bao-cao/`
- [ ] Branch name: `doc-hieu/<slug>`

## 6. Ví dụ tham khảo

- **Stub HET_HIEU_LUC**: `wiki/sources/11-2017-tt-bct.md`
- **Wiki đầy đủ (Luật/NĐ lớn)**: `wiki/sources/38-2015-tt-btc.md` (9 chương, 149 điều)
- **Wiki đầy đủ (TT)**: `wiki/sources/19-2024-tt-byt.md` (KTCL, có bảng mã HS)
- **Wiki đầy đủ (QĐ)**: `wiki/sources/2711-qd-bkhcn.md` (KTCL, có danh sách mã HS)

## 7. Nguồn tham khảo

- **Skill chính**: `~/.hermes/profiles/legal-customs/skills/custom/read-vb-phap-luat-bot/SKILL.md`
- **Schema LuminaWiki**: `_lumina/schema/page-templates.md` (trong repo)
- **Lint + test**: `tools/kiem-tra.mjs`, `node _lumina/scripts/lint.mjs --json`
- **Registry**: `registry/van-ban/<slug>.yaml`
- **Existing wiki**: `wiki/sources/`, `wiki/concepts/`

---

**Tạo bởi**: legal-customs agent
**Ngày**: 2026-10-12
**Mục đích**: Hướng dẫn agent khác viết wiki chuẩn mẫu oz-wiki-plhq
