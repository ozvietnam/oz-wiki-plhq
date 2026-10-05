# Dùng sổ đăng ký trong ứng dụng khác

Kho này xuất `dist/registry.json` (dựng bằng `npm run dung`, tự cập nhật mỗi thứ Hai). Ứng dụng khác chỉ
**đọc** tệp này; muốn sửa dữ liệu thì mở PR vào `registry/` — không sửa bản chụp ở phía ứng dụng.

URL ổn định: `https://raw.githubusercontent.com/ozvietnam/oz-wiki-plhq/main/dist/registry.json`
Giấy phép CC BY 4.0 — ghi nguồn "oz-wiki-plhq".

## Cấu trúc

```json
{
  "phien_ban": "2026-10-04",
  "tong": 136,
  "van_ban": [{
    "so_hieu": "12/2022/TT-BGTVT",
    "so_hieu_khac": [],
    "tinh_trang": "HET_HIEU_LUC",
    "het_hieu_luc_tu": "2026-07-01",
    "quan_he_nguoc": { "bi_thay_the_boi": [{ "tu": "49/2026/TT-BXD", "quan_he": "thay_the" }] },
    "xac_minh": { "muc": "NGUON_A", "hieu_luc_da_doi_chieu": false },
    "bac_nguon_cao_nhat": "A",
    "slug": "12-2022-tt-bgtvt"
  }]
}
```

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
| Tra cứu trực tiếp | `GET https://hs-kb.uythacnhapkhau.com/api/legal-status?so=28/2026/TT-BCT` (công khai) | Bất kỳ lúc nào |

Ba loại việc từ hs-code-api trong báo cáo điểm mù:
- `HS_API_UU_TIEN_DOI_CHIEU` — văn bản biểu thuế đang dẫn mà sổ chưa đối chiếu nguồn A, xếp theo số mã HS
  (văn bản dẫn ≥ 50 mã là mức Cao). Đây là hàng đợi nên làm trước của luồng `hieu-luc`.
- `HS_API_CHO_MO_CHAN` — cùng nhu cầu trên nhưng sổ đã ghi `xac_minh.chan` (đã săn hết đường A khả thi).
  Mức Thấp — **không** săn lặp; làm theo `chan.viec_tiep` hoặc chuyển luồng. Xem `node tools/san-hieu-luc.mjs`.
- `HS_API_CHUA_CO` — biểu thuế dẫn văn bản mà sổ chưa có.
- `HS_API_LECH_THU_VIEN` — thư viện `/api/legal-docs` của hs-code-api ghi tình trạng khác sổ; đối chiếu nguồn A
  rồi sửa bên sai (sổ sai thì sửa ở đây, sổ đúng thì ghi `hieu_luc_da_doi_chieu: true` và mở issue bên hs-code-api).
