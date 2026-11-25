# Dùng sổ đăng ký và gói tri thức trong ứng dụng khác

Kho này xuất bộ dữ liệu máy `dist/` (phiên bản lược đồ `1.5.0`, dựng bằng `npm run dung`, tự cập nhật sau mỗi lần gộp PR và mỗi thứ Hai). Ứng dụng khác chỉ **đọc** các tệp này; muốn sửa dữ liệu thì mở PR vào `registry/`, `danh-muc/`, `wiki/` hoặc `data/doc-hieu/` — không sửa bản chụp ở phía ứng dụng.

> Ranh giới dữ liệu giữa `oz-wiki-plhq`, `hs-code-api` và Cổng MCP (`ozplugin`): xem **[SO-DO-HE-THONG.md](SO-DO-HE-THONG.md)**. Kho này **không** xuất `chu-giai-chuong.json` hay `chu-giai-hs.json` ra `dist/` (GIR và chú giải HS thuộc `hs-code-api`).

URL ổn định trên nhánh `main`: `https://raw.githubusercontent.com/ozvietnam/oz-wiki-plhq/main/dist/registry.json` (tương tự cho các tệp `dist/*.json` khác — bot dựng lại ngay sau mỗi lần gộp).

## Phát hành ổn định (bản chụp gắn thẻ)

Ngoài URL `main`, mỗi lần **bất kỳ** tệp nào trong gói `dist/` **đổi** so với `HEAD`, workflow `dung-lai-va-bao-hs-code-api` (`.github/workflows/bao-hs-code-api.yml`) tạo một GitHub Release gắn thẻ `dist-YYYY-MM-DD` (hậu tố `.N` nếu trùng ngày), đính kèm đủ bộ **8 tệp dữ liệu máy** (`1.5.0`, do `npm run dung` xuất đồng bộ) cùng bản băm:

- `registry.json`
- `hs-index.json`
- `hs-index-theo-ma.json`
- `wiki-index.json`
- `wiki-chunks.json`
- `dieu-khoan.json`
- `cas-index.json`
- `chinh-sach-mo-ta.json` *(Tầng 2 theo mô tả & 25 viết tắt PLHQ, dựng bởi `dungChinhSachMoTa()` trong [`tools/lib/chinh-sach-mo-ta.mjs`](../tools/lib/chinh-sach-mo-ta.mjs); bổ sung từ `1.5.0` Wave 8)*
- `SHA256SUMS`

Ba loại URL, hợp đồng như sau:

| URL | Đổi hay không |
|---|---|
| `…/releases/download/dist-YYYY-MM-DD[.N]/<tep>.json` | **Bất biến** — bản cũ không bị xoá, quay lại được khi bản mới lỗi |
| `…/releases/latest/download/<tep>.json` | Đổi trỏ theo **mỗi** lần phát hành — cho bên muốn luôn bản mới nhưng không phụ thuộc `main` |
| `raw.githubusercontent.com/…/main/dist/<tep>.json` | Luôn khớp nguồn trên `main` — giữ cho bên đang dùng, không xoá |

