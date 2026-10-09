---
id: giay-phep-xuat-nhap-khau-mat-ma
title: "Giấy phép XNK sản phẩm mật mã dân sự"
type: concept
created: 2026-10-09
updated: 2026-10-09
key_sources:
  - 211-2025-nd-cp
related_concepts:
  - mat-ma-dan-su-san-pham
  - giay-phep-kinh-doanh-mat-ma
confidence: high
tags:
  - mat-ma-dan-su
  - giay-phep
  - xnk
  - ban-co-yeu
---

## Definition

Giấy phép bắt buộc khi XNK sản phẩm mật mã dân sự thuộc **Danh mục Phụ lục I NĐ 211/2025/NĐ-CP**. Cấp bởi **Ban Cơ yếu Chính phủ (BCY)**.

## Quy trình cấp phép

### Bước 1: Xác định cần phép
- Kiểm tra mã HS + mô tả sản phẩm có trong Phụ lục I NĐ 211/2025?
- Nếu CÓ → tiếp tục. Nếu KHÔNG → chỉ khai báo (nếu mã hóa mạnh)

### Bước 2: Hồ sơ
- Đơn đề nghị (mẫu BCY)
- Bản sao Giấy chứng nhận ĐKDN
- MSDS + tài liệu kỹ thuật sản phẩm
- Hợp đồng XNK (hoặc invoice proforma)
- Cam kết không chuyển giao cho bên thứ 3

### Bước 3: Nộp + xử lý
- Nộp tại: **Cục Quản lý mật mã dân sự và Kiểm định sản phẩm mật mã** (BCY)
- Thời gian: **15-30 ngày làm việc**
- Phí: 200.000đ/lần (theo Thông tư 169/2016/TT-BTC)

### Bước 4: Sử dụng giấy phép
- Hiệu lực: **đến hết năm** (ghi trên giấy phép)
- Mỗi lô hàng phải có bản sao giấy phép
- **Không được chuyển nhượng**

## Decision rule

```
NK sản phẩm có tính năng mã hóa
  │
  ├─ Có trong Phụ lục I NĐ 211/2025?
  │    ├─ CÓ → Xin Giấy phép XNK (BCY) ← THỦ TỤC NÀY
  │    └─ KHÔNG → Tiếp tục
  │
  ├─ Mã hóa mạnh (≥ 128 bit symmetric)?
  │    ├─ CÓ → Khai báo BCY (không cần giấy phép)
  │    └─ KHÔNG → Miễn trừ
```

## Key sources

- [[sources/211-2025-nd-cp]] — NĐ 211/2025, Điều 4

## Related concepts

- [[concepts/mat-ma-dan-su-san-pham]] — định nghĩa
- [[concepts/giay-phep-kinh-doanh-mat-ma]] — kinh doanh

## Notes

- **Lưu ý:** Giấy phép XNK ≠ Giấy phép kinh doanh (2 giấy khác nhau)
- DN kinh doanh mật mã thường cần **CẢ 2** giấy phép
- Hàng mã hóa cũng có thể thuộc danh mục KTCL theo TT 126/2026/TT-BQP (rủi ro cao)
