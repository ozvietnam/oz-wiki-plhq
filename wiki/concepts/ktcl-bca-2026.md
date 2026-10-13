---
id: ktcl-bca-2026
title: "Kiểm tra chất lượng BCA (TT 125/2026)"
type: concept
created: 2026-10-09
updated: 2026-10-09
key_sources:
  - 125-2026-tt-bca
related_concepts:
  - thiet-bi-pccc
  - thiet-bi-giam-sat-atgt
confidence: high
tags:
  - bca
  - kiem-tra-chuyen-nganh
  - ktcl
  - pccc
  - atgt
---

## Definition

Quy trình kiểm tra chất lượng (KTCL) sản phẩm, hàng hóa nhập khẩu thuộc danh mục do **Bộ Công an (BCA)** quản lý, theo TT 125/2026/TT-BCA.

## Variants

### Theo mức độ rủi ro
- **Rủi ro cao (4 mã)**: kiểm tra 100% + GCNCL
  - Pháo hoa (3604.10.00)
  - Bình chữa cháy, chai khí (8424.10.90)
  - Chất chữa cháy (3813.00.00)

- **Rủi ro trung bình (55 mã)**: công bố hợp quy
  - Thiết bị PCCC (báo cháy, bơm, vòi)
  - Camera giám sát, camera ATGT
  - Thiết bị GSHT (giám sát hành trình xe)

### Theo lĩnh vực
- **PCCC + cứu nạn cứu hộ** (Cục Cảnh sát PCCC)
- **An toàn giao thông** (Cục CSGT)
- **An ninh công cộng** (Cục An ninh)

## Decision rule

Khi NK thiết bị PCCC hoặc camera → tra cứu PL TT 125/2026:
- **Pháo hoa, bình/chai PCCC, chất chữa cháy** → KTCL 100% + GCNCL
- **Thiết bị PCCC khác** → công bố hợp quy (Cục CS PCCC)
- **Camera ATGT, GSHT** → công bố hợp quy (Cục CSGT)

## Key sources

- [[sources/125-2026-tt-bca]] — VB chính

## Related concepts

- [[concepts/thiet-bi-pccc]] — chi tiết
- [[concepts/thiet-bi-giam-sat-atgt]] — chi tiết

## Notes

- Tổng cộng **59 mã HS** thuộc KTCL BCA
- Tem kiểm định PCCC cũ hết hạn 30/6/2026
- Camera TQ (Hikvision, Dahua) rất phổ biến - phải có kiểm định
- Pháo hoa là hàng nhạy cảm - quản lý chặt

## Playbook nhập hàng (chuẩn hoá 13/10/2026)

| # | Mục | Chi tiết | Căn cứ |
|---|---|---|---|
| 1 | Tra diện kiểm tra | `danh-muc/125-2026-tt-bca.csv` (59 dòng có mã HS): Phần A rủi ro cao 4 mã (pháo hoa 3604.10.00; bình chữa cháy 8424.10.90; chất chữa cháy 3813.00.00; chai chứa khí chữa cháy) — Phần B trung bình 55 mã (phương tiện PCCC-CNCH; thiết bị giám sát TT-ATGT, an toàn xã hội) | Sổ `125/2026/TT-BCA` (hiệu lực 01/7/2026, đã đối chiếu nguồn A 13/10/2026) |
| 2 | Rủi ro trung bình | Không kiểm tra khi nhập, phải **công bố hợp quy** phù hợp QCVN 03/05/06/11:2021–2026/BCA | Điều 82 khoản 1 NĐ 37/2026/NĐ-CP (nguồn A) |
| 3 | Rủi ro cao | **Chứng nhận hợp quy + kiểm tra nhà nước khi nhập** | Điều 82 khoản 2; Điều 83 NĐ 37/2026/NĐ-CP |
| 4 | Cơ quan | Cục KH-CLS Công an chủ trì hướng dẫn, kiểm tra, đôn đốc | Điều 7 TT 125/2026/TT-BCA |
| 5 | Chuyển tiếp | Giấy CN hợp quy, TB tiếp nhận CBHQ cấp trước 01/7/2026 còn giá trị đến hết hạn; hàng rủi ro cao truy xuất nguồn gốc sau 06 tháng từ ngày hiệu lực | Điều 6 TT 125/2026/TT-BCA |
| 6 | Thời hạn (khung) | 01/07/05 ngày làm việc | Điều 83 khoản 1 điểm b NĐ 37/2026/NĐ-CP |

Nghĩa vụ theo mức rủi ro (nguồn A): [[concepts/muc-do-rui-ro-hang-hoa]]. Nền: Luật 55/2024/QH15 (Điều 44 áp dụng đồng thời). TT 125 **không** bãi tường minh QĐ 8378/6266/9981/QĐ-BCA — Điều 5 khoản 2 chỉ là dẫn chiếu chuyển tiếp (sổ, ghi_chu).
