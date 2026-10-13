---
id: phuong-tien-giao-thong-van-tai
title: "Phương tiện giao thông vận tải"
type: concept
created: 2026-10-09
updated: 2026-10-09
key_sources:
  - 49-pl1-2026-tt-bxd
  - 49-pl2-2026-tt-bxd
related_concepts:
  - kiem-tra-chat-luong-bxd
confidence: high
tags:
  - giao-thong-van-tai
  - oto
  - xe-co-gioi
  - bxd
  - hs-chuong-87
---

## Definition

Nhóm hàng hóa gồm phương tiện vận tải đường bộ (ô tô, mô tô, xe gắn máy, rơ moóc), phụ tùng, thiết bị GTVT, xe máy chuyên dụng. Phân loại theo HS chương 84, 85, 87.

## Variants

### Theo HS chapter
- **Ch.84**: Xe nâng, cần trục, máy xúc, máy ủi (84.26-84.30), thiết bị công nghiệp (84.79)
- **Ch.85**: Bình áp lực, ắc quy (85.07)
- **Ch.87**: Phương tiện vận tải đường bộ
  - 87.01: Ô tô đầu kéo
  - 87.02: Ô tô chở >= 10 người
  - 87.03: Ô tô chở khách (< 10 người)
  - 87.04: Ô tô chở hàng
  - 87.05: Xe chuyên dụng (cứu hỏa, cần cẩu...)
  - 87.06: Khung gầm ô tô có động cơ
  - 87.09: Xe vận chuyển hàng hóa có động cơ
  - 87.11: Mô tô, xe gắn máy
  - 87.13: Xe cho người tàn tật
  - 87.16: Rơ moóc, sơ mi rơ moóc

## Decision rule

Áp dụng cho hàng hóa XNK có HS thuộc Ch.84 (một phần), Ch.85 (một phần), Ch.87 (toàn bộ) — xem PL I, PL II của TT 49/2026/TT-BXD để xác định mức rủi ro.

## Key sources

- [[sources/49-pl1-2026-tt-bxd]] — 48 mã HS rủi ro cao
- [[sources/49-pl2-2026-tt-bxd]] — rủi ro trung bình

## Related concepts

- [[concepts/kiem-tra-chat-luong-bxd]] — quy trình KTCL

## Notes

- Ch.87 là chương lớn nhất về số mã HS trong TT 49/2026 (>50%)
- Phụ tùng (lốp 4011, kính 7007, ắc quy 8507) tách riêng theo chương vật liệu

## Playbook nhập hàng phương tiện GTVT (chuẩn hoá 13/10/2026)

| # | Mục | Chi tiết | Căn cứ |
|---|---|---|---|
| 1 | Tra diện kiểm tra | `danh-muc/49-2026-tt-bxd.csv` (64 dòng có mã HS): Phụ lục I rủi ro cao (ô tô, mô tô, xe gắn máy, xe bốn bánh có động cơ), Phụ lục II trung bình (phương tiện, phụ tùng, thiết bị GTVT, đường sắt) | Sổ `49/2026/TT-BXD` (hiệu lực 01/7/2026, đã đối chiếu nguồn A) |
| 2 | Ví dụ tra cứu | Phụ tùng thân xe **8708** (870870 vành hợp kim, 870822 kính an toàn) → Phụ lục II, mức **TRUNG_BÌNH** → công bố hợp quy, không phải đăng ký kiểm tra | `danh-muc/49-2026-tt-bxd.csv` + Điều 82 khoản 1 NĐ 37/2026/NĐ-CP |
| 3 | Rủi ro cao | **Đăng ký kiểm tra chất lượng** khi nhập | Điều 82 khoản 2; Điều 83 NĐ 37/2026/NĐ-CP |
| 4 | Truy xuất nguồn gốc | Yêu cầu riêng với sản phẩm, hàng hoá thuộc danh mục | Điều 5 TT 49/2026/TT-BXD |
| 5 | Bãi bỏ cũ | Toàn bộ TT 12/2022/TT-BGTVT (điểm a) và TT 62/2024/TT-BGTVT (điểm b) từ 01/7/2026 | Điều 6 khoản 3 TT 49/2026/TT-BXD |
| 6 | Thời hạn (khung) | 01/07/05 ngày làm việc | Điều 83 khoản 1 điểm b NĐ 37/2026/NĐ-CP |

Nghĩa vụ theo mức rủi ro (nguồn A): [[concepts/muc-do-rui-ro-hang-hoa]].
