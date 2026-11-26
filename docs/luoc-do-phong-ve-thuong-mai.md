# Lược đồ Lá chắn Phòng vệ thương mại (`pvtm@1`)

Tài liệu chuẩn hoá dữ liệu **sự thật pháp lý** về các vụ việc Phòng vệ thương mại (Chống bán phá giá, Chống trợ cấp, Tự vệ, Chống lẩn tránh biện pháp PVTM) do Bộ Công Thương Việt Nam ban hành và đối chiếu nguyên văn từ PDF bậc A (`pvtm.gov.vn`, `moit.gov.vn`).

## 1. Ranh giới tuyệt đối với `hs-code-api` (0% trùng lặp)

| Miền tri thức | `oz-wiki-plhq` (`pvtm@1`) | `hs-code-api` |
|---|---|---|
| **Sự thật pháp lý vụ việc PVTM & chuỗi QĐ-BCT** | Giữ mã vụ việc (`AD17`, `ER01.AD04`, ...), loại biện pháp, trạng thái, xuất xứ bị áp (`ISO-2`), danh sách mã HS 8 số nêu nguyên văn trong Quyết định/Thông báo kèm theo, dải thuế suất pháp định (`toi_thieu` – `toi_da`), cơ chế miễn trừ cơ bản (`mien_tru_co_ban`), thời hạn hiệu lực và chuỗi quyết định (`chuoi_quyet_dinh[]`) gắn `id: vb:<slug>`, `nguon_a`, vân tay `van` | Tiêu thụ `dist/pvtm.json` và `dist/hs-index-theo-ma.json` qua `dist/manifest.json` (`lop-kho@1`) để cảnh báo pháp lý trên hồ sơ mã |
| **Bảng tra mã HS văn bản (`danh-muc/<slug>.csv`)** | Chỉ trích các Quyết định `QĐ-BCT` đang có hiệu lực áp thuế hoặc đang điều tra có nêu tường minh mã HS trong PDF bậc A (`loai_tac_dong: PHONG_VE_THUONG_MAI`); không gán CSV cho các QĐ chấm dứt/không gia hạn để tránh báo nhầm nghĩa vụ đang áp dụng | Không tự sửa sổ văn bản gốc |
| **Phân loại mã HS, GIR & tính thuế chi tiết** | **KHÔNG** phân loại mã HS từ mô tả hàng hoá, **KHÔNG** giải thích GIR, **KHÔNG** tính toán số tiền thuế MFN/FTA/PVTM cụ thể theo từng nhà sản xuất hoặc tờ khai | **Nguồn sự thật phân loại HS & biểu thuế** (`/api/classify`, `/api/tax`) |

> Mọi trường lấn ranh giới biểu thuế chi tiết/phân loại (`bieu_thue_chi_tiet`, `thue_mfn`, `thue_fta`, `phan_loai_gir`, `bang_thue_cong_ty`) bị chặn ngay tại `kiemTraPhongVeThuongMai()`.

---

## 2. Lược đồ nguồn `registry/phong-ve-thuong-mai.yaml`

```yaml
chuan_pvtm: pvtm@1
vu_viec:
  - ma_vu_viec: AD17
    loai_bien_phap: CHONG_BAN_PHA_GIA   # CHONG_BAN_PHA_GIA | CHONG_TRO_CAP | TU_VE | CHONG_LAN_TRANH
    ten_mat_hang: Sản phẩm cáp thép dự ứng lực (PC Strand)
    trang_thai: DANG_AP_DUNG            # DANG_AP_DUNG | DANG_DIEU_TRA | TAM_THOI | HET_HIEU_LUC
    xuat_xu_bi_ap: [MY, TH, CN]         # mã quốc gia/vùng lãnh thổ ISO-2 in hoa
    ma_hs:
      - '73121091'
      - '73121099'
    dai_thue_suat_phan_tram:
      toi_thieu: 4.47                   # số >= 0 hoặc null (khi thuế tuyệt đối VNĐ/tấn, đang điều tra hoặc đã hết hiệu lực)
      toi_da: 28
      ghi_chu: "Malaysia 9,79%–12,06%; Thái Lan 11%; Trung Quốc 4,47%–28% (QĐ 2927/QĐ-BCT điều chỉnh Nhóm công ty Boxing xuống 4,47% từ 19/11/2026)."
    hieu_luc_tu: '2025-01-29'
    het_hieu_luc_tu: '2030-01-29'
    mien_tru_co_ban: true
    chuoi_quyet_dinh:
      - so_hieu: 143/QĐ-BCT
        vai_tro: CHINH_THUC             # CHINH_THUC | RA_SOAT_HANG_NAM | RA_SOAT_CUOI_KY | GIA_HAN | KHOI_XUONG | HUONG_DAN
      - so_hieu: 2927/QĐ-BCT
        vai_tro: RA_SOAT_HANG_NAM
      - so_hieu: 139/TXNK-CST
        vai_tro: HUONG_DAN
      - so_hieu: 438/TCHQ-TXNK
        vai_tro: HUONG_DAN
    ghi_chu_phap_ly: "..."
```

### Quy tắc kiểm chuẩn (`tools/lib/phong-ve-thuong-mai.mjs` → `tools/kiem-tra.mjs`)

