# Dùng sổ đăng ký trong ứng dụng khác

Kho này xuất `dist/registry.json` (dựng bằng `npm run dung`, tự cập nhật mỗi thứ Hai). Ứng dụng khác chỉ
**đọc** tệp này; muốn sửa dữ liệu thì mở PR vào `registry/` — không sửa bản chụp ở phía ứng dụng.

URL ổn định: `https://raw.githubusercontent.com/ozvietnam/oz-wiki-plhq/main/dist/registry.json`
(hợp đồng: URL này luôn khớp `registry/` — bot dựng lại ngay sau mỗi lần gộp).

## Phát hành ổn định (bản chụp gắn thẻ)

Ngoài URL `main`, mỗi lần nội dung hai tệp máy **đổi**, workflow `dung-lai-va-bao-hs-code-api` tạo một
GitHub Release gắn thẻ `dist-YYYY-MM-DD` (hậu tố `.N` nếu trùng ngày), đính kèm `registry.json`,
`hs-index.json` và `SHA256SUMS`. Ba loại URL, hợp đồng như sau:

| URL | Đổi hay không |
|---|---|
| `…/releases/download/dist-YYYY-MM-DD[.N]/registry.json` | **Bất biến** — bản cũ không bị xoá, quay lại được khi bản mới lỗi |
| `…/releases/latest/download/registry.json` (và `…/hs-index.json`) | Đổi trỏ theo **mỗi** lần phát hành — cho bên muốn luôn bản mới nhưng không phụ thuộc `main` |
| `raw.githubusercontent.com/…/main/dist/…` | Luôn khớp `registry/` — giữ cho bên đang dùng, không xoá |

