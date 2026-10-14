# Luồng 11 — TB-TCHQ: đóng gói lô gửi kho tiền lệ hs-code-api

Tiền lệ phân loại (TB-TCHQ / TB-CHQ) sau khi crawl về **không tự chảy sang đâu cả**. Luồng này biến
dữ liệu crawl trong `data/customs/` thành **"lô" đúng chuẩn** rồi gửi sang
[kho tiền lệ của hs-code-api](https://github.com/ozvietnam/hs-code-api) qua PR — nơi `/api/precedents`
phục vụ người tra cứu.

> **Đọc trước khi làm:** `docs/huong-dan-trich-tb-tchq.md` bên hs-code-api (hướng dẫn gốc về từng trường)
> và `scripts/validate-community.mjs` (luật máy kiểm). Luồng này là bản nối hai đầu, không thay hai tài liệu đó.
>
> **Nguyên tắc vàng: thà thiếu còn hơn sai.** Bản ghi không đủ dữ kiện → để vào báo cáo "cần xử tay",
> KHÔNG nhồi vào lô. Không suy luận, không lấy từ kiến thức riêng.

## Đầu vào → đầu ra

| | Ở đâu |
|---|---|
| Đầu vào | `data/customs/processed/tracuuhs-detail-*.json` (TB đã mở chi tiết: mã 8 số + toàn văn + lý do) hoặc dữ liệu crawl khác cùng dạng |
| Tool đóng gói | `node tools/dong-goi-lo-tb-tchq.mjs` (tuỳ chọn `--vao/--ra/--bao-cao`) |
| Đầu ra | `data/customs/lo/<nguồn>-<ngày>-lot-NN.json` + `BAO-CAO-lot-NN.md` (kể cả danh sách **cần xử tay**) |
| Đích | `data/community/tb-tchq/` bên hs-code-api → `merge-community.mjs` → `data/precedents.json` |

## Các bước

### 1. Chuẩn bị dữ liệu gốc

- crawl/parse TB từ `tracuuhs.com` (SPA, 1 load/trang — nhanh) hoặc `customs.gov.vn` (ổn định 100% URL).
- **Che thông tin khách hàng ngay khi crawl**: `##DN##`, `##MST##` — lô là repo công khai, lịch sử git không xoá được.
- Lưu vào `data/customs/processed/` đúng dạng file "detail" hiện có: `records[]` với `so_hieu, nam, ma_hs,
  ten_hang, mo_ta, noi_dung, reasonVi` (envelope `kind/contributor/license/submittedAt/note` cũng giữ).

### 2. Đóng gói lô

```bash
node tools/dong-goi-lo-tb-tchq.mjs --vao data/customs/processed/tracuuhs-detail-<ngày>.json \
  --ra data/customs/lo/tracuuhs-<ngày>-lot-02.json --bao-cao data/customs/lo/BAO-CAO-lot-02.md
```

Tool tự làm theo luật bên nhận: rút `evidence.soHieu` (dòng "Số:" trong văn bản), `evidence.ketLuan`
(chuỗi kết luận nguyên văn có mã), ngày ký → `issuedDate` + `attributes.bieuThue`, dọn description
(bỏ nhãn mục, trị giá, ngoặc cụt, tên nhóm biểu thuế), cân ngoặc reasonVi, rồi **định tuyến từng bản ghi**
vào lô hoặc vào danh sách "cần xử tay" kèm lý do.

### 3. Kiểm bằng validator thật của bên nhận — BẮT BUỘC

```bash
cd <nơi clone hs-code-api>            # repo này cạnh oz-wiki-plhq hoặc clone riêng
git checkout -b tracuuhs/lot-NN-<ngày>
cp <oz-wiki>/data/customs/lo/<tệp lô>.json data/community/tb-tchq/
node scripts/validate-community.mjs    # phải 0 lỗi; cảnh báo "bản mỏng" ghi lại trong PR
```

Lỗi thường gặp và cách sửa: cập nhật lại tool đóng gói bên oz-wiki (đừng sửa tay từng bản ghi), chạy lại,
chép lại file. Nếu validator chặn nhầm (model hàng trùng dạng), **ghi rõ trong PR để người review xác nhận**.

### 4. Gộp kho + mở PR

```bash
node scripts/merge-community.mjs       # gộp vào data/precedents.json (xem số: mới/nâng bản mỏng/trùng)
node scripts/sync-doc-counts.mjs       # nếu số đếm mã có tiền lệ đổi — CI test-doc-counts sẽ đỏ nếu quên
node scripts/test-merge-community.mjs  # 22/22
git add data/community/tb-tchq/<tệp lô>.json data/precedents.json AGENTS.md public/llms.txt
git commit -m "data(tb-tchq): gộp lô <nguồn> NN — X bản ghi (Y mới + Z nâng bản mỏng)"
gh pr create ...                       # mô tả: nguồn, số đạt/số giữ lại, cảnh báo, contributor
```

CI bên nhận (`community-data` workflow) tự chạy `validate-community` trên PR — phải xanh mới được gộp.

### 5. Xử tay danh sách chưa đạt

Mở `BAO-CAO-lot-NN.md` → với mỗi mục: mở `noi_dung` của bản ghi gốc, **đọc toàn văn**, chép đúng theo
hướng dẫn trích (không đoán), rồi bổ sung vào **lô sau** (không sửa lô đã gộp — trùng số hiệu sẽ bị chặn).

## Ba loại TB nghiệp vụ + cặp bài học (CEO 13/10/2026; sổ 14/10/2026)

Trên **lô** gửi hs-code-api giữ mã packer `attributes.loaiTB`. Trên **sổ / detail / index** dùng
`loai_phan_loai` (cùng 3 nhóm; thiếu toàn văn → `CHUA_XAC_DINH`). Mapper: `tools/lib/loai-phan-loai-tb-tchq.mjs`.
Bảng tra: `data/customs/lo/tb-tchq-loai-phan-loai.json`.

| Nghiệp vụ | `loai_phan_loai` (sổ) | `attributes.loaiTB` (lô) | Căn cứ thường gặp |
|---|---|---|---|
| Xin xác nhận / xác định trước mã số | `XAC_DINH_TRUOC` | `XAC_DINH_TRUOC` | Tiêu đề `XÁC ĐỊNH TRƯỚC MÃ SỐ` |
| Kiểm tra và xác định lại mã số | `KIEM_TRA_XAC_DINH_LAI` | `KET_QUA_PHAN_LOAI` | Trong kho hầu hết là tiêu đề `VỀ KẾT QUẢ PHÂN LOẠI…` — ghi `loai_phan_loai_can_cu: proxy_ket_qua_phan_loai_title` (chưa thấy cụm đúng「kiểm tra và xác định lại」trong toàn văn đã nạp) |
| Đính chính kết quả | `DINH_CHINH` | `DINH_CHINH` | Tiêu đề / `loai_vb` đính chính |
| Chưa đủ tín hiệu | `CHUA_XAC_DINH` | — | Chưa có `noi_dung` / bot-wall |

**Luật trích:** loại TB đọc từ tiêu đề văn bản (mapper tự làm). Ca **kết quả khác lần khai**: mã doanh
nghiệp từng khai/cơ quan từng kết luận mà bị bác → ghi vào `confusedWith` (CHỈ mã có nguyên văn; với đính
chính đọc cột "Nội dung đã ban hành"). **Giới hạn nguồn hiện tại:** TB phân loại chỉ ghi "Tên hàng theo
khai báo", KHÔNG ghi mã doanh nghiệp khai — cặp đầy đủ "mã khai → mã kết luận" phải ghép từ nguồn tờ khai
(oz_precedents/`/api/demand` bên hs-code-api) trong đợt sau; đừng tự suy mã khai từ tên hàng.

## Bảng ghi nhớ luật bên nhận (từ 06/10/2026)

| Luật | Ngưỡng |
|---|---|
| `evidence.soHieu` + `evidence.ketLuan` | bắt buộc; ketLuan ≥30 ký tự, chứa mã; reasonVi phải chứa nguyên văn ketLuan |
| `reasonVi` | 80–1000 ký tự; <150 là "bản mỏng" (cảnh báo) |
| `description` | ≥40 ký tự; không nhãn mục, không mã HS, không trị giá, không tên doanh nghiệp, không mã nội bộ `#&` |
| `attributes.bieuThue` | 2012 / 2017 / 2022 theo ngày ký |
| `source.issuedDate` / `source.url` | YYYY-MM-DD / trang chi tiết đã đọc |
| Mỗi tệp | ≤500 bản ghi; một số hiệu + mã chỉ nằm ở một tệp |
| `attributes.loaiTB` | luôn ghi: `XAC_DINH_TRUOC` / `KET_QUA_PHAN_LOAI` / `DINH_CHINH` |
| Riêng tư | repo công khai — không tên doanh nghiệp, MST, số tờ khai, trị giá, liên hệ |

## Mẫu đã chạy (đợt 1, 13/10/2026)

Lô 01: `data/customs/lo/tracuuhs-2026-10-10-lot-01.json` — 261 bản ghi vào, **245 đạt 0 lỗi**, 16 xử tay;
kết quả gộp bên hs-code-api: **+98 tiền lệ mới, +144 nâng bản mỏng** (PR tracuuhs/lot-01).
Lô mẫu này là ví dụ chuẩn — mở ra xem trước khi đóng gói lô của bạn.

## Nhịp & tồn đọng (13/10/2026)

- tracuuhs: mở chi tiết ~2.043 TB còn lại (lô tiếp theo ~280/ngày).
- customs.gov.vn LV313: 1.631 TB chưa nạp — cần kiểm lại PDF sống/chết trước khi tải (2 nguồn báo cáo mâu thuẫn).
- Ưu tiên 3 (2014–2017, CSV Sếp): 2.332 TB — cần TVPL/caselaw (Cloudflare), làm riêng.
