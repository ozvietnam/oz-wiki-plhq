# Lược đồ sổ đăng ký văn bản

Mỗi văn bản là một tệp `registry/van-ban/<slug>.yaml`. Slug sinh từ số hiệu: chữ thường, bỏ dấu,
`/` → `-` (`08/2015/NĐ-CP` → `08-2015-nd-cp`); số hiệu không có năm (quyết định của bộ) thì thêm năm
ban hành (`1182/QĐ-BCT` → `1182-qd-bct-2021`). Tạo nhanh: `node tools/them-van-ban.mjs "<số hiệu>"`.

```yaml
so_hieu: 28/2026/TT-BCT          # bắt buộc — đúng như in trên văn bản
so_hieu_khac: []                 # tuỳ chọn — cách viết sai/biến thể hay gặp (vd lỗi gõ trong biểu thuế), để máy khác tra được
loai: THONG_TU                   # bắt buộc — xem danh sách dưới
loai_phan_loai: XAC_DINH_TRUOC   # tuỳ chọn — chỉ TB-TCHQ: XAC_DINH_TRUOC | KIEM_TRA_XAC_DINH_LAI | DINH_CHINH | CHUA_XAC_DINH
loai_phan_loai_can_cu: title_xac_dinh_truoc   # tuỳ chọn — căn cứ phân loại (không bịa; xem docs/luong-tb-tchq.md)
loai_phan_loai_ngay: 2026-10-14  # tuỳ chọn — ngày gắn loại
ten: "Danh mục ..."              # bắt buộc — nguyên văn trích yếu
co_quan: BCT                     # ký hiệu trong registry/co-quan.yaml
ngay_ban_hanh: 2026-06-01
hieu_luc_tu: 2026-07-17
het_hieu_luc_tu: 2027-01-01      # khi đã biết ngày hết hiệu lực (kể cả ngày trong tương lai)
tinh_trang: CON_HIEU_LUC         # bắt buộc — xem danh sách dưới
nhanh: [kiem-tra-chuyen-nganh/bct, kiem-tra-chuyen-nganh/an-toan-thuc-pham]   # nút trong cay-xnk.yaml
quan_he:                         # CHỈ ghi chiều đi: văn bản này tác động lên văn bản nào
  thay_the: [11/2022/TT-BCT]
  sua_doi: []
  bai_bo:
    - { so_hieu: 154/2018/NĐ-CP, pham_vi: "Điều 4", tu_ngay: 2026-07-01, can_cu: "Điều 97 khoản 2 điểm c" }
  tam_ngung: []
  huong_dan: [15/2018/NĐ-CP]     # văn bản gốc mà văn bản này quy định chi tiết / hướng dẫn
  hop_nhat: []                   # với văn bản hợp nhất (VBHN)
nguon:
  - { url: "https://congbao.chinhphu.vn/...", truy_cap: 2026-10-04 }
toan_van: raw/download/congbao.chinhphu.vn/28-2026-tt-bct.pdf
trich_dan_trong_bieu_thue: 249   # số mã HS trong biểu thuế dẫn văn bản này (nếu biết)
phu_luc_cua: 49/2026/TT-BXD      # tuỳ chọn — phụ lục tách riêng: số hiệu văn bản mẹ đã có danh_muc_hs (KHÔNG tạo CSV riêng)
danh_muc_thay_boi: 10/2022/TT-BTTTT   # tuỳ chọn — phụ lục danh mục đã bị văn bản khác thay toàn bộ (văn bản thay đã có danh_muc_hs thì không báo DANH_MUC_CHUA_TRICH)
danh_muc_khong_ma_hs: "Phụ lục chỉ quy định theo mô tả / mã CAS, không gắn mã HS..."   # tuỳ chọn — bản gốc bậc A không gắn mã HS (bắt buộc xac_minh.muc: NGUON_A, không khai cùng danh_muc_hs)
xac_minh:
  muc: NGUON_A                   # NGUON_A | NGUON_B | NGUON_THU_CAP | CHUA_XAC_MINH
  pham_vi: "số hiệu, tiêu đề, ngày"   # đã đối chiếu những gì
  hieu_luc_da_doi_chieu: true    # CHỈ true khi đã xem tình trạng hiệu lực trên nguồn bậc A
  ngay: 2026-10-04
  boi: ten-nguoi-hoac-agent
  canh_bao: "..."                # tuỳ chọn — nghi vấn về nguồn
  chan:                          # tuỳ chọn — tạm dừng săn đối chiếu (không săn lặp)
    ma: THIEU_PDF_A              # THIEU_PDF_A | THIEU_DIEU_THI_HANH_A | THIEU_BAI_TUONG_MINH | SO_HIEU_LECH | CHO_CONG_BO_A
    ngay: 2026-10-04             # ngày kết luận chặn
    viec_tiep: "Chờ PVTM đăng PDF; săn lại khi có tin mới"
  dieu_khoan:                    # tuỳ chọn — điều khoản nguyên văn bậc A ({ dieu >= 1, noi_dung, khoan?, diem?, trang_pdf?, sha256_pdf? })
    - dieu: 4
      khoan: 1
      noi_dung: "Một mặt hàng có một mã số duy nhất..."
  nguon_rieng_tu:                # tuỳ chọn — nguồn bản quyền do bên thứ ba (hs-code-api) giữ riêng, không nạp vào kho công khai
    wco_compendium: "hs-code-api (xử lý nội bộ, không nạp công khai)"
ghi_chu: "..."
tu_khoa: [banh-keo, attp]        # tuỳ chọn
```

