# BÁO CÁO ĐỌC CHUYÊN SÂU: 12/2022/TT-BGTVT
## DM hàng hóa có khả năng gây mất an toàn thuộc Bộ GTVT

**Ngày:** 2026-10-15  
**Nguồn:** `oz-wiki-plhq/registry/van-ban/12-2022-tt-bgtvt.yaml` + `tax.json` (hs-code-api) + `dist/hs-index-theo-ma.json`  
**MCP đã gọi:** `mcp__customs__list_prompts`, `mcp__customs__list_resources` (kết quả: rỗng)  
**HTTP API:** KHÔNG khả dụng (server không chạy) → dùng data local  
**Tác giả:** Hermes (Sếp Thắng)  

## 1. THÔNG TIN VĂN BẢN
| Trường | Giá trị |
|---|---|
| Số hiệu | 12/2022/TT-BGTVT |
| Tên | DM SP, HH có khả năng gây mất an toàn thuộc Bộ GTVT |
| Loại | Thông tư |
| Cơ quan | BGTVT |
| Ngày ban hành | 30/06/2022 |
| Hiệu lực từ | 15/08/2022 |
| **Hết hiệu lực từ** | **01/07/2026** |
| **Tình trạng** | **HET_HIEU_LUC** |
| Mức xác minh | NGUON_A |
| Trích dẫn trong biểu thuế | 1.315 mã |
| VB sửa đổi | 62/2024/TT-BGTVT (15/02/2025 → 01/07/2026) |
| **VB thay thế** | **49/2026/TT-BXD** (hiệu lực 01/07/2026) |

## 2. TRẠNG THÁI TRONG THƯ VIỆN
| Hạng mục | Giá trị |
|---|---|
| File YAML | ✓ Có (1.416 bytes) |
| File CSV (danh-muc) | ✗ KHÔNG CÓ |
| Cạnh trong hs-index-theo-ma | 0 / 1.315 mã (0%) |
| Cạnh trong hs-code-api | 0 |
| Wiki page (`wiki/sources/`) | ✗ KHÔNG CÓ |
| File toàn văn | ✓ PDF datafiles chinhphu.vn (ảnh, không lớp chữ) |

## 3. TÌNH TRẠNG TRONG TAX.JSON (hs-code-api)
| Hạng mục | Giá trị |
|---|---|
| Tổng mã HS có trong cột `cs` | 1315 |
| Tỷ lệ so với tổng biểu thuế | 11.1% |
| Top 5 chương | Ch.87 (922), Ch.84 (106), Ch.85 (101), Ch.73 (78), Ch.89 (50) |

## 4. TOP 15 NHÓM 4 SỐ CÓ MÃ TRONG 12/2022/TT-BGTVT
| Nhóm 4s | Số mã | Tên nhóm |
|---|---|---|
| 8703 | 473 | Ô tô con |
| 8704 | 237 | Ô tô vận tải |
| 8702 | 76 | Ô tô khách (10 người trở lên) |
| 8501 | 61 | Động cơ điện |
| 8711 | 44 | Mô tô, xe gắn máy |
| 7306 | 38 | Ống thép khác |
| 8507 | 36 | Acquy điện |
| 8708 | 36 | Phụ tùng ô tô |
| 7304 | 29 | Ống, ống dẫn, profile rỗng |
| 8407 | 29 | Động cơ đốt trong piston |
| 8701 | 25 | Xe kéo |
| 8479 | 24 | Máy và thiết bị cơ khí có chức năng riêng |
| 8901 | 24 | Tàu thuyền |
| 4421 | 21 | Đồ gỗ khác |
| 8428 | 18 | Máy nâng, hạ, xếp, dỡ khác |

## 5. TÌNH TRẠNG VB THAY THẾ 49/2026/TT-BXD
| Hạng mục | Giá trị |
|---|---|
| Tên | DM SP, HH có mức độ rủi ro trung bình, cao lĩnh vực GTVT thuộc Bộ Xây dựng |
| Hiệu lực từ | 01/07/2026 |
| Bãi bỏ | 12/2022/TT-BGTVT, 62/2024/TT-BGTVT, 71/2025/TT-BXD (1 phần) |
| Số mã trích được (CSV) | 60 mã |
| Số mã 12/2022 | 1.315 mã |
| Mã 49/2026 ⊂ 12/2022 | 31 mã |
| **Mã 12/2022 chưa có trong 49/2026** | **1.284 mã** |
| Số nhóm 4s của 12/2022 | 44 |

## 6. ẢNH HƯỞNG ĐẾN NGƯỜI DÙNG CUỐI
**Đã trôi qua: 106 ngày kể từ khi VB hết hiệu lực (01/07/2026)**

