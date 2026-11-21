---
id: phu-gia-thuc-pham-ins
title: "Phụ gia thực phẩm theo mã INS"
type: concept
created: 2026-10-09
updated: 2026-11-21
key_sources:
  - 15-2024-tt-byt
related_concepts:
  - ktcl-byt-attp-2024
  - vat-lieu-bao-bi-tiep-xuc-thuc-pham
confidence: high
tags:
  - byt
  - phu-gia
  - ins
  - attp
---

## Definition

**Phụ gia thực phẩm (Food Additives)** - chất được thêm vào thực phẩm để cải thiện mùi vị, màu sắc, hình thức, bảo quản. Danh mục hàng hóa xác định mã HS phục vụ kiểm tra nhà nước về an toàn thực phẩm (ATTP) nhập khẩu thuộc phạm vi quản lý của Bộ Y tế hiện thực hiện theo **[[sources/15-2024-tt-byt|Thông tư 15/2024/TT-BYT]]** (`CON_HIEU_LUC` từ `02/11/2024`, `NGUON_A`), với Nhóm II là Phụ gia thực phẩm đơn chất theo hệ thống mã **INS (International Numbering System)** (~391 dòng, mã INS `100–957`).

## Hệ thống mã INS

INS là hệ thống đánh số quốc tế phụ gia thực phẩm do **JECFA** (Ủy ban Chuyên gia FAO/WHO) quản lý.

### Phân nhóm theo chức năng
- **INS 100-199**: Phẩm màu
- **INS 200-299**: Chất bảo quản
- **INS 300-399**: Chất chống oxy hóa, chất giữ màu
- **INS 400-499**: Chất làm đặc, tạo gel, nhũ hóa
- **INS 500-599**: Điều chỉnh pH, chống đông vón
- **INS 600-699**: Tăng cường hương vị
- **INS 700-999**: Các loại khác

## Phụ gia phổ biến

| Mã INS | Tên | Công dụng |
|--------|-----|-----------|
| 100 | Curcumin | Màu vàng tự nhiên |
| 129 | Allura red AC | Màu đỏ tổng hợp |
| 200 | Acid sorbic | Bảo quản |
| 211 | Natri benzoat | Bảo quản nước uống |
| 300 | Acid ascorbic (Vitamin C) | Chống oxy hóa |
| 322 | Lecithin | Nhũ hóa |
| 330 | Acid citric | Điều chỉnh pH |
| 407 | Carrageenan | Tạo gel |
| 460 | Cellulose | Làm đặc |
| 504 | Magnesi carbonat | Chống đông vón |
| 621 | MSG (Monosodium glutamate) | Tăng hương vị |

## Thủ tục NK

1. **Đối chiếu Danh mục & mã HS** theo Phụ lục Nhóm II `15/2024/TT-BYT` (`danh-muc/15-2024-tt-byt.csv`):
   - Phụ gia thực phẩm hỗn hợp có từ 02 chất trở lên có tên trong Danh mục: xác định mã HS theo 6 quy tắc tổng quát ban hành kèm `31/2022/TT-BTC` (Điều 3 khoản 5 `15/2024/TT-BYT`).
   - Trường hợp có sự khác biệt trong phân loại HS: thực hiện theo pháp luật về hải quan (Điều 3 khoản 1 `15/2024/TT-BYT`).
   - Hàng có tên trong Danh mục nhưng không nhằm mục đích làm thực phẩm, phụ gia thực phẩm, chất hỗ trợ chế biến thực phẩm thì không thuộc đối tượng kiểm tra nhà nước về ATTP (Điều 3 khoản 4 điểm b `15/2024/TT-BYT`).
2. **Kiểm tra nhà nước về ATTP nhập khẩu** theo Điều 3 khoản 3 điểm a `15/2024/TT-BYT`, Điều 40 Luật ATTP `55/2010/QH12` và Điều 16 Nghị định `15/2018/NĐ-CP` (hiện vẫn áp dụng do `46/2026/NĐ-CP` đang `TAM_NGUNG_HIEU_LUC` theo `09/2026/NQ-CP` và `15/2026/NQ-CP`; trường hợp miễn thực hiện theo Điều 13 `15/2018/NĐ-CP` trừ khi có cảnh báo).
3. **Quy chuẩn kỹ thuật & nhãn/MSDS**: đáp ứng QCVN tương ứng (nếu có), ghi rõ tên phụ gia, mã INS và cung cấp tài liệu kỹ thuật/MSDS khi làm thủ tục.