**`xac_minh.chan`:** khi đã săn hết đường nguồn A khả thi mà vẫn chưa đặt `hieu_luc_da_doi_chieu: true`,
ghi chặn để điểm mù chuyển sang `HS_API_CHO_MO_CHAN` (Thấp) thay vì giữ `HS_API_UU_TIEN_DOI_CHIEU` (Cao).
Chạy `node tools/san-hieu-luc.mjs` để xem hàng đợi còn làm được. Xóa `chan` khi đã đối chiếu xong.

**`xac_minh.dieu_khoan`:** danh sách điều khoản có cấu trúc trích nguyên văn từ nguồn bậc A (ví dụ trong
`registry/van-ban/85-2026-tt-btc.yaml`, `19-2026-qh16.yaml`). Mỗi phần tử là object bắt buộc có `dieu`
(số nguyên `>= 1`) và `noi_dung` (chuỗi không rỗng), có thể kèm `khoan`, `diem`, `trang_pdf`, `sha256_pdf`;
`tools/kiem-tra.mjs` kiểm định dạng. Từ `1.5.0`, các điều khoản này được xuất vào tầng `NGUYEN_VAN_NGUON_A`
của `dist/dieu-khoan.json`.

**`xac_minh.nguon_rieng_tu`:** map `{ key: mô_tả }` (mỗi giá trị là chuỗi mô tả không rỗng; ví dụ
`wco_compendium`, `ahtn_sen` ở `85-2026-tt-btc.yaml`) đánh dấu tài liệu tham chiếu có bản quyền do
`hs-code-api` giữ riêng tư, không nạp vào kho công khai. Khi có khoá tương ứng, `tools/diem-mu.mjs` bỏ qua
điểm mù `THIEU_NGUON_WCO_COMPENDIUM` / `THIEU_NGUON_AHTN` (xem [SO-DO-HE-THONG.md](SO-DO-HE-THONG.md)).

**`loai`:** `HIEN_PHAP`, `LUAT`, `NGHI_QUYET`, `PHAP_LENH`, `NGHI_DINH`, `QUYET_DINH`, `THONG_TU`,
`THONG_TU_LIEN_TICH`, `CHI_THI`, `CONG_VAN`, `THONG_BAO`, `VAN_BAN_HOP_NHAT`, `DIEU_UOC`, `TIEU_CHUAN`, `KHAC`.

**`tinh_trang`:** `CON_HIEU_LUC`, `HET_HIEU_LUC`, `HET_HIEU_LUC_MOT_PHAN`, `TAM_NGUNG_HIEU_LUC`,
`CHUA_CO_HIEU_LUC`, `CHUA_XAC_MINH`.

