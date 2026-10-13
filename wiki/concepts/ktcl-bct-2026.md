---
id: ktcl-bct-2026
title: "KTCL Bộ Công Thương 2026 — danh mục rủi ro theo NĐ 37/2026 và playbook nhập hàng"
type: concept
confidence: high
created: 2026-10-12
updated: 2026-10-13
tags: [ktcl, bct, rui-ro, kiem-tra-chuyen-nganh, 2026, nghi-dinh-37-2026]
key_sources:
  - 33-2026-tt-bct
  - 28-2026-tt-bct
related_concepts:
  - muc-do-rui-ro-hang-hoa
  - kiem-tra-nha-nuoc-an-toan-thuc-pham
---

## Summary

Từ 01/7/2026, Bộ Công Thương quản lý chất lượng hàng nhập khẩu theo **hai thông tư danh mục song song**: **33/2026/TT-BCT** (chất lượng sản phẩm, hàng hoá — thay thế 41/2023/TT-BCT) và **28/2026/TT-BCT** (kiểm tra an toàn thực phẩm — hiệu lực 17/7/2026). Cả hai đều CON_HIEU_LUC, đã đối chiếu nguồn A (sổ 13/10/2026).

## Playbook nhập hàng (chuẩn hoá 13/10/2026)

| # | Mục | Chi tiết | Căn cứ |
|---|---|---|---|
| 1 | Tra diện kiểm tra | `danh-muc/33-2026-tt-bct.csv` (957 dòng có mã HS — chất lượng) · `danh-muc/28-2026-tt-bct.csv` (378 dòng — ATTP) | Sổ `33/2026/TT-BCT`, `28/2026/TT-BCT` |
| 2 | Rủi ro trung bình | Không kiểm tra khi nhập, phải **công bố hợp quy** phù hợp QCVN tương ứng | Điều 82 khoản 1 NĐ 37/2026/NĐ-CP (đối chiếu nguồn A 13/10/2026) |
| 3 | Rủi ro cao | **Đăng ký kiểm tra chất lượng** khi nhập; hồ sơ theo Mẫu 1 Phụ lục VII NĐ 37 | Điều 82 khoản 2; Điều 83 NĐ 37/2026/NĐ-CP |
| 4 | Thời hạn (khung) | Thông báo đáp ứng 01 ngày làm việc; bổ sung hồ sơ 07 ngày; khắc phục nhãn 05 ngày | Điều 83 khoản 1 điểm b NĐ 37/2026/NĐ-CP |
| 5 | Miễn/giảm | Các trường hợp miễn, giảm — chỉ cho hàng **rủi ro cao** | Điều 86 NĐ 37/2026/NĐ-CP |
| 6 | ATTP | Mặt hàng thuộc 28/2026/TT-BCT thực hiện kiểm tra theo khung ATTP riêng (NĐ 15/2018/NĐ-CP) | [[concepts/kiem-tra-nha-nuoc-an-toan-thuc-pham]] |

## Quan hệ

- 33/2026/TT-BCT thay thế 41/2023/TT-BCT từ 01/7/2026 (sổ, quan hệ `thay_the`).
- Phòng vệ thương mại (thuế tự vệ, chống bán phá giá) là lĩnh vực khác — không lẫn với KTCL; xem nhánh `phong-ve-thuong-mai` trong `bao-cao/cay-van-ban.md`.

## Related concepts

- [[concepts/muc-do-rui-ro-hang-hoa]] — nghĩa vụ theo mức rủi ro (nguồn A).
- [[concepts/kiem-tra-nha-nuoc-an-toan-thuc-pham]] — khung ATTP riêng.

## Notes

- Hóa chất thuộc diện giấy phép (Luật Hóa chất) là luồng giấy phép, không phải KTCL — xem [[concepts/giay-phep-hoa-chat-co-dieu-kien]].
- Bản trước 12/10/2026 ghi nhầm phân lớp "Class I/IIa/IIb/III/IV" (đó là phân loại thiết bị y tế, không phải mức rủi ro NĐ 37) và ghi TT 36/2026/TT-BKHCN vào trang BCT — đã bỏ.