## Quy chuẩn áp dụng tham khảo
- **QCVN 4-1:2010/BYT** (chất bảo quản)
- **QCVN 4-2:2010/BYT** (phẩm màu)
- **QCVN 4-5:2010/BYT** (chất điều vị)
- **QCVN 4-15:2012/BYT** (chất chống oxy hóa)
*(Lưu ý: các QCVN nhóm `QCVN 4-*` nêu trên chưa có hồ sơ kiểm hiệu lực riêng trong `registry/van-ban/` — cần đối chiếu nguồn bậc A trước khi trích dẫn làm căn cứ bắt buộc.)*

## Key sources

- [[sources/15-2024-tt-byt]] — Thông tư `15/2024/TT-BYT` (`CON_HIEU_LUC` từ `02/11/2024`, `NGUON_A`): văn bản hiện hành thay thế `28/2021/TT-BYT` (Điều 5 khoản 2), ban hành Danh mục phụ gia thực phẩm đơn chất (mã INS `100–957`) xác định mã HS phải kiểm tra nhà nước về ATTP nhập khẩu
- `15/2018/NĐ-CP` (`CON_HIEU_LUC` từ `02/02/2018`, `NGUON_A`) — quy định chi tiết Luật An toàn thực phẩm `55/2010/QH12` (căn cứ kiểm tra ATTP nhập khẩu tại Điều 3 khoản 3, 4 của `15/2024/TT-BYT`; tiếp tục áp dụng do `46/2026/NĐ-CP` tạm ngưng theo `09/2026/NQ-CP` và `15/2026/NQ-CP`)
- `31/2022/TT-BTC` (`CON_HIEU_LUC` từ `01/12/2022`, `NGUON_A`) — Danh mục hàng hóa XNK Việt Nam (viện dẫn tại Điều 1 và Điều 3 khoản 5 `15/2024/TT-BYT`)

## Related concepts

- [[concepts/ktcl-byt-attp-2024]] — tổng quan kiểm tra nhà nước ATTP thuộc Bộ Y tế (`15/2024/TT-BYT`, `27/2026/TT-BYT`)

## Notes

- **Chuỗi văn bản đã hết hiệu lực (lịch sử):** Thông tư `05/2018/TT-BYT` **đã hết hiệu lực từ `02/02/2022`** (bị bãi bỏ bởi Điều 4 khoản 2 Thông tư `28/2021/TT-BYT`), và Thông tư `28/2021/TT-BYT` cũng **đã hết hiệu lực từ `02/11/2024`** (bị thay thế bởi Điều 5 khoản 2 Thông tư `15/2024/TT-BYT`). Không còn dẫn `05/2018/TT-BYT` hay `28/2021/TT-BYT` cho phụ gia thực phẩm nhập khẩu hiện hành.
- **Lưu ý rà soát cũ:** Bản cũ từng liệt kê mục "Phụ gia BỊ CẤM tại VN" gồm `INS 102` (Tartrazin), nhưng đối chiếu trực tiếp bảng `danh-muc/15-2024-tt-byt.csv` (mục `II.5`, mã HS `32041900`) cho thấy `INS 102: Tartrazin` nằm trong Danh mục phụ gia thực phẩm kiểm tra ATTP kèm `15/2024/TT-BYT`. Giới hạn sử dụng từng phụ gia trong thực phẩm cần đối chiếu văn bản chuyên ngành quản lý sử dụng phụ gia thực phẩm của Bộ Y tế (chưa nạp vào `registry/van-ban/`).
- Cần kiểm tra mã INS cụ thể trong `danh-muc/15-2024-tt-byt.csv` và MSDS khi chuẩn bị hồ sơ nhập khẩu.
