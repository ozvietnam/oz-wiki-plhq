---
id: doc-tinh-trang-hieu-luc
title: "Đọc tình trạng hiệu lực: thay thế, sửa đổi, bãi bỏ, tạm ngưng"
type: concept
created: 2026-10-04
updated: 2026-10-04
key_sources: []
related_concepts:
  - muc-do-rui-ro-hang-hoa
  - kiem-tra-nha-nuoc-an-toan-thuc-pham
  - nhan-hang-hoa-nhap-khau
  - thu-tuc-hai-quan-xnk
  - thue-gtgt-hang-nhap-khau
confidence: medium
tags: [phuong-phap, hieu-luc]
---

## Definition

Một văn bản có thể mất hiệu lực toàn bộ hoặc một phần theo nhiều cách. Sổ đăng ký của kho ghi các quan hệ này ở văn bản **mới** (`quan_he` trong `registry/van-ban/*.yaml`), kèm phạm vi, ngày và điều khoản căn cứ; quan hệ ngược do công cụ tính.

## Variants

| Quan hệ | Nghĩa | Văn bản cũ còn dùng? | Ví dụ trong kho |
|---|---|---|---|
| Thay thế | Văn bản mới thay toàn bộ văn bản cũ | Không, từ ngày văn bản mới có hiệu lực | 49/2026/TT-BXD thay 12/2022/TT-BGTVT |
| Sửa đổi, bổ sung | Đổi một số điều | Có — đọc kèm văn bản sửa | 39/2018/TT-BTC sửa 38/2015/TT-BTC |
| Bãi bỏ | Chấm dứt mà không cần văn bản thay; có thể chỉ một phần | Không (phần bị bãi bỏ) | 37/2026/NĐ-CP bãi bỏ Điều 4 của 154/2018/NĐ-CP |
| Tạm ngưng | Văn bản mới chưa được áp dụng; văn bản cũ tiếp tục dùng | **Có** | 46/2026/NĐ-CP bị tạm ngưng nên 15/2018/NĐ-CP vẫn áp dụng |
| Hướng dẫn | Quy định chi tiết văn bản cấp trên | Mất gốc khi văn bản cấp trên hết hiệu lực | 08/2015/NĐ-CP hướng dẫn Luật Hải quan 54/2014/QH13 |

## Key sources

Căn cứ xác định hiệu lực thường nằm ở **điều khoản thi hành** (điều cuối) của văn bản mới. Kho chỉ chấp nhận đánh dấu "đã đối chiếu hiệu lực" khi đã mở nguồn bậc A.

## Related concepts

- [[concepts/muc-do-rui-ro-hang-hoa]]
- [[concepts/kiem-tra-nha-nuoc-an-toan-thuc-pham]]
- [[concepts/nhan-hang-hoa-nhap-khau]] — ví dụ bãi bỏ khung nhãn cũ.
- [[concepts/thu-tuc-hai-quan-xnk]] — ví dụ sửa đổi thông tư và thay thế một cửa.
- [[concepts/thue-gtgt-hang-nhap-khau]] — ví dụ `het_hieu_luc_tu` có ngày cụ thể trên sổ.

## Mentioned in

- [[summary/khung-kiem-tra-chuyen-nganh-2026]]
- [[summary/khung-thu-tuc-hai-quan]]

## Notes

Ngày mất hiệu lực có thể khác nhau trong cùng một văn bản: Điều 97 Nghị định 37/2026/NĐ-CP cho một số nghị định hết hiệu lực từ 23/01/2026 và số khác từ 01/7/2026.

## Sources covered

- [54/2014/QH13](../sources/54-2014-qh13.md)
- [78/2025/QH15](../sources/78-2025-qh15.md)
- [05/2007/QH12](../sources/05-2007-qh12.md)
- [55/2010/QH12](../sources/55-2010-qh12.md)
