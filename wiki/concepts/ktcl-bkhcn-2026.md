---
id: ktcl-bkhcn-2026
title: "Kiểm tra chất lượng BKHCN (TT 36/2026)"
type: concept
created: 2026-10-09
updated: 2026-10-09
key_sources:
  - 36-2026-tt-bkhcn
  - 36-2026-tt-bkhcn-pl1
  - 36-2026-tt-bkhcn-pl2
related_concepts:
  - rui-ro-cao-vs-trung-binh
confidence: high
tags:
  - bkhcn
  - kiem-tra-chuyen-nganh
  - ktcl
  - qcvn
---

## Definition

Quy trình kiểm tra chất lượng (KTCL) sản phẩm, hàng hóa nhập khẩu thuộc danh mục do **Bộ Khoa học và Công nghệ (BKHCN)** quản lý, theo TT 36/2026/TT-BKHCN.

## Variants

### Theo mức độ rủi ro
- **Rủi ro cao (PL I)**: kiểm tra 100% + GCNCL
  - Xăng dầu, LPG, vật liệu phóng xạ
  - Đồ chơi trẻ em
  - Thiết bị điện-điện tử gia dụng
  - Thiết bị viễn thông (trạm gốc, đầu cuối, vô tuyến)
  - Thiết bị phát thanh truyền hình

- **Rủi ro trung bình (PL II)**: công bố hợp quy
  - Các nhóm hàng liên quan nhưng rủi ro thấp hơn

### Theo hình thức kiểm tra
- Kiểm tra tại cửa khẩu (HQ + BKHCN)
- Kiểm tra tại nơi SX/KD
- Giám sát thị trường (sau thông quan)

## Decision rule

Khi hàng hóa có mã HS thuộc PL I (rủi ro cao) của TT 36/2026:
1. **Đăng ký KTCL** với Tổng cục TCĐLCL
2. **Nộp hồ sơ**: Giấy ĐKDN, MSDS, CO/CQ, kết quả thử nghiệm
3. **BKHCN cấp GCNCL** trong 7-15 ngày làm việc
4. **Thông quan** với GCNCL

## Key sources

- [[sources/36-2026-tt-bkhcn]] — VB chính
- [[sources/36-2026-tt-bkhcn-pl1]] — PL I (rủi ro cao)
- [[sources/36-2026-tt-bkhcn-pl2]] — PL II (rủi ro trung bình)

## Related concepts

- [[concepts/rui-ro-cao-vs-trung-binh]] — phân loại chung

## Notes

- Tổng cục Tiêu chuẩn Đo lường Chất lượng (TCĐLCL) trực thuộc BKHCN
- 254 mã HS thuộc diện KTCL
- Có thể chồng lấn với BCT (hóa chất), BCA (PCCC), BQP (mật mã)

## Playbook nhập hàng (chuẩn hoá 13/10/2026)

| # | Mục | Chi tiết | Căn cứ |
|---|---|---|---|
| 1 | Tra diện kiểm tra | `danh-muc/36-2026-tt-bkhcn.csv` (396 dòng có mã HS); Phần rủi ro cao — Điều 3, trung bình — Điều 4 | Sổ `36/2026/TT-BKHCN` (hiệu lực 01/7/2026, đã đối chiếu nguồn A) |
| 2 | Rủi ro trung bình | Không kiểm tra khi nhập, phải **công bố hợp quy** | Điều 82 khoản 1 NĐ 37/2026/NĐ-CP (nguồn A) |
| 3 | Rủi ro cao | **Đăng ký kiểm tra chất lượng** theo Điều 83 | Điều 82 khoản 2 NĐ 37/2026/NĐ-CP |
| 4 | Nguyên tắc riêng | Điều 5 TT 36/2026 quy định nguyên tắc quản lý chất lượng theo từng mức | Điều 5 TT 36/2026/TT-BKHCN |
| 5 | Thời hạn (khung) | 01/07/05 ngày làm việc | Điều 83 khoản 1 điểm b NĐ 37/2026/NĐ-CP |
| 6 | Miễn/giảm | Chỉ cho hàng rủi ro cao | Điều 86 NĐ 37/2026/NĐ-CP |

Nghĩa vụ theo mức rủi ro (nguồn A): [[concepts/muc-do-rui-ro-hang-hoa]]. TT 36/2026 thay thế 29/2025/TT-BKHCN từ 01/7/2026 (sổ).
