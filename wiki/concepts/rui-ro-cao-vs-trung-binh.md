---
id: rui-ro-cao-vs-trung-binh
title: "Phân loại rủi ro: Cao vs Trung bình (KTCL)"
type: concept
created: 2026-10-09
updated: 2026-10-09
key_sources:
  - 49-2026-tt-bxd
  - 49-2026-tt-bxd-pl1
  - 49-2026-tt-bxd-pl2
related_concepts:
  - kiem-tra-chat-luong-bxd
confidence: high
tags:
  - kiem-tra-chuyen-nganh
  - rui-ro-cao
  - rui-ro-trung-binh
  - phan-loai
---

## Definition

Phân loại mức độ rủi ro của sản phẩm, hàng hóa theo BXD để quyết định hình thức kiểm tra chất lượng (KTCL) áp dụng. Hai cấp: **CAO** (Phụ lục I) và **TRUNG BÌNH** (Phụ lục II).

## Variants

### Rủi ro cao (PL I)
- Kiểm tra 100% lô hàng nhập khẩu
- Yêu cầu Giấy chứng nhận chất lượng (GCNCL) trước thông quan
- Nhóm hàng: ô tô, mô tô, xe gắn máy, xe cơ giới, phụ tùng chính, thiết bị công nghiệp nặng

### Rủi ro trung bình (PL II)
- Kiểm tra theo tỷ lệ/tần suất quy định
- Có thể kiểm tra sau thông quan (giám sát thị trường)
- Nhóm hàng: phương tiện còn lại, vật liệu xây dựng, thiết bị nhẹ

## Decision rule

1. Tra cứu mã HS trong `danh-muc/49-2026-tt-bxd.csv` (cột `phu_luc`)
2. Nếu `phu_luc = "Phụ lục I"` → CAO → kiểm tra 100% + GCNCL
3. Nếu `phu_luc = "Phụ lục II"` → TRUNG BÌNH → kiểm tra theo tỷ lệ
4. Nếu không có trong danh mục → không thuộc diện KTCL BXD

## Key sources

- [[sources/49-2026-tt-bxd]] — VB chính
- [[sources/49-2026-tt-bxd-pl1]] — 48 mã HS rủi ro cao
- [[sources/49-2026-tt-bxd-pl2]] — danh sách rủi ro trung bình

## Related concepts

- [[concepts/kiem-tra-chat-luong-bxd]] — quy trình KTCL tổng thể
- [[concepts/phuong-tien-giao-thong-van-tai]] — nhóm hàng chính

## Notes

- Cả 2 PL cùng có hiệu lực từ 01/7/2026
- Khoản 2-3 Điều 5 TT 49/2026 (về phân loại chi tiết hơn) có hiệu lực từ 01/7/2029
- BXD là cơ quan đầu mối; HQ chỉ thực hiện kiểm tra tại cửa khẩu theo chỉ định của BXD
