# BÁO CÁO ĐỌC CHUYÊN SÂU 12/2022/TT-BGTVT (KHẢO SÁT LẠI)

**Ngày khảo sát:** 2026-10-15  
**Phương pháp:** Đọc YAML + tax.json + PDF 49/2026/TT-BXD + cạnh oz-wiki  
**MCP:** đã thử - list_prompts/list_resources trả rỗng, không có dữ liệu để dùng  
**HTTP API:** không chạy - dùng data local  

## 0. SỬA LẠI BÁO CÁO TRƯỚC

Trong báo cáo trước, em viết: "1.284 mã 12/2022 chưa có trong 49/2026". Sếp bảo "không đoán mò". Em khảo sát lại:

**Sai:** em so sánh 60 mã CSV (chưa mở rộng) với 1.315 mã 12/2022 → ra 1.284

**Đúng:** phải mở rộng PDF 49/2026 (mã 4-6 số) thành mã 8 số rồi so với 12/2022:
- 49/2026 PDF có 23 mã 4 số + 45 mã 6 số = 68 mã nhóm
- Mở rộng thành **1.195 mã 8 số** trong tax.json
- So với 12/2022 (1.315 mã):
  - **Chung: 1.144 mã (87%)**
  - **Chỉ 12: 171 mã** (chưa được thay thế bởi 49/2026)
  - **Chỉ 49: 51 mã** (mới được thêm)

→ Con số chính xác: **171 mã 12/2022 chưa được 49/2026 thay thế**, không phải 1.284.

## 1. THÔNG TIN VĂN BẢN (XÁC NHẬN TỪ YAML)
| Trường | Giá trị | Nguồn |
|---|---|---|
| Số hiệu | 12/2022/TT-BGTVT | YAML |
| Tên | DM SP, HH có khả năng gây mất an toàn - Bộ GTVT | YAML |
| Hiệu lực từ | 2022-08-15 | YAML hieu_luc_tu |
| **Hết hiệu lực từ** | **2026-07-01** | YAML het_hieu_luc_tu |
| **Tình trạng** | **HET_HIEU_LUC** | YAML tinh_trang |
| VB sửa đổi | 62/2024/TT-BGTVT (2025-02-15 → 2026-07-01) | YAML quan_he.sua_doi |
| **VB thay thế** | **49/2026/TT-BXD** | YAML 49/2026 quan_he.bai_bo |
| Căn cứ bãi bỏ | Điều 6 khoản 3 điểm a (12/2022), b (62/2024) | YAML 49/2026 can_cu |

## 2. TRẠNG THÁI TRONG THƯ VIỆN (XÁC NHẬN)
| Hạng mục | Giá trị | Nguồn |
|---|---|---|
| File YAML | ✓ Có (1.416 bytes) | `registry/van-ban/12-2022-tt-bgtvt.yaml` |
| File CSV (danh-muc) | ✗ KHÔNG CÓ | kiểm tra `danh-muc/` |
| Cạnh trong wiki | **0** / 1.315 mã | hs-index-theo-ma.json |
| Cạnh 62/2024 | **0** | hs-index-theo-ma.json |
| Cạnh 49/2026 | **64** | hs-index-theo-ma.json |
| Wiki page (`wiki/sources/`) | ✗ KHÔNG CÓ | kiểm tra |
| File toàn văn | PDF datafiles (ảnh, không lớp chữ) | `raw/download/datafiles.chinhphu.vn/` |

## 3. TÌNH TRẠNG TRONG TAX.JSON (XÁC NHẬN)
| Hạng mục | Giá trị |
|---|---|
| Mã có 12/2022/TT-BGTVT | **1315** |
| Mã có 62/2024/TT-BGTVT | **1315** |
| Mã có 49/2026/TT-BXD | **0** (CHƯA CẬP NHẬT) |
| Tỷ lệ so với tổng biểu thuế | 11.1% |