Không tạo release nếu các tệp `dist/*.json` được theo dõi không đổi. Kiểm tải về bằng `SHA256SUMS` đính kèm; kiểm cấu trúc bằng `luoc_do_phien_ban` (so major — xem [Cấu trúc](#cấu-trúc) bên dưới).

Giấy phép **CC BY 4.0** — chuỗi ghi nguồn chuẩn (thống nhất 13/10/2026, dùng đúng chuỗi này ở mọi sản phẩm
dẫn dữ liệu kho, kèm ngày `phien_ban` của bản đang dùng):

> Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0, bản `phien_ban`). Đã rút gọn và đổi nhãn hiển thị.

## Cấu trúc

Tất cả **8 tệp** máy trong `dist/` (`registry.json`, `hs-index.json`, `hs-index-theo-ma.json`, `wiki-index.json`, `wiki-chunks.json`, `dieu-khoan.json`, `cas-index.json`, `chinh-sach-mo-ta.json` — đều do `tools/dung.mjs` ghi đồng bộ) mang `luoc_do_phien_ban` — số semver chung của
**cấu trúc** (hiện tại `1.5.0` trong `tools/lib/registry.mjs`; riêng `phien_ban` là ngày dựng). Bên đọc
so **major**: lệch major thì từ chối bản chụp và báo lỗi, thay vì trả sai tình trạng hiệu lực. Lịch sử
lược đồ: [docs/luoc-do-so-dang-ky.md](luoc-do-so-dang-ky.md#lịch-sử-lược-đồ-tệp-máy).

```json
{
  "phien_ban": "2026-10-13",
  "luoc_do_phien_ban": "1.0.0",
  "giay_phep": "CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/",
  "tong": 2279,
  "van_ban": [{
    "so_hieu": "12/2022/TT-BGTVT",
    "so_hieu_khac": [],
    "loai": "THONG_TU",
    "ten": "Quy định Danh mục sản phẩm, hàng hóa có khả năng gây mất an toàn …",
    "co_quan": "BGTVT",
    "ngay_ban_hanh": "2022-06-30",
    "hieu_luc_tu": "2022-08-15",
    "tinh_trang": "HET_HIEU_LUC",
    "het_hieu_luc_tu": "2026-07-01",
    "quan_he_nguoc": {
      "bi_bai_bo_boi": [{ "tu": "49/2026/TT-BXD", "quan_he": "bai_bo", "so_hieu": "12/2022/TT-BGTVT", "tu_ngay": "2026-07-01", "can_cu": "Điều 6 khoản 3 điểm a TT 49/2026/TT-BXD" }]
    },
    "xac_minh": { "muc": "NGUON_A", "hieu_luc_da_doi_chieu": true },
    "bac_nguon_cao_nhat": "A",
    "nguon": [{ "url": "https://vanban.chinhphu.vn/?docid=206074&pageid=27160", "truy_cap": "2026-07-02" }],
    "slug": "12-2022-tt-bgtvt"
  }]
}
```

Ghi chú: `quan_he` (chiều đi) chỉ xuất hiện khi văn bản có quan hệ; `quan_he_nguoc` luôn có (rỗng nếu
không có cạnh). `luoc_do_phien_ban` mới thêm ở 1.0.0 — bản chụp cũ hơn chưa có trường này.

## Hợp đồng trường (bên đọc tiêu thụ — ozplugin "Cổng OZ", docs/yeu-cau/ozplugin.md W3)

Các trường sau được cam kết ổn định: **đổi tên hoặc đổi nghĩa → tăng major** (`luoc_do_phien_ban`);
thêm trường/giá trị mới không phá bên đọc → tăng minor, ghi vào lịch sử lược đồ.

`dist/registry.json`, mỗi phần tử `van_ban[]`:

| Trường | Cam kết |
|---|---|
| `so_hieu`, `so_hieu_khac` | Khoá tra cứu; so khớp qua `khoa()` (quy tắc 1 dưới đây) |
| `tinh_trang` | 6 giá trị (`docs/luoc-do-so-dang-ky.md`); bên đọc nguyên giá trị, không suy lại |
| `hieu_luc_tu`, `het_hieu_luc_tu` | Vắng giá trị thì không suy ra gì; `hieu_luc_tu` tương lai = `CHUA_CO_HIEU_LUC` |
| `quan_he` (chiều đi) | `thay_the`, `sua_doi`, `bai_bo`, `tam_ngung`, `huong_dan`, `hop_nhat` — giữ nguyên `pham_vi`, `tu_ngay`, `can_cu` |
| `quan_he_nguoc` | `bi_thay_the_boi`, `bi_sua_doi_boi`, `bi_bai_bo_boi`, `bi_tam_ngung_boi`, `duoc_huong_dan_boi`, `duoc_hop_nhat_boi` — tính sẵn |
| `xac_minh.muc`, `xac_minh.hieu_luc_da_doi_chieu` | `false` → bên đọc hiện cảnh báo "chưa đối chiếu nguồn A" |
| `xac_minh.chan` | Chỉ để hiểu vì sao chưa đối chiếu; không hiện cho người dùng cuối |
| `nguon[].url`, `bac_nguon_cao_nhat` | Chọn nguồn bậc A làm liên kết "văn bản gốc" |

`dist/hs-index.json`: danh sách theo văn bản — `so_hieu`, `tinh_trang`, `hieu_luc_tu`, `het_hieu_luc_tu`,
`hieu_luc_da_doi_chieu`, mảng `dong` (`ma_hs`, `loai_tac_dong`, `dieu_kien`, `muc_rui_ro`, `dan_chieu`,
`trang`). Danh sách giá trị `loai_tac_dong` (12 giá trị, `tools/lib/danh-muc.mjs` `LOAI_TAC_DONG`) được giữ
ổn định — thêm giá trị mới là minor và ghi vào lịch sử lược đồ, vì bên đọc ánh xạ sang nhãn tiếng Việt.

`dist/hs-index-theo-ma.json` (từ 1.1.0): bản đảo chiều sẵn — `ma` là ánh xạ **nhóm mã HS (4/6/8 số) →
danh sách văn bản áp** kèm `loai_tac_dong`, `muc_rui_ro`, `dieu_kien`, `tinh_trang`. Tra mã 8 số: ghép mọi
khoá là tiền tố của mã (4, 6 số) và khoá trùng 8 số — ngữ nghĩa khớp tiền tố như khi tra thuận chiều;
hướng dẫn bằng chữ nằm trong trường `cach_tra` của chính tệp.

Từ **1.2.0** tệp này thêm ba khối đồng bộ quan điểm phân loại, và từ **1.5.0 (cộng thêm Wave 8)** hỗ trợ thêm trường tuỳ chọn `anh_xa_ahtn_cu` (không phá major `1.x`):

| Trường | Nghĩa | Bên đọc nên làm |
|---|---|---|
| `bieu_thue_doi_chieu` | Bản chụp biểu thuế đã dùng để soi (nguồn, phiên bản, số mã) + đếm nhóm mã không khớp | Ghi phiên bản khi trích dẫn |
| `canh_bao_ma` | Nhóm mã **không có trong biểu thuế** (mã AHTN cũ hoặc trích lệch — vd `28389000` của 09/2024/TT-BYT) | Tra ra khoá này thì **dừng**, không kết luận diện áp; đối chiếu văn bản gốc |
| `tien_le_tb_tchq` | Mật độ thông báo phân loại Tổng cục: `theo_ma_8` (721 mã 8 số, customs.gov.vn) + `theo_nhom_4` (397 nhóm, tracuuhs) | Chỉ tham khảo — văn bản cá biệt bậc C; tra chi tiết `npm run tien-le` |
| `anh_xa_ahtn_cu` *(tuỳ chọn, `1.5.0` cộng thêm)* | Gợi ý ánh xạ mã trong `canh_bao_ma` sang EN2022 từ [`registry/phien-ban-bieu-thue-mapping.yaml`](../registry/phien-ban-bieu-thue-mapping.yaml) (được `kiemAnhXaAhtn` trong `npm run kiem-tra` đối chiếu `nhu-cau/bieu-thue.json` và ghi nhận `HS_AHTN_CU_DA_ANH_XA` trong `npm run diem-mu`): `{ phien_ban_cu, phien_ban_moi, tong_duoc_anh_xa, ghi_chu, mapping: { [maCu]: { hs_moi, loai } } }` | Chỉ dùng để định vị đối chiếu sang biểu thuế EN2022; **không** tự áp mã HS thay cho kiểm tra văn bản gốc & `hs-code-api` |

### Gói dữ liệu `1.6.0` phục vụ Cổng MCP hỏi đáp PLHQ (`ozplugin`)

Từ phiên bản lược đồ `1.5.0` (nâng cấp tương thích ngược lên `1.6.0` với đồ thị sửa đổi cấp Điều khoản), bộ dữ liệu máy `dist/` do `npm run dung` xuất gồm đủ **8 tệp JSON**: 3 tệp nền (`registry.json`, `hs-index.json`, `hs-index-theo-ma.json`) và 5 tệp chuyên biệt phục vụ hỏi đáp PLHQ & Cổng MCP (`wiki-index.json`, `wiki-chunks.json`, `dieu-khoan.json`, `cas-index.json`, `chinh-sach-mo-ta.json`), tuyệt đối không xuất `chu-giai-hs.json` hay `chu-giai-chuong.json`; mọi tệp đều kèm `phien_ban`, `luoc_do_phien_ban`, `giay_phep`, `mien_tru`:

#### 1. `dist/wiki-index.json` & `dist/wiki-chunks.json` (chỉ mục & đoạn wiki có neo hiệu lực)

Sinh từ `wiki/summary/*.md`, `wiki/concepts/*.md`, `wiki/sources/*.md` (bỏ qua `wiki/graph`, `index.md`, `log.md`, `chuan-mau-wiki-source.md`). Mục `## ` dài > 2.000 ký tự trong `wiki-chunks.json` được tách tiếp theo `### ` và giữ tên mục cha dạng `"<Mục ##> > <Mục ###>"`.

- **Đầu tệp chung:** `phien_ban`, `luoc_do_phien_ban`, `giay_phep`, `ghi_nguon_chuan`, `mien_tru`, `tong`.
- **`wiki-index.json` → `trang[]`:** `{ slug, duong_dan, loai_trang, tieu_de, created, updated, tags, confidence, so_chunks, van_ban_lien_quan, canh_bao_hieu_luc }`.
- **`wiki-chunks.json` → `chunks[]`:** `{ chunk_id, slug, duong_dan, loai_trang, tieu_de, muc, noi_dung, tags, confidence, van_ban_lien_quan, canh_bao_hieu_luc }`, với `chunk_id` dạng `<slug>#<idx>` và `loai_trang` thuộc `summary | concepts | sources`.
- **Mỗi phần tử trong `van_ban_lien_quan[]`:** `{ so_hieu, tinh_trang, hieu_luc_tu, het_hieu_luc_tu, hieu_luc_da_doi_chieu, bi_thay_the_boi, bi_bai_bo_boi, nguon_a }`.
- **Quy tắc dùng bắt buộc cho bên đọc:**
  1. Nếu `canh_bao_hieu_luc === true` (chunk thuộc `summary`/`concepts` nhắc văn bản `HET_HIEU_LUC` khác `THONG_BAO` mà trang chưa nhắc văn bản thay/bãi bỏ và thiếu ngữ cảnh lịch sử): **không dùng đoạn đó làm kết luận quy định hiện hành** — kiểm `van_ban_lien_quan[]` để dẫn sang `bi_thay_the_boi` / `bi_bai_bo_boi` hoặc cảnh báo người dùng đối chiếu `nguon_a`.
  2. Luôn đọc `van_ban_lien_quan[]` kèm theo chunk để hiển thị tình trạng hiệu lực và cờ `hieu_luc_da_doi_chieu` của các văn bản được viện dẫn.

#### 2. `dist/dieu-khoan.json` (điều khoản pháp luật tách 2 tầng tin cậy)

Phân tách tuyệt đối hai tầng dữ liệu điều khoản để Cổng MCP **không trộn nháp LLM với nguyên văn đã xác minh**:

- **Đầu tệp:** `phien_ban`, `luoc_do_phien_ban`, `giay_phep`, `mien_tru`, `canh_bao_tang_nhap`, `thong_ke` (`so_van_ban_nguon_a`, `so_dieu_khoan_nguon_a`, `so_van_ban_tom_tat_nhap`, `so_dieu_khoan_tom_tat_nhap`, `so_tep_doc_hieu`, `so_tep_dieu_khoan_day_du`, `so_tep_sua_doi_dieu`, `so_tac_dong_dieu`, `so_dieu_co_lich_su_sua_doi`, `so_dong_loi`, `so_dong_rac_da_loc`).
- **Tầng 1 — `nguyen_van_nguon_a[]`** (từ `xac_minh.dieu_khoan` trong `registry/van-ban/*.yaml`, do `tools/trich-dieu-khoan.mjs` trích từ `.ocr.txt`/PDF lớp chữ/toàn văn hoặc soát tay và được `npm run kiem-tra:dieu-khoan` đối chiếu nguyên văn):
  - Trường: `so_hieu`, `slug`, `ten`, `tinh_trang`, `hieu_luc_tu`, `het_hieu_luc_tu`, `hieu_luc_da_doi_chieu`, `nguon_a`, `tang_tin_cay: "NGUYEN_VAN_NGUON_A"`, `dieu_khoan[]` (`dieu`, `noi_dung` nguyên văn; tuỳ chọn `khoan`, `diem`, `trang_pdf`, `sha256_pdf`; từ `1.6.0` có thêm `trang_thai_dieu` & `lich_su_tac_dong[]` biên dịch từ `data/sua-doi-dieu/*.json`).
  - **Quy tắc dùng:** **được trích dẫn trực tiếp làm căn cứ pháp lý** trong câu trả lời, kèm `nguon_a`.
- **Tầng 2 — `tom_tat_nhap[]`** (từ `data/doc-hieu/*.dieu.jsonl` đã được `laDieuRac` / `tools/gop-doc-hieu.py` lọc dòng rác và chuẩn hoá hậu tố `-body`, `-ocr`, `-tiep`, `-toanvan` về slug văn bản):
  - Trường: `so_hieu`, `slug`, `tinh_trang`, `hieu_luc_tu`, `het_hieu_luc_tu`, `nguon_a`, `tang_tin_cay: "TOM_TAT_NHAP"`, `da_soat: false`, `dieu_khoan[]` (`dieu`, `ten`, `tom_tat`, `nghia_vu_xnk[]`, `nguon_trich`, `da_soat: false`).
  - **Quy tắc dùng:** **CHỈ dùng để định vị điều luật / nghĩa vụ liên quan; TUYỆT ĐỐI KHÔNG trích làm nguyên văn hay khẳng định căn cứ pháp lý.** Khi dùng phải hiện cảnh báo theo `canh_bao_tang_nhap` và dẫn link `nguon_a` để người dùng mở bản gốc.

#### 3. `dist/cas-index.json` (tra cứu hóa chất theo mã CAS)

Dựng từ mọi bảng `danh-muc/*-cas.csv` đã qua kiểm chuẩn 11 cột `kiemDanhMucCas` (hiện gồm `danh-muc/24-2026-nd-cp-cas.csv` của NĐ `24/2026/NĐ-CP`):

- **Đầu tệp:** `phien_ban`, `luoc_do_phien_ban`, `giay_phep`, `mien_tru`, `thong_ke` (`so_tep`, `so_tep_loi`, `tong_dong`, `so_dong_co_cas`, `so_ma_cas_duy_nhat`, `so_dong_khong_co_cas`).
- **Dữ liệu tra cứu:**
  - `theo_cas`: map `<mã CAS>` → mảng các mục `{ cas, ten_chat, ma_hoa_chat, cong_thuc, phan_loai, phu_luc, muc, so_thu_tu, nhom, nguong_kg, nguon, so_hieu, slug, tinh_trang, hieu_luc_tu, het_hieu_luc_tu, hieu_luc_da_doi_chieu, nguon_a, tep }`.
  - `khong_co_cas[]`: danh sách các dòng phụ lục không có mã CAS cố định (cấu trúc trường tương tự, `cas: null`).
- **Quy tắc dùng:** Một mã CAS có thể thuộc nhiều phụ lục cùng lúc (I, II, III, IV), nên cần đọc trọn mảng `theo_cas[cas]` và kèm quy tắc ngưỡng/hỗn hợp của văn bản nguồn (vd `danh-muc/24-2026-nd-cp-cas-quy-tac.md`); tìm thêm trong `khong_co_cas[]` theo tên chất khi tra nhóm chất không có mã CAS.

#### 4. `dist/chinh-sach-mo-ta.json` (tệp thứ 8 — Tầng 2 theo mô tả & Từ điển viết tắt PLHQ)

Dựng từ `danh-muc/chinh-sach-mo-ta.yaml` bằng `dungChinhSachMoTa(so, root, today)` trong [`tools/lib/chinh-sach-mo-ta.mjs`](../tools/lib/chinh-sach-mo-ta.mjs) (cộng thêm trên `1.5.0`, không phá major `1.x`, giữ 0% trùng lặp với `hs-code-api` — không phân loại mã HS, không chạy GIR, không xuất `chu-giai-hs.json`/`chu-giai-chuong.json`):

- **Đầu tệp:** `phien_ban`, `luoc_do_phien_ban` (`"1.5.0"`), `giay_phep`, `ghi_nguon_chuan`, `mien_tru`, `canh_bao_tang_2` (`"Tầng 2 suy ra theo mô tả hàng hóa (VUA_SUY_RA) — chỉ tham khảo kiểm tra chuyên ngành, không phân loại mã HS; luôn đối chiếu văn bản gốc nguồn bậc A."`), `tong_quy_tac`, `tu_dien_viet_tat` (25 thuật ngữ viết tắt chuẩn XNK/PLHQ `TU_DIEN_VIET_TAT_PLHQ`), `quy_tac[]`.
- **Mỗi phần tử trong `quy_tac[]`:** `{ id, ten, nhom_hang, tu_khoa_nhan_dien[], loai_tac_dong, do_tin: "VUA_SUY_RA", can_cu_so_hieu[], can_cu_chi_tiet[], nghia_vu_tom_tat, luu_y_loai_tru, ranh_gioi_hs_api }`.
  - `can_cu_chi_tiet[]` nối trực tiếp từ `so`: `{ so_hieu, slug, tinh_trang, hieu_luc_tu, het_hieu_luc_tu, bac_nguon_cao_nhat, url_nguon_a }`.
- **Quy tắc dùng bắt buộc cho bên đọc:**
  1. Mọi quy tắc đều mang `do_tin: "VUA_SUY_RA"` — **chỉ tham khảo định hướng kiểm tra chuyên ngành theo mô tả; không dùng để áp mã HS hoặc tính thuế suất**, luôn kiểm tra trạng thái `tinh_trang` / `het_hieu_luc_tu` trong `can_cu_chi_tiet[]` (ví dụ `43/2017/NĐ-CP` và `111/2021/NĐ-CP` đã `HET_HIEU_LUC` từ `2026-01-23`) và đối chiếu `url_nguon_a`.
  2. Hiển thị đúng chuỗi ghi nguồn CC BY 4.0 theo W4 (`Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0, bản phien_ban). Đã rút gọn và đổi nhãn hiển thị.`) và `mien_tru`.


## Quy tắc khi dùng

1. **So khớp số hiệu** bằng khoá chuẩn: viết hoa, `Đ` → `D`, bỏ khoảng trắng (xem `khoa()` trong
   `tools/lib/registry.mjs`); nạp cả `so_hieu_khac` vào chỉ mục.
2. **Tôn trọng mức xác minh:** `xac_minh.hieu_luc_da_doi_chieu: false` nghĩa là tình trạng hiệu lực chưa
   được đối chiếu nguồn A — hiển thị như cảnh báo cần kiểm lại, không như kết luận.
3. **Không tự suy hiệu lực từ ngày**: dùng `tinh_trang` + `het_hieu_luc_tu`; quan hệ có `pham_vi` là tác
   động một phần.
4. **Tôn trọng cờ hiệu lực wiki & phân tầng điều khoản (`1.5.0`):** không kết luận từ chunk có `canh_bao_hieu_luc: true`; không trích `TOM_TAT_NHAP` như nguyên văn căn cứ pháp lý.
5. Thấy sai → mở issue mẫu "Sai hiệu lực" ở kho này.

## Ứng dụng đang dùng

- **[hs-code-api](https://github.com/ozvietnam/hs-code-api)** — `scripts/sync-plhq.mjs` chụp `dist/registry.json` vào
  `data/plhq-registry.json`; `/api/tax` trả `legalBasisRegistry` (hiệu lực từng văn bản mà cột chính sách
  của mã HS dẫn) và đưa văn bản hết hiệu lực/tạm ngưng vào `policyBasisReview`. `scripts/bench-plhq.mjs` đo
  độ phủ trên toàn biểu thuế và in danh sách văn bản cần kho này đối chiếu trước (theo số mã HS chịu ảnh hưởng).
- **Cổng MCP `ozplugin` ("Cổng OZ") & MCP/CLI cục bộ** — tiêu thụ trọn gói `dist/` `1.5.0` (**8 tệp**) cho hỏi đáp PLHQ (hiệu lực VBQPPL, danh mục HS/CAS & gợi ý AHTN, wiki chunks, điều khoản 2 tầng, Tầng 2 theo mô tả & 25 viết tắt PLHQ), phối hợp với `hs-code-api` cho phân loại HS, biểu thuế và tiền lệ (xem [docs/yeu-cau/ozplugin.md](yeu-cau/ozplugin.md), [docs/mcp-server.md](mcp-server.md) và [docs/SO-DO-HE-THONG.md](SO-DO-HE-THONG.md)). Chất lượng truy hồi sống và độ phủ dữ liệu được đo kiểm định kỳ bằng `npm run eval:qa` & `npm run eval:retrieval` trên **60 câu** (`eval/cau-hoi-nghiep-vu.yaml`).
- **Cổng tra cứu web công khai V2 (`site/` trên GitHub Pages)** — dựng tĩnh `0` CDN bằng `npm run dung:web` (`.github/workflows/trang-web.yml`) với **5 tab** và **7 tệp** `site/data/*.json` (rút gọn `registry.json`, `wiki-index.json`, `wiki-chunks.json`, `dieu-khoan.json`, `cas-index.json`, `hs-policy.json`, `sap-het-hieu-luc.json`).

### Cầu nối tự động hai chiều

| Chiều | Cơ chế | Khi nào |
|---|---|---|
| Kho này → hs-code-api | Workflow `plhq-sync` bên hs-code-api tải `dist/registry.json`, đo lại, chạy test, commit (thay đổi lớn → PR cho người duyệt) | Mỗi ngày 08:17 giờ VN; ngay sau mỗi lần gộp vào main nếu kho này có secret `HS_CODE_API_DISPATCH_TOKEN` (workflow `dung-lai-va-bao-hs-code-api`, cũng là bước bot dựng lại `dist/` + `bao-cao/`) |
| hs-code-api → kho này | `node tools/nhu-cau.mjs` kéo `data/plhq-bench-latest.json` (repo công khai) vào `nhu-cau/hs-code-api.json`; `tools/diem-mu.mjs` sinh việc `HS_API_*` xếp theo số mã HS | Mỗi thứ Hai trong workflow `bao-cao-tuan` |
| **Hàng thật** (hs-code-api → kho này) | `node tools/nhu-cau.mjs` kéo `GET https://hs-kb.uythacnhapkhau.com/api/demand` (mục `ktcn2026`) vào `nhu-cau/hang-that.json`: mã HS của món hàng thật đi qua phiếu hồ sơ khai báo mà chưa bảng danh mục KTCN 2026 nào phủ. `tools/diem-mu.mjs` sinh việc `HANG_THAT_CHUA_DOI_CHIEU_KTCN` (mức theo ưu tiên của hs-code-api). Chỉ có mức ưu tiên, không số lượng / tên hàng / khách. Trích xong bảng phủ mã → việc tự biến mất; đối chiếu xong mà **không thuộc diện** → ghi 1 dòng vào `doi-chieu/hang-that.csv` (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng | Mỗi thứ Hai trong workflow `bao-cao-tuan` |
| **Văn bản biểu thuế** (hs-code-api → kho này) | `node tools/nhu-cau.mjs` kéo `data/bieu-thue/van-ban-bieu-thue.json` (hs-code-api trích từ tệp Excel biểu thuế XNK của Tổng cục bằng skill `bieu-thue-xnk`: sheet "Hệ thống văn bản" + cột chính sách mặt hàng) vào `nhu-cau/bieu-thue-van-ban.json`. `tools/diem-mu.mjs` sinh `BIEU_THUE_CHUA_CO` (biểu nêu, sổ chưa có; Cao nếu là văn bản hiện hành của một biểu/danh mục) và `BIEU_THUE_HIEN_HANH_DA_HET` (biểu còn coi là hiện hành nhưng sổ ghi hết/tạm ngưng — cần ghi văn bản thay để hs-code-api dẫn người khai sang văn bản đúng). Chỉ số hiệu, vai trò, tên biểu/danh mục, số mã HS — **nội dung và hiệu lực văn bản là việc của kho này** (CEO OZ 12/10/2026) | Mỗi thứ Hai trong workflow `bao-cao-tuan`; hs-code-api cập nhật tệp mỗi khi có biểu thuế mới |
| **Tiền lệ TB-TCHQ** (kho này → hs-code-api) | Crawl TB-TCHQ mở chi tiết (`data/customs/`) → `node tools/dong-goi-lo-tb-tchq.mjs` → lô `data/community/tb-tchq/` bên hs-code-api → `merge-community.mjs` → `data/precedents.json` phục vụ `/api/precedents`. Kiểm bằng `validate-community.mjs` (0 lỗi). Luồng: [docs/luong-tb-tchq.md](luong-tb-tchq.md) | Theo lô, mỗi lô một PR |
| Tra cứu trực tiếp | `GET https://hs-kb.uythacnhapkhau.com/api/legal-status?so=28/2026/TT-BCT` (công khai) | Bất kỳ lúc nào |

Bốn loại việc nhóm `HS_API_*` từ hs-code-api trong báo cáo điểm mù:
- `HS_API_UU_TIEN_DOI_CHIEU` — văn bản biểu thuế đang dẫn mà sổ chưa đối chiếu nguồn A, xếp theo số mã HS
  (văn bản dẫn ≥ 50 mã là mức Cao). Đây là hàng đợi nên làm trước của luồng `hieu-luc`.
- `HS_API_CHO_MO_CHAN` — cùng nhu cầu trên nhưng sổ đã ghi `xac_minh.chan` (đã săn hết đường A khả thi).
  Mức Thấp — **không** săn lặp; làm theo `chan.viec_tiep` hoặc chuyển luồng. Xem `node tools/san-hieu-luc.mjs`.
- `HS_API_CHUA_CO` — biểu thuế dẫn văn bản mà sổ chưa có.
- `HS_API_LECH_THU_VIEN` — thư viện `/api/legal-docs` của hs-code-api ghi tình trạng khác sổ; đối chiếu nguồn A
  rồi sửa bên sai (sổ sai thì sửa ở đây, sổ đúng thì ghi `hieu_luc_da_doi_chieu: true` và mở issue bên hs-code-api).
