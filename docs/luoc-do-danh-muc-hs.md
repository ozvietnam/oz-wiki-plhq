# Lược đồ bảng danh mục mã HS (`danh-muc/*.csv`)

Lớp thứ hai của thư viện, sau "văn bản còn hiệu lực không": **mã HS nào chịu văn bản nào**.

Nhiều văn bản quản lý hàng hoá có phụ lục liệt kê mã HS. Ví dụ là danh mục kiểm tra chuyên ngành 2026 của
các bộ, danh mục cấm, danh mục giấy phép và quyết định phòng vệ thương mại. Trích đúng bảng phụ lục ra là
có ngay quan hệ mã ↔ văn bản cho hàng nghìn mã. Không cần dò từng mã trong biểu thuế.

## Ba tầng ảnh hưởng

| Tầng | Văn bản | Lưu ở đâu | Độ tin |
|---|---|---|---|
| 1. Trực tiếp có mã HS | Danh mục kèm mã HS (KTCN, cấm, giấy phép, phòng vệ thương mại, biểu thuế) | `danh-muc/<slug>.csv` (tài liệu này) | Cao: trích nguyên văn phụ lục |
| 2. Theo mô tả, không ghi mã | "hàng đã qua sử dụng", "pin lithium"… | Chưa làm, làm sau tầng 1 | Vừa: suy ra, phải ghi rõ |
| 3. Đề cập, hướng dẫn | Thông báo phân loại, công văn | Chưa làm | Tham khảo |

## Tệp bảng

Mỗi văn bản có một tệp `danh-muc/<slug>.csv`, với `<slug>` trùng tên tệp YAML trong `registry/van-ban/`.
Tệp mã hoá UTF-8, có dòng tiêu đề, dùng dấu phẩy và ngoặc kép theo RFC 4180. Các cột theo đúng thứ tự:

| Cột | Bắt buộc | Nội dung |
|---|---|---|
| `ma_hs` | có, trừ dòng dẫn chiếu | 4, 6 hoặc 8 chữ số, **không dấu chấm**. Ô in nhiều mã thì tách mỗi mã một dòng, giữ nguyên `mo_ta` |
| `mo_ta` | có | Mô tả hàng **nguyên văn** trong phụ lục (gom khoảng trắng, tối đa ~300 ký tự) |
| `nhom` | | Số thứ tự hoặc nhóm như in trong phụ lục (`I.2`, `3`, `Chương 22`) |
| `phu_luc` | | `Phụ lục I`, `Phụ lục II`…; phụ lục không đánh số thì ghi `Phụ lục` |
| `loai_tac_dong` | có | `KIEM_TRA_ATTP`, `KIEM_TRA_CHAT_LUONG`, `KIEM_DICH_DONG_VAT`, `KIEM_DICH_THUC_VAT`, `GIAY_PHEP`, `CAM_NHAP_KHAU`, `CAM_XUAT_KHAU`, `CONG_BO_HOP_QUY`, `DANG_KY_LUU_HANH`, `PHONG_VE_THUONG_MAI`, `KHAC` |
| `muc_rui_ro` | | `CAO`, `TRUNG_BINH`, `THAP`, nếu phụ lục ghi (khung NĐ 37/2026) |
| `dieu_kien` | | Giới hạn phạm vi in kèm dòng, ví dụ "trừ loại…", "chỉ áp dụng với…", ký hiệu "ex". Để trống nghĩa là **toàn bộ** mã |
| `dan_chieu` | | Số hiệu văn bản khác chứa mã HS khi dòng **không ghi mã** mà dẫn sang. Ví dụ: 27/2026/TT-BYT ghi "Mã HS: theo 15/2024/TT-BYT" |
| `trang` | | Số trang (bắt đầu từ 1) trong bản PDF ghi ở `danh_muc_hs.nguon` |

Mã 4 hoặc 6 số áp cho mọi dòng thuế 8 số bắt đầu bằng mã đó, trừ khi `dieu_kien` thu hẹp lại.
**Không tự bung ra 8 số.** Ứng dụng tự khớp theo tiền tố, và phải hiện `dieu_kien` cho người khai.

## Khai trong sổ

Thêm trường `danh_muc_hs` vào YAML của văn bản:

```yaml
danh_muc_hs:
  tep: danh-muc/28-2026-tt-bct.csv
  nguon: https://congbaocdn.chinhphu.vn/...pdf   # bản CÓ phụ lục đã dùng để trích (ưu tiên Công báo có lớp chữ)
  trich_boi: cursor-agent@ozvietnam
  ngay: '2026-10-04'
  da_doi_chieu: false   # true khi người/agent thứ hai đã soát từng dòng với bản gốc
  ghi_chu: phụ lục từ trang 5; 3 ô gộp đã tách
```

## Cách làm một bảng

1. **Tìm bản có phụ lục.** Bản trên datafiles.chinhphu.vn thường chỉ có phần chính, hoặc là ảnh quét.
   Bản Công báo thì có cả phụ lục và có lớp chữ:
   - trang Công báo tra theo số ID: `https://congbao.chinhphu.vn/van-ban/x-<id>.htm` tự chuyển tới trang thật;
   - PDF nằm trên `congbaocdn.chinhphu.vn`.
2. **Trích bảng bằng máy** từ lớp chữ. Không gõ lại, không đoán mã. Bản chỉ có ảnh quét thì ghi vào
   `ghi_chu` và để lại cho người hoặc agent có OCR.
3. **Kiểm:**
   - `npm test` kiểm định dạng; sai thì chặn PR.
   - `npm run diem-mu` đối chiếu từng mã với biểu thuế trong `nhu-cau/bieu-thue.json`, là bản chụp từ
     hs-code-api. Mã không tồn tại sẽ hiện thành điểm mù `HS_KHONG_TON_TAI`.
4. **Ghi vào PR:**
   - URL bản đã dùng và trang bắt đầu phụ lục;
   - số dòng và số mã;
   - 10 dòng mẫu đặt cạnh nguyên văn trích ra;
   - các ô gộp hoặc chú thích đã xử lý thế nào.

## Điểm mù liên quan (`tools/diem-mu.mjs`)

| Mã | Ý nghĩa |
|---|---|
| `DANH_MUC_CHUA_TRICH` | Văn bản danh mục (tên có "danh mục", thuộc nhánh KTCN, ngoại thương hoặc phòng vệ thương mại) chưa có bảng. Mức Cao nếu là danh mục KTCN có hiệu lực từ 01/7/2026 trở đi, hoặc được biểu thuế dẫn từ 50 mã |
| `HS_KHONG_TON_TAI` | Mã trong bảng không có trong biểu thuế: lỗi trích, mã của biểu thuế cũ, hoặc bản chụp biểu thuế chưa cập nhật |
| `DAN_CHIEU_CHUA_CO_BANG` | Bảng dẫn mã sang văn bản chưa có bảng, hoặc văn bản chưa có trong sổ |

## Dùng ở đâu

`npm run dung` xuất `dist/hs-index.json`, gồm mỗi văn bản kèm tình trạng hiệu lực và các dòng bảng.
[hs-code-api](https://github.com/ozvietnam/hs-code-api) đồng bộ tệp này, và `/api/tax?hs=…` trả về danh sách
văn bản danh mục chứa mã đó, kèm `dieu_kien` và mức khớp: đúng 8 số hay theo nhóm 4 hoặc 6 số.