### Tác động:
1. **DN tra cứu API `hs-kb.uythacnhapkhau.com`** thấy cột `cs` nhắc 12/2022/TT-BGTVT nhưng:
   - Click để xem chi tiết → KHÔNG CÓ dữ liệu
   - Không biết VB nào đang thay thế (49/2026/TT-BXD)
   - Có thể nhầm lẫn áp dụng VB đã hết hiệu lực

2. **DN đọc biểu thuế VN (EN2022)**:
   - 1.315 mã ô tô/phụ tùng/thiết bị GTVT có cột cs nhắc VB HẾT HIỆU LỰC
   - Không rõ quy định hiện hành
   - Nguy cơ từ chối hồ sơ khi NK do áp sai VB

3. **Tổng mã bị ảnh hưởng: 1.315 mã HS, 44 nhóm 4s**
   - Chủ yếu: ô tô, mô tô, xe máy, phụ tùng, thiết bị GTVT
   - Mật độ cao nhất: 8703 (ô tô con - 473 mã), 8704 (ô tô vận tải - 237 mã)

## 7. NGUYÊN NHÂN SÂU XA
1. **Wiki chưa trích 12/2022/TT-BGTVT** → không có cạnh
2. **Wiki chưa trích 62/2024/TT-BGTVT** → không có cạnh
3. **49/2026/TT-BXD CSV chỉ 60 mã** → không đủ để thay thế 1.315 mã
4. **tax.cs (hs-code-api) cập nhật từ datafiles 12/2022 cũ** → không cập nhật sang 49/2026
5. **Không có workflow tự động** khi VB bị bãi bỏ → cột cs vẫn giữ VB cũ

## 8. HƯỚNG XỬ LÝ ĐỀ XUẤT

### Phương án A: CẬP NHẬT TAX.CS (ƯU TIÊN CAO)
- **Công việc**: 1.315 mã trong tax.cs → thay '12/2022/TT-BGTVT' → '49/2026/TT-BXD'
- **Yêu cầu**: Phân tích 49/2026 PL I + PL II để xác nhận phạm vi thay thế
- **Công cụ**: Edit tax.json hoặc dùng script
- **Ưu điểm**: Sửa 1 lần, áp dụng cho 1.315 mã
- **Nhược điểm**: Cần xác nhận 49/2026 thực sự thay thế 100%

### Phương án B: TRÍCH BỔ SUNG 49/2026/TT-BXD
- **Công việc**: Đọc 49/2026/TT-BXD PDF Công báo (20 trang) → trích đầy đủ 2 phụ lục
- **Công cụ**: PDF reader + script trích → cập nhật `danh-muc/49-2026-tt-bxd.csv`
- **Ưu điểm**: Có đầy đủ dữ liệu để xây dựng cạnh
- **Nhược điểm**: Tốn thời gian đọc PDF

### Phương án C: TẠO CẠNH LỊCH SỬ CHO 12/2022 + 62/2024
- **Công việc**: Tạo cạnh cho 12/2022 và 62/2024 với ghi chú 'HẾT HIỆU LỰC từ 01/07/2026'
- **Công cụ**: oz-wiki tools + dữ liệu từ YAML
- **Ưu điểm**: Bảo toàn lịch sử, tra cứu được VB cũ
- **Nhược điểm**: Không giải quyết vấn đề VB thay thế

### Đề xuất cuối: KẾT HỢP A + B + C
1. **Ngay**: Tạo cạnh lịch sử (Phương án C) - 30 phút
2. **Tuần này**: Trích bổ sung 49/2026 PL I + PL II (Phương án B) - 2-4 giờ
3. **Tuần sau**: Cập nhật tax.cs sau khi có dữ liệu 49/2026 đầy đủ (Phương án A) - 1 giờ

## 9. KIẾN NGHỊ CẢI THIỆN HỆ THỐNG
1. **Thêm workflow tự động**: Khi VB bị bãi bỏ → tự động kiểm tra cột cs → cập nhật
2. **Trích bắt buộc**: VB có `trich_dan_trong_bieu_thue > 0` PHẢI có CSV/cạnh
3. **Linter cảnh báo**: cạnh của VB `HET_HIEU_LUC` → flag 'LỊCH SỬ - tham khảo'
4. **Đối chiếu định kỳ**: Cron job hàng tuần kiểm tra tax.cs vs danh sách VB hiệu lực

## 10. KẾT LUẬN
- 12/2022/TT-BGTVT: VB RẤT CAO (1.315 mã), HẾT HIỆU LỰC, CHƯA có cạnh wiki
- Đã bị thay thế bởi 49/2026/TT-BXD nhưng tax.cs chưa cập nhật
- DN NK gặp khó khăn khi tra cứu quy định hiện hành
- Cần ưu tiên: Trích 49/2026 đầy đủ → cập nhật tax.cs → tạo cạnh wiki