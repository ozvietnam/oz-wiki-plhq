# Lược đồ sổ đăng ký văn bản

Mỗi văn bản là một tệp `registry/van-ban/<slug>.yaml`. Slug sinh từ số hiệu: chữ thường, bỏ dấu,
`/` → `-` (`08/2015/NĐ-CP` → `08-2015-nd-cp`); số hiệu không có năm (quyết định của bộ) thì thêm năm
ban hành (`1182/QĐ-BCT` → `1182-qd-bct-2021`). Tạo nhanh: `node tools/them-van-ban.mjs "<số hiệu>"`.

```yaml
so_hieu: 28/2026/TT-BCT          # bắt buộc — đúng như in trên văn bản
so_hieu_khac: []                 # tuỳ chọn — cách viết sai/biến thể hay gặp (vd lỗi gõ trong biểu thuế), để máy khác tra được
loai: THONG_TU                   # bắt buộc — xem danh sách dưới
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
ghi_chu: "..."
tu_khoa: [banh-keo, attp]        # tuỳ chọn
```

**`xac_minh.chan`:** khi đã săn hết đường nguồn A khả thi mà vẫn chưa đặt `hieu_luc_da_doi_chieu: true`,
ghi chặn để điểm mù chuyển sang `HS_API_CHO_MO_CHAN` (Thấp) thay vì giữ `HS_API_UU_TIEN_DOI_CHIEU` (Cao).
Chạy `node tools/san-hieu-luc.mjs` để xem hàng đợi còn làm được. Xóa `chan` khi đã đối chiếu xong.

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