**Quan hệ ngược** (`bi_thay_the_boi`, `bi_sua_doi_boi`, `bi_bai_bo_boi`, `bi_tam_ngung_boi`,
`duoc_huong_dan_boi`, `duoc_hop_nhat_boi`) **không ghi tay** — `tools/dung.mjs` tính và ghi vào
`dist/registry.json`.

**Kiểm tra tự động** (`node tools/kiem-tra.mjs`, chặn PR khi lỗi): trường bắt buộc, giá trị hợp lệ,
ngày đúng dạng và hợp lý so với tình trạng, nhánh có trong cây, cơ quan có trong danh sách, không trùng
số hiệu, không chu trình thay thế, `NGUON_A` / `hieu_luc_da_doi_chieu: true` phải có nguồn bậc A.

## Lịch sử lược đồ (tệp máy)

`dist/*.json` mang `luoc_do_phien_ban` (semver, mọi tệp máy dùng chung một hằng
số `LUOC_DO_PHIEN_BAN` trong `tools/lib/registry.mjs`); `phien_ban` vẫn là ngày dựng. Bên đọc so **major**: lệch major thì từ
chối bản chụp và báo lỗi, thay vì trả sai tình trạng hiệu lực. Quy ước:

- Đổi **phá vỡ** — đổi tên/xoá trường, đổi nghĩa hoặc kiểu giá trị, đổi tên giá trị liệt kê
  (`tinh_trang`, `loai`…) — thì tăng **major**.
- Thêm trường mới hoặc giá trị liệt kê mới, không phá bên đọc — tăng **minor**. Giá trị liệt kê mới luôn
  được ghi dòng dưới đây để bên ánh xạ nhãn kịp cập nhật.

| Phiên bản | Ngày | Đổi gì |
|---|---|---|
| 1.0.0 | 2026-10-13 | Phiên bản đầu: cấu trúc như hiện tại; thêm `luoc_do_phien_ban` vào hai tệp máy (yêu cầu tích hợp [docs/yeu-cau/ozplugin.md](yeu-cau/ozplugin.md) W1) |
| 1.1.0 | 2026-10-13 | Thêm tệp mới `dist/hs-index-theo-ma.json` (nhóm mã HS → văn bản, đảo chiều của `hs-index.json`); cấu trúc hai tệp cũ không đổi — minor theo quy ước W1 |
| 1.2.0 | 2026-10-13 | `hs-index-theo-ma.json`: thêm `bieu_thue_doi_chieu` + `canh_bao_ma` (nhóm mã ngoài biểu thuế), `tien_le_tb_tchq` (mật độ TB-TCHQ theo mã 8 số / nhóm 4 số), `tong_canh`; gộp cạnh trùng toàn trường (13.543 → 9.900) |
| 1.3.0 | 2026-10-14 | Thêm trường tuỳ chọn TB-TCHQ: `loai_phan_loai` / `loai_phan_loai_can_cu` / `loai_phan_loai_ngay` (3 nhóm nghiệp vụ + `CHUA_XAC_DINH`). Không đổi trường bắt buộc — minor |
| 1.4.0 | 2026-11-14 | Thêm trường tuỳ chọn `phu_luc_cua` (số hiệu văn bản mẹ): phụ lục tách riêng không tạo điểm mù `DANH_MUC_CHUA_TRICH` khi mẹ đã có bảng CSV. Không đổi trường bắt buộc — minor |
| 1.5.0 | 2026-11-21 | Mở rộng gói máy cho Cổng MCP hỏi đáp PLHQ: thêm 4 tệp mới `dist/wiki-index.json`, `dist/wiki-chunks.json`, `dist/dieu-khoan.json` (tách tầng `NGUYEN_VAN_NGUON_A` vs `TOM_TAT_NHAP`), `dist/cas-index.json` (từ `danh-muc/*-cas.csv`); giữ nguyên cấu trúc 3 tệp cũ — minor |
