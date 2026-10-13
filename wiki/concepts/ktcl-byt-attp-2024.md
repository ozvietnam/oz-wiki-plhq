---
id: ktcl-byt-attp-2024
title: "Kiểm tra chất lượng BYT - ATTP (TT 15/2024)"
type: concept
created: 2026-10-09
updated: 2026-10-09
key_sources:
  - 15-2024-tt-byt
related_concepts:
  - phu-gia-thuc-pham-ins
  - vat-lieu-bao-bi-tiep-xuc-thuc-pham
confidence: high
tags:
  - byt
  - kiem-tra-chuyen-nganh
  - attp
  - an-toan-thuc-pham
---

## Definition

Quy trình kiểm tra nhà nước về **an toàn thực phẩm (ATTP)** nhập khẩu, theo TT 15/2024/TT-BYT. Quản lý bởi **Bộ Y tế (BYT)**.

## Variants

### Theo loại sản phẩm
- **Thực phẩm**: thực phẩm chế biến, thực phẩm bổ sung
- **Phụ gia thực phẩm**: chất bảo quản, phẩm màu, chất tạo ngọt, chất nhũ hóa
- **Dụng cụ chứa đựng**: chai, lọ, hộp
- **Vật liệu bao gói**: màng nhựa, bao bì kim loại

### Theo mức độ
- **Đăng ký** (TPCN mới): hồ sơ + chờ phê duyệt
- **Công bố hợp quy** (phụ gia, bao bì): tự công bố
- **Kiểm tra lô** (lô hàng lần đầu): lấy mẫu thử nghiệm

## Thủ tục NK

### Bước 1: Kiểm tra mã HS
- Mã HS phải có trong DM TT 15/2024
- Có ghi chú "phải kiểm tra ATTP"

### Bước 2: Chuẩn bị hồ sơ
- Giấy chứng nhận ATTP của nước xuất khẩu
- Kết quả thử nghiệm (mẫu đại diện)
- MSDS + thành phần
- Nhãn sản phẩm gốc

### Bước 3: Đăng ký kiểm tra
- Nộp tại **Cục ATTP** (BYT) hoặc Chi cục ATVSTP tỉnh
- Online: **Cổng thông tin ATTP quốc gia**

### Bước 4: Kiểm tra + cấp giấy
- Lấy mẫu thử nghiệm (nếu lô đầu)
- Cấp **Giấy chứng nhận ATTP** trong 7-15 ngày
- Thông quan

## Quy định riêng
- **TPCN**: cần đăng ký bản công bố (Điều 4 NĐ 15/2018)
- **Phụ gia mới**: cần đánh giá an toàn
- **Bao bì**: chứng nhận phù hợp QCVN 12-1, 12-2, 12-3

## Key sources

- [[sources/15-2024-tt-byt]] — VB chính
- **TT 05/2018/TT-BYT** — hướng dẫn ATTP
- **Luật ATTP 2010**

## Related concepts

- [[concepts/phu-gia-thuc-pham-ins]] — phụ gia
- [[concepts/vat-lieu-bao-bi-tiep-xuc-thuc-pham]] — bao bì

## Notes

- Tổng cộng **189 mã HS** thuộc KTCL BYT
- Thực phẩm từ TQ chiếm tỷ trọng lớn - thường bị kiểm tra
- Phụ gia INS - phải có MSDS tiếng Việt
- Bao bì nhựa, kim loại tiếp xúc TP - phải test di cư (migration)
- Thời gian kiểm tra: 7-15 ngày làm việc

## Playbook nhập hàng BYT (chuẩn hoá 13/10/2026) — chồng 2026 lên khung 2024

| # | Mục | Chi tiết | Căn cứ |
|---|---|---|---|
| 1 | Danh mục 2026 | **27/2026/TT-BYT** — thực phẩm, dụng cụ chứa đựng, vật liệu bao gói tiếp xúc ATTP (Cục An toàn thực phẩm; bảng CSV **chưa có mã HS** — tra theo tên nhóm + QCVN) · **24/2026/TT-BYT** — thiết bị y tế, xác định mức rủi ro + biện pháp quản lý (sửa 05/2022/TT-BYT, Điều 2) · **26/2026/TT-BYT** — dược liệu, thuốc cổ truyền (rủi ro trung bình) · **28/2026/TT-BYT** — thuốc hoá dược, dược liệu, vắc-xin, sinh phẩm (Cục Quản lý Dược) | Sổ 4 TT (đều CON_HIEU_LUC, đã đối chiếu nguồn A) |
| 2 | Khung ATTP | Kiểm tra ATTP khi nhập vẫn theo **NĐ 15/2018/NĐ-CP** (nghị định thay thế đang bị tạm ngưng) | [[concepts/kiem-tra-nha-nuoc-an-toan-thuc-pham]] |
| 3 | Chất lượng (phi ATTP) | Rủi ro trung bình → công bố hợp quy; cao → đăng ký kiểm tra | Điều 82 khoản 1, khoản 2 NĐ 37/2026/NĐ-CP (nguồn A) |
| 4 | Thời hạn (khung) | 01/07/05 ngày làm việc | Điều 83 khoản 1 điểm b NĐ 37/2026/NĐ-CP |
| 5 | Hạn chế dữ liệu | 3 bảng CSV BYT (24/26/27/28) chưa mang mã HS — tra cứu theo mã HS tạm thời **không** trả diện BYT; cần đối chiếu theo tên nhóm hàng | `danh-muc/*.csv` + điểm mù |

Nghĩa vụ theo mức rủi ro (nguồn A): [[concepts/muc-do-rui-ro-hang-hoa]].
