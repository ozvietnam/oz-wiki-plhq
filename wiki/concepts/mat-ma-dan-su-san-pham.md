---
id: mat-ma-dan-su-san-pham
title: "Mật mã dân sự - sản phẩm, dịch vụ"
type: concept
created: 2026-10-09
updated: 2026-10-09
key_sources:
  - 211-2025-nd-cp
related_concepts:
  - giay-phep-kinh-doanh-mat-ma
  - giay-phep-xuat-nhap-khau-mat-ma
confidence: high
tags:
  - mat-ma-dan-su
  - ban-co-yeu
  - crypto
  - xnk
---

## Definition

**Sản phẩm mật mã dân sự** là hàng hóa/hệ thống sử dụng thuật toán mật mã để bảo vệ thông tin, KHÔNG dùng cho mục đích quân sự, an ninh quốc gia. Quản lý theo NĐ 211/2025/NĐ-CP (Chương I-III), cơ quan là **Ban Cơ yếu Chính phủ (BCY)**.

## Variants

### Theo mục đích
- **Bảo mật dữ liệu**: phần mềm mã hóa, USB mã hóa
- **Xác thực**: smartcard, token OTP, khóa số
- **Chữ ký số**: PKI, HSM (Hardware Security Module)
- **VPN/IPsec**: thiết bị VPN router

### Theo mức độ quản lý
- **Nhóm 1**: Mã hóa mạnh (>128 bit, có thể xuất khẩu có điều kiện)
- **Nhóm 2**: Mã hóa yếu hơn (< 128 bit) - chỉ cần khai báo
- **Nhóm 3**: Sản phẩm tiêu dùng thông thường (HTTPS, TLS) - **miễn trừ**

## Decision rule

Khi NK sản phẩm có tính năng mã hóa → tra cứu **Phụ lục I NĐ 211/2025**:
- **Có trong Phụ lục I** → cần **Giấy phép XNK** từ BCY (Điều 4)
- **Không có** + dùng mật mã mạnh → cần **khai báo** cho BCY
- **Miễn trừ** (Nhóm 3) → không cần giấy tờ, vẫn thông quan bình thường

## Key sources

- [[sources/211-2025-nd-cp]] — NĐ 211/2025

## Related concepts

- [[concepts/giay-phep-kinh-doanh-mat-ma]] — Kinh doanh mật mã
- [[concepts/giay-phep-xuat-nhap-khau-mat-ma]] — XNK mật mã

## Notes

- **Phân biệt với mật mã quân sự** (do BQP quản lý) - khác thủ tục
- Châu Âu/Mỹ có quy định tương đương (Wassenaar Arrangement)
- Ảnh hưởng lớn đến DN XNK: phần mềm, thiết bị IoT, smartcard