Không tạo release nếu hai tệp không đổi. Kiểm tải về bằng `SHA256SUMS` đính kèm; kiểm cấu trúc bằng
`luoc_do_phien_ban` (so major — xem [Cấu trúc](#cấu-trúc) bên dưới).

Giấy phép **CC BY 4.0** — chuỗi ghi nguồn chuẩn (thống nhất 13/10/2026, dùng đúng chuỗi này ở mọi sản phẩm
dẫn dữ liệu kho, kèm ngày `phien_ban` của bản đang dùng):

> Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0, bản `phien_ban`). Đã rút gọn và đổi nhãn hiển thị.

## Cấu trúc

Hai tệp máy `dist/registry.json` và `dist/hs-index.json` đều mang `luoc_do_phien_ban` — số semver của
**cấu trúc** (riêng với `phien_ban` là ngày dựng; ngày này đổi mỗi lần dựng, không đổi cấu trúc). Bên đọc
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

Từ **1.2.0** tệp này thêm ba khối đồng bộ quan điểm phân loại:

| Trường | Nghĩa | Bên đọc nên làm |
|---|---|---|
| `bieu_thue_doi_chieu` | Bản chụp biểu thuế đã dùng để soi (nguồn, phiên bản, số mã) + đếm nhóm mã không khớp | Ghi phiên bản khi trích dẫn |
| `canh_bao_ma` | Nhóm mã **không có trong biểu thuế** (mã AHTN cũ hoặc trích lệch — vd `28389000` của 09/2024/TT-BYT) | Tra ra khoá này thì **dừng**, không kết luận diện áp; đối chiếu văn bản gốc |
| `tien_le_tb_tchq` | Mật độ thông báo phân loại Tổng cục: `theo_ma_8` (721 mã 8 số, customs.gov.vn) + `theo_nhom_4` (397 nhóm, tracuuhs) | Chỉ tham khảo — văn bản cá biệt bậc C; tra chi tiết `npm run tien-le` |


## Quy tắc khi dùng

1. **So khớp số hiệu** bằng khoá chuẩn: viết hoa, `Đ` → `D`, bỏ khoảng trắng (xem `khoa()` trong
   `tools/lib/registry.mjs`); nạp cả `so_hieu_khac` vào chỉ mục.
2. **Tôn trọng mức xác minh:** `xac_minh.hieu_luc_da_doi_chieu: false` nghĩa là tình trạng hiệu lực chưa
   được đối chiếu nguồn A — hiển thị như cảnh báo cần kiểm lại, không như kết luận.
3. **Không tự suy hiệu lực từ ngày**: dùng `tinh_trang` + `het_hieu_luc_tu`; quan hệ có `pham_vi` là tác
   động một phần.
4. Thấy sai → mở issue mẫu "Sai hiệu lực" ở kho này.

## Ứng dụng đang dùng

- **[hs-code-api](https://github.com/ozvietnam/hs-code-api)** — `scripts/sync-plhq.mjs` chụp tệp này vào
  `data/plhq-registry.json`; `/api/tax` trả `legalBasisRegistry` (hiệu lực từng văn bản mà cột chính sách
  của mã HS dẫn) và đưa văn bản hết hiệu lực/tạm ngưng vào `policyBasisReview`. `scripts/bench-plhq.mjs` đo
  độ phủ trên toàn biểu thuế và in danh sách văn bản cần kho này đối chiếu trước (theo số mã HS chịu ảnh hưởng).

### Cầu nối tự động hai chiều

| Chiều | Cơ chế | Khi nào |
|---|---|---|
| Kho này → hs-code-api | Workflow `plhq-sync` bên hs-code-api tải `dist/registry.json`, đo lại, chạy test, commit (thay đổi lớn → PR cho người duyệt) | Mỗi ngày 08:17 giờ VN; ngay sau mỗi lần gộp vào main nếu kho này có secret `HS_CODE_API_DISPATCH_TOKEN` (workflow `dung-lai-va-bao-hs-code-api`, cũng là bước bot dựng lại `dist/` + `bao-cao/`) |
| hs-code-api → kho này | `node tools/nhu-cau.mjs` kéo `data/plhq-bench-latest.json` (repo công khai) vào `nhu-cau/hs-code-api.json`; `tools/diem-mu.mjs` sinh việc `HS_API_*` xếp theo số mã HS | Mỗi thứ Hai trong workflow `bao-cao-tuan` |
| **Hàng thật** (hs-code-api → kho này) | `node tools/nhu-cau.mjs` kéo `GET https://hs-kb.uythacnhapkhau.com/api/demand` (mục `ktcn2026`) vào `nhu-cau/hang-that.json`: mã HS của món hàng thật đi qua phiếu hồ sơ khai báo mà chưa bảng danh mục KTCN 2026 nào phủ. `tools/diem-mu.mjs` sinh việc `HANG_THAT_CHUA_DOI_CHIEU_KTCN` (mức theo ưu tiên của hs-code-api). Chỉ có mức ưu tiên, không số lượng / tên hàng / khách. Trích xong bảng phủ mã → việc tự biến mất; đối chiếu xong mà **không thuộc diện** → ghi 1 dòng vào `doi-chieu/hang-that.csv` (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng | Mỗi thứ Hai trong workflow `bao-cao-tuan` |
| **Văn bản biểu thuế** (hs-code-api → kho này) | `node tools/nhu-cau.mjs` kéo `data/bieu-thue/van-ban-bieu-thue.json` (hs-code-api trích từ tệp Excel biểu thuế XNK của Tổng cục bằng skill `bieu-thue-xnk`: sheet "Hệ thống văn bản" + cột chính sách mặt hàng) vào `nhu-cau/bieu-thue-van-ban.json`. `tools/diem-mu.mjs` sinh `BIEU_THUE_CHUA_CO` (biểu nêu, sổ chưa có; Cao nếu là văn bản hiện hành của một biểu/danh mục) và `BIEU_THUE_HIEN_HANH_DA_HET` (biểu còn coi là hiện hành nhưng sổ ghi hết/tạm ngưng — cần ghi văn bản thay để hs-code-api dẫn người khai sang văn bản đúng). Chỉ số hiệu, vai trò, tên biểu/danh mục, số mã HS — **nội dung và hiệu lực văn bản là việc của kho này** (CEO OZ 12/10/2026) | Mỗi thứ Hai trong workflow `bao-cao-tuan`; hs-code-api cập nhật tệp mỗi khi có biểu thuế mới |
| **Tiền lệ TB-TCHQ** (kho này → hs-code-api) | Crawl TB-TCHQ mở chi tiết (`data/customs/`) → `node tools/dong-goi-lo-tb-tchq.mjs` → lô `data/community/tb-tchq/` bên hs-code-api → `merge-community.mjs` → `data/precedents.json` phục vụ `/api/precedents`. Kiểm bằng `validate-community.mjs` (0 lỗi). Luồng: [docs/luong-tb-tchq.md](luong-tb-tchq.md) | Theo lô, mỗi lô một PR |
| Tra cứu trực tiếp | `GET https://hs-kb.uythacnhapkhau.com/api/legal-status?so=28/2026/TT-BCT` (công khai) | Bất kỳ lúc nào |

Ba loại việc từ hs-code-api trong báo cáo điểm mù:
- `HS_API_UU_TIEN_DOI_CHIEU` — văn bản biểu thuế đang dẫn mà sổ chưa đối chiếu nguồn A, xếp theo số mã HS
  (văn bản dẫn ≥ 50 mã là mức Cao). Đây là hàng đợi nên làm trước của luồng `hieu-luc`.
- `HS_API_CHO_MO_CHAN` — cùng nhu cầu trên nhưng sổ đã ghi `xac_minh.chan` (đã săn hết đường A khả thi).
  Mức Thấp — **không** săn lặp; làm theo `chan.viec_tiep` hoặc chuyển luồng. Xem `node tools/san-hieu-luc.mjs`.
- `HS_API_CHUA_CO` — biểu thuế dẫn văn bản mà sổ chưa có.
- `HS_API_LECH_THU_VIEN` — thư viện `/api/legal-docs` của hs-code-api ghi tình trạng khác sổ; đối chiếu nguồn A
  rồi sửa bên sai (sổ sai thì sửa ở đây, sổ đúng thì ghi `hieu_luc_da_doi_chieu: true` và mở issue bên hs-code-api).
