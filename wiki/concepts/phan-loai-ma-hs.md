---
id: phan-loai-ma-hs
title: "Phân loại mã số HS hàng xuất nhập khẩu"
type: concept
created: 2026-10-04
updated: 2026-10-04
key_sources: []
related_concepts:
  - thu-tuc-hai-quan-xnk
  - thue-gtgt-hang-nhap-khau
  - muc-do-rui-ro-hang-hoa
confidence: medium
tags: [phan-loai-hs, hai-quan]
---

## Definition

Phân loại mã HS là việc gắn hàng hoá xuất nhập khẩu vào mã số trong Danh mục hàng hoá XNK Việt Nam để xác định thuế, chính sách và kiểm tra chuyên ngành. Trong sổ đăng ký, quy trình phân loại/phân tích thuộc nhánh `phan-loai-hs/quy-trinh-phan-loai` (`14/2015/TT-BTC`, sửa bởi `17/2021/TT-BTC`); danh mục mã số thuộc `phan-loai-hs/danh-muc` (`31/2022/TT-BTC`).

## Variants

| Văn bản (sổ) | Tên ngắn theo sổ | Nhánh | Ghi chú sổ |
|---|---|---|---|
| `14/2015/TT-BTC` | Phân loại hàng hoá; phân tích để phân loại; phân tích kiểm tra chất lượng/ATTP | `phan-loai-hs/quy-trinh-phan-loai` | `CON_HIEU_LUC`; chưa đối chiếu nguồn A |
| `17/2021/TT-BTC` | Sửa đổi, bổ sung một số điều của `14/2015/TT-BTC` | cùng nhánh | `quan_he.sua_doi` → `14/2015/TT-BTC` |
| `31/2022/TT-BTC` | Ban hành Danh mục hàng hoá xuất khẩu, nhập khẩu Việt Nam | `phan-loai-hs/danh-muc` | hiệu lực từ `2022-12-01` theo sổ |

**Đọc đúng cặp gốc–sửa:** khi tra quy trình phân loại, đọc `14/2015/TT-BTC` **kèm** `17/2021/TT-BTC` (xem [[concepts/doc-tinh-trang-hieu-luc]]). Danh mục mã số là văn bản riêng (`31/2022/TT-BTC`), không thay thế thông tư quy trình.

## Key sources

Chưa nạp toàn văn. Các khẳng định trên chỉ lặp lại tiêu đề, nhánh, quan hệ và ngày trong `registry/van-ban/`.

## Related concepts

- [[concepts/thu-tuc-hai-quan-xnk]] — mô tả hàng trên tờ khai gắn với mã khai.
- [[concepts/thue-gtgt-hang-nhap-khau]] — thuế suất phụ thuộc phân loại và biểu thuế.
- [[concepts/muc-do-rui-ro-hang-hoa]] — danh mục rủi ro KTCN cũng gắn mã HS theo từng bộ.

## Mentioned in

- [[summary/khung-thu-tuc-hai-quan]]

## Notes

Câu hỏi mẫu #8 (xác định trước mã số: hồ sơ, thời hạn) đánh dấu **chưa** trong `docs/cau-hoi-mau.md` — cần trích điều từ toàn văn `14/2015/TT-BTC` / `17/2021/TT-BTC`. Nhánh `phan-loai-hs/chu-giai` và `phan-loai-hs/thong-bao-phan-loai` đang trống trên cây (điểm mù cao).