1. `chuan_pvtm` bắt buộc bằng `'pvtm@1'`; `vu_viec[]` không rỗng, không trùng `ma_vu_viec`.
2. `loai_bien_phap` thuộc `CHONG_BAN_PHA_GIA`, `CHONG_TRO_CAP`, `TU_VE`, `CHONG_LAN_TRANH`; `trang_thai` thuộc `DANG_AP_DUNG`, `DANG_DIEU_TRA`, `TAM_THOI`, `HET_HIEU_LUC`.
3. `xuat_xu_bi_ap[]` gồm các mã quốc gia/vùng lãnh thổ chuẩn `ISO-2` (`^[A-Z]{2}$`, không trùng); bắt buộc không rỗng với các biện pháp theo xuất xứ (`CHONG_BAN_PHA_GIA`, `CHONG_TRO_CAP`), chỉ cho phép `[]` với biện pháp tự vệ toàn cầu (`TU_VE` hoặc chống lẩn tránh gắn tự vệ toàn cầu `pham_vi_toan_cau: true`).
4. `ma_hs[]` không rỗng, mỗi phần tử là chuỗi 4, 6 hoặc 8 chữ số hợp lệ (không dấu chấm, không trùng).
5. `dai_thue_suat_phan_tram`: `toi_thieu` và `toi_da` cùng là số `>= 0` (`toi_thieu <= toi_da`) hoặc cùng là `null` (trường hợp thuế tuyệt đối tính theo VNĐ/tấn như bột ngọt `1914/QĐ-BCT`, đang điều tra như `3176/QĐ-BCT`, hoặc vụ việc đã chấm dứt/hết hiệu lực), kèm `ghi_chu` nguyên văn.
6. **Mọi** `so_hieu` trong `chuoi_quyet_dinh[]` **phải tồn tại** trong `napSo().theoKhoa`; các vụ việc `DANG_AP_DUNG`, `DANG_DIEU_TRA`, `TAM_THOI` bắt buộc có ít nhất một văn bản `CON_HIEU_LUC` trong `chuoi_quyet_dinh[]`.

---

## 3. Lược đồ sản phẩm máy `dist/pvtm.json` & tích hợp MCP

`dungPhongVeThuongMai(so, root, today)` trong `tools/dung.mjs` xuất `dist/pvtm.json` và đăng ký vào `dist/manifest.json` (`lop_du_lieu: "LUAT"`, `10` tệp):

```json
{
  "luoc_do_phien_ban": "1.7.0",
  "chuan_pvtm": "pvtm@1",
  "lop_du_lieu": "LUAT",
  "phien_ban": "2026-11-26",
  "tong_vu_viec": 23,
  "vu_viec": [
    {
      "id": "pvtm:ad17",
      "van": "<64-hex sha256 via tinhVanTay>",
      "ma_vu_viec": "AD17",
      "loai_bien_phap": "CHONG_BAN_PHA_GIA",
      "ten_mat_hang": "Sản phẩm cáp thép dự ứng lực (PC Strand)",
      "trang_thai": "DANG_AP_DUNG",
      "xuat_xu_bi_ap": ["MY", "TH", "CN"],
      "ma_hs": ["73121091", "73121099"],
      "nut_bieu": ["bieu:73121091", "bieu:73121099"],
      "dai_thue_suat_phan_tram": {
        "toi_thieu": 4.47,
        "toi_da": 28,
        "ghi_chu": "..."
      },
      "hieu_luc_tu": "2025-01-29",
      "het_hieu_luc_tu": "2030-01-29",
      "mien_tru_co_ban": true,
      "chuoi_quyet_dinh": [
        {
          "id": "vb:143-qd-bct-2025",
          "so_hieu": "143/QĐ-BCT",
          "slug": "143-qd-bct-2025",
          "tinh_trang": "CON_HIEU_LUC",
          "vai_tro": "CHINH_THUC",
          "hieu_luc_tu": "2025-01-29",
          "het_hieu_luc_tu": "2030-01-29",
          "nguon_a": "https://pvtm.gov.vn/..."
        }
      ],
      "ghi_chu_phap_ly": "..."
    }
  ]
}
```

### Tra cứu theo mã HS & ngày tờ khai (`plhq_chinh_sach_theo_hs`)

Hàm `locPvtmTheoHsVaNgay(pvtm, maHs, taiNgay)` khớp chính xác mã HS 8 số hoặc tiền tố 4/6 số và đối chiếu theo `tai_ngay` (`YYYY-MM-DD`):
- Khi không truyền `tai_ngay`: trả các vụ việc đang hiệu lực hoặc đang điều tra (`trang_thai !== "HET_HIEU_LUC"`).
- Khi truyền `tai_ngay`: trả mọi vụ việc có `hieu_luc_tu <= tai_ngay` và chưa tới `het_hieu_luc_tu` (bao gồm cả việc tái hiện chính xác các biện pháp PVTM lịch sử từng có hiệu lực tại ngày đăng ký tờ khai quá khứ).
- Công cụ MCP `plhq_chinh_sach_theo_hs` tự động đính trường `phong_ve_thuong_mai` vào `structuredContent` và hiển thị khối **Cảnh báo Phòng vệ thương mại (`pvtm@1`)** trong văn bản trả về cho `ozplugin` / AI Agent.
