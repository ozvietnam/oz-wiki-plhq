---
id: ktcl-bnnmt-2026
title: "Kiểm tra chất lượng BNNMT (TT 27/2026)"
type: concept
created: 2026-10-09
updated: 2026-10-09
key_sources:
  - 27-2026-tt-bnnmt
related_concepts:
  - rui-ro-cao-vs-trung-binh
  - thuoc-bvtv-nhap-khau
  - phan-bon-nhap-khau
confidence: high
tags:
  - bnnmt
  - kiem-tra-chuyen-nganh
  - ktcl
  - nong-nghiep
---

## Definition

Quy trình kiểm tra chất lượng (KTCL) sản phẩm, hàng hóa nhập khẩu thuộc danh mục do **Bộ Nông nghiệp và Môi trường (BNNMT)** quản lý, theo TT 27/2026/TT-BNNMT.

## Variants

### Theo mức độ rủi ro
- **Rủi ro cao (PL II, 21 mã)**: kiểm tra 100% + GCNCL
  - **Thuốc bảo vệ thực vật (Ch.38.08)** - cực kỳ nhạy cảm

- **Rủi ro trung bình (PL I, 466 mã)**: công bố hợp quy
  - Giống cây trồng (Ch.10)
  - Phân bón (Ch.31)
  - Thức ăn chăn nuôi (Ch.23)
  - Hóa chất nông nghiệp (Ch.29, 38)
  - Máy móc nông nghiệp (Ch.84)

### Theo lĩnh vực
- **Trồng trọt** (Cục Trồng trọt)
- **Chăn nuôi** (Cục Chăn nuôi)
- **BVTV** (Cục Bảo vệ thực vật)
- **Thủy sản** (Tổng cục Thủy sản)

## Decision rule

Khi NK sản phẩm nông nghiệp → tra cứu PL I/II TT 27/2026:
- **PL II (thuốc BVTV)** → kiểm tra 100% + GCNCL từ Cục BVTV
- **PL I (giống, phân bón, TĂCN)** → công bố hợp quy
- **Không thuộc TT 27/2026** → chỉ cần kiểm dịch (nếu có)

## Key sources

- [[sources/27-2026-tt-bnnmt]] — VB chính
- [[sources/27-2026-tt-bnnmt-pl1]] — PL I
- [[sources/27-2026-tt-bnnmt-pl2]] — PL II

## Related concepts

- [[concepts/thuoc-bvtv-nhap-khau]] — thuốc BVTV
- [[concepts/phan-bon-nhap-khau]] — phân bón

## Notes

- Tổng cộng **487 mã HS** thuộc KTCL BNNMT
- PL II thuốc BVTV cực kỳ quan trọng - ảnh hưởng an toàn thực phẩm
- Phối hợp với kiểm dịch thực vật (Cục BVTV)
- Khác: kiểm dịch động vật (Chăn nuôi) - áp dụng riêng

## Playbook nhập hàng (chuẩn hoá 13/10/2026)

| # | Mục | Chi tiết | Căn cứ |
|---|---|---|---|
| 1 | Tra diện kiểm tra | `danh-muc/27-2026-tt-bnnmt.csv` (487 dòng có mã HS); danh mục trung bình — Điều 3, cao — Điều 4 | Sổ `27/2026/TT-BNNMT` (hiệu lực 01/7/2026, đã đối chiếu nguồn A) |
| 2 | Rủi ro trung bình | Không kiểm tra khi nhập, phải **công bố hợp quy** | Điều 82 khoản 1 NĐ 37/2026/NĐ-CP (nguồn A) |
| 3 | Rủi ro cao | **Đăng ký kiểm tra chất lượng** theo Điều 83 | Điều 82 khoản 2 NĐ 37/2026/NĐ-CP |
| 4 | Nguyên tắc riêng | Điều 5 TT 27/2026; chuyển tiếp — Điều 7 | Điều 5, Điều 7 TT 27/2026/TT-BNNMT |
| 5 | Thời hạn (khung) | 01/07/05 ngày làm việc | Điều 83 khoản 1 điểm b NĐ 37/2026/NĐ-CP |
| 6 | Kiểm dịch | Động/thực vật đi luồng kiểm dịch riêng, không thay bằng KTCL | [[concepts/kiem-dich-dong-thuc-vat]] |

Nghĩa vụ theo mức rủi ro (nguồn A): [[concepts/muc-do-rui-ro-hang-hoa]].
