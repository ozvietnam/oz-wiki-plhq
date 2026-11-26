# Lược đồ Xuất xứ hàng hoá & FTA (`fta-psr@1`)

Tài liệu chuẩn hoá dữ liệu **sự thật pháp lý** về các Hiệp định thương mại tự do (FTA) và thoả thuận thương mại ưu đãi có cơ sở văn bản trong `registry/van-ban/*.yaml`.

## 1. Ranh giới tuyệt đối với `hs-code-api` (0% trùng lặp)

| Miền tri thức | `oz-wiki-plhq` (`fta-psr@1`) | `hs-code-api` |
|---|---|---|
| **Văn bản pháp lý FTA & hiệu lực** | Giữ mã FTA, tên hiệp định, đối tác, mẫu C/O (`mau_co`), cơ chế tự chứng nhận (`tu_chung_nhan`), quy tắc *de minimis* mặc định đã đối chiếu văn bản gốc (`de_minimis_mac_dinh`), ngày hiệu lực và danh sách văn bản gốc (`van_ban_xuat_xu[]` nối `id: vb:<slug>`, `nguon_a`) | Tiêu thụ `dist/xuat-xu-fta.json` qua `dist/manifest.json` (`lop-kho@1`) để gắn căn cứ pháp lý C/O |
| **Biểu thuế suất FTA & tính thuế** | **KHÔNG** lưu, suy diễn hay tính toán thuế suất ưu đãi đặc biệt theo dòng HS | **Nguồn sự thật biểu thuế & tính thuế** (`/api/tax`, `data/tax.json`) |
| **Phân loại mã HS & GIR** | **KHÔNG** phân loại mã HS hay chạy 6 quy tắc GIR | **Nguồn sự thật phân loại HS** (`/api/classify`, `lib/gir.js`) |

> Mọi trường liên quan tới thuế suất (vd `thue_suat`, `bieu_thue_chi_tiet`, `ma_hs_thue`) bị chặn ngay tại cổng kiểm `kiemTraXuatXuFta()`.

---

## 2. Lược đồ nguồn `registry/xuat-xu-fta.yaml`

```yaml
chuan_fta: fta-psr@1
van_ban_khung_chung:            # tuỳ chọn — khung pháp lý xuất xứ & cấp C/O áp dụng chung
  - so_hieu: 31/2018/NĐ-CP
    vai_tro: QUY_TAC_XUAT_XU    # QUY_TAC_XUAT_XU | BIEU_THUE_UU_DAI | HIEP_DINH | DAU_MOI | THU_TUC
hiep_dinh:
  - ma_fta: ATIGA               # duy nhất, viết hoa (A-Z, 0-9, -)
    ten_hiep_dinh: Hiệp định Thương mại Hàng hóa ASEAN (ATIGA)
    doi_tac: [Brunei, Campuchia, ...]
    mau_co: [Form D, e-Form D]
    tu_chung_nhan: true         # boolean
    de_minimis_mac_dinh: null   # chuỗi trích dẫn điều khoản đã đối chiếu, hoặc null nếu chưa có bản gốc trong sổ
    hieu_luc_tu: '2010-05-17'   # YYYY-MM-DD
    van_ban_xuat_xu:
      - so_hieu: 10/2022/TT-BCT
        vai_tro: QUY_TAC_XUAT_XU
        lich_su: false          # tuỳ chọn; bắt buộc true nếu dẫn văn bản HET_HIEU_LUC làm tham chiếu lịch sử
      - so_hieu: 126/2022/NĐ-CP
        vai_tro: BIEU_THUE_UU_DAI
    ghi_chu_phap_ly: "..."      # tuỳ chọn
```

### Quy tắc kiểm chuẩn (`tools/lib/xuat-xu-fta.mjs` → `tools/kiem-tra.mjs`)

1. `chuan_fta` bắt buộc bằng `'fta-psr@1'`; `hiep_dinh[]` không rỗng, không trùng `ma_fta`.
2. `doi_tac[]` và `mau_co[]` phải là mảng chuỗi không rỗng; `tu_chung_nhan` phải là `boolean`; `de_minimis_mac_dinh` là chuỗi không rỗng hoặc `null`.
3. `hieu_luc_tu` (và `het_hieu_luc_tu` nếu có) phải đúng chuẩn lịch `YYYY-MM-DD`.
4. `vai_tro` phải thuộc 5 giá trị chuẩn: `QUY_TAC_XUAT_XU`, `BIEU_THUE_UU_DAI`, `HIEP_DINH`, `DAU_MOI`, `THU_TUC`.
5. **Mọi** `so_hieu` trong `van_ban_xuat_xu[]` (và `van_ban_khung_chung[]`) **phải tồn tại** trong `napSo().theoKhoa`.
6. Văn bản ở trạng thái `HET_HIEU_LUC` chỉ được dẫn khi đánh dấu tường minh `lich_su: true`; nếu không, `kiemTraXuatXuFta()` báo lỗi chặn PR.

---

## 3. Lược đồ sản phẩm máy `dist/xuat-xu-fta.json`

Sinh bởi `dungXuatXuFta(so, root, today)` trong `tools/dung.mjs` và đăng ký trong `dist/manifest.json` (`9` tệp, `lop_du_lieu: "LUAT"`):

```json
{
  "phien_ban": "2026-11-26",
  "luoc_do_phien_ban": "1.7.0",
  "chuan_fta": "fta-psr@1",
  "lop_du_lieu": "LUAT",
  "giay_phep": "CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/",
  "tong": 19,
  "van_ban_khung_chung": [ ... ],
  "hiep_dinh": [
    {
      "id": "fta:atiga",
      "ma_fta": "ATIGA",
      "ten_hiep_dinh": "...",
      "doi_tac": ["..."],
      "mau_co": ["Form D", "e-Form D"],
      "tu_chung_nhan": true,
      "de_minimis_mac_dinh": null,
      "hieu_luc_tu": "2010-05-17",
      "van_ban": [
        {
          "id": "vb:10-2022-tt-bct",
          "so_hieu": "10/2022/TT-BCT",
          "slug": "10-2022-tt-bct",
          "tinh_trang": "CON_HIEU_LUC",
          "hieu_luc_tu": "2022-07-16",
          "het_hieu_luc_tu": null,
          "nguon_a": "https://datafiles.chinhphu.vn/...",
          "vai_tro": "QUY_TAC_XUAT_XU"
        }
      ],
      "van": "<64-hex SHA-256>"
    }
  ]
}
```

### Hỗ trợ tra cứu tại ngày (`tai_ngay`)

Hàm `locXuatXuFtaTaiNgay(ftaDist, taiNgay, store)` chuẩn hoá `tai_ngay` (`YYYY-MM-DD`) qua `chuanHoaTaiNgay()`, lọc các hiệp định đang hiệu lực tại ngày tờ khai (`hieu_luc_tu <= tai_ngay` và chưa tới `het_hieu_luc_tu`), đồng thời tính `tinh_trang_tai_ngay` và `do_chinh_xac_ngay` cho từng văn bản liên kết qua `tinhTinhTrangTaiNgay()` (`tools/lib/hieu-luc-theo-ngay.mjs`).