## 4. SO SÁNH 12/2022 vs 49/2026 (ĐÃ MỞ RỘNG)
| Hạng mục | Số mã |
|---|---|
| 12/2022/TT-BGTVT (tax.cs) | 1315 |
| 49/2026/TT-BXD (PDF mở rộng) | 1195 |
| **Chung (12 ∩ 49)** | **1144 (87%)** |
| **Chỉ 12 (chưa thay thế)** | **171** |
| Chỉ 49 (mới thêm) | 51 |

## 5. PHÂN TÍCH 171 MÃ CHỈ CÓ 12/2022 (CHƯA THAY THẾ)
Các VB khác cũng nhắc 171 mã này:

| Văn bản | Số mã nhắc |
|---|---|
| 42/2019/TT-BCT | 120 |
| 33/2025/TT-BCT | 99 |
| 08/2023/TT-BCT | 42 |
| 34/2025/TT-BCT | 21 |
| 01/2024/TT-BNNPTNT | 13 |
| 366/QĐ-BKHCN | 6 |
| 23/2019/QĐ-TTg | 6 |
| 17/2023/TT-BNNPTNT | 2 |
| 765/QĐ-BCT | 2 |
| 173/2018/TT-BQP | 1 |

**Quan trọng:** 171 mã này có các VB khác nhắc (23/2019/QĐ-TTg, 42/2019/TT-BCT...) - vẫn có căn cứ pháp lý để áp dụng.

## 6. ĐÁNH GIÁ HƯỚNG XỬ LÝ ĐỀ XUẤT TRƯỚC (SỬA LẠI)

### Hướng xử lý A: Cập nhật tax.cs
- Báo cáo trước: "1.315 mã cần chuyển sang 49/2026"
- **Sửa lại: 1.144 mã chung** (chỉ cần cập nhật nếu thay thế) + **51 mã mới trong 49/2026** (cần thêm vào cs) + **171 mã chỉ có 12/2022** (giữ nguyên hoặc chỉnh sửa)
- Nên CẬP NHẬT nhưng cần review cẩn thận

### Hướng xử lý B: Trích bổ sung 49/2026
- Báo cáo trước: "PDF Công báo 20 trang cần trích"
- **Xác nhận: PDF có sẵn 860KB ở `raw/download/congbaocdn.chinhphu.vn/49-2026-tt-bxd.pdf`**
- CSV hiện 60 mã → mở rộng được 1.195 mã 8 số
- CẦN TRÍCH thêm 51 mã mới + cập nhật 1.144 mã chung

### Hướng xử lý C: Tạo cạnh lịch sử
- Báo cáo trước: "Tạo cạnh 12/2022 và 62/2024"
- **Xác nhận đúng:** 0 cạnh cho 12/2022 và 62/2024, cần tạo

## 7. KẾT LUẬN ĐÃ SỬA

| Phát biểu trước | Trạng thái |
|---|---|
| 12/2022 hết hiệu lực từ 01/07/2026 | ✓ ĐÚNG (xác nhận từ YAML) |
| 62/2024 cũng hết hiệu lực | ✓ ĐÚNG (xác nhận từ YAML) |
| 49/2026/TT-BXD thay thế | ✓ ĐÚNG (xác nhận từ YAML quan_he.bai_bo) |
| tax.cs vẫn nhắc 12/2022 (1.315 mã) | ✓ ĐÚNG (xác nhận từ tax.json) |
| tax.cs KHÔNG nhắc 49/2026 | ✓ ĐÚNG (0 mã) |
| Wiki có 0 cạnh cho 12/2022 | ✓ ĐÚNG (xác nhận từ hs-index) |
| 1.284 mã chưa thay thế | ✗ **SAI - thực tế 171 mã** (sau khi mở rộng PDF) |
| 60 mã 49/2026 trong CSV | ✓ ĐÚNG (xác nhận) |
| 49/2026 có thể mở rộng thành 1.195 mã | ✓ ĐÚNG (phát hiện mới từ PDF) |

### Bài học:
1. Khi so sánh 2 DM mã HS, PHẢI mở rộng mã nhóm (4-6 số) thành mã chi tiết (8 số) trước
2. PDF dùng format "XXXX.XX" hoặc "XXXX" (mã nhóm), không phải mã 8 số
3. Sếp đúng - cần verify từng con số trong repo, không đoán
