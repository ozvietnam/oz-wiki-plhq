---
id: thue-gtgt-hang-nhap-khau
title: "Thuế GTGT hàng nhập khẩu (chính sách 8% / 10%)"
type: concept
created: 2026-10-04
updated: 2026-10-04
key_sources: []
related_concepts:
  - thu-tuc-hai-quan-xnk
  - phan-loai-ma-hs
  - doc-tinh-trang-hieu-luc
confidence: medium
tags: [thue, gtgt]
---

## Definition

Thuế giá trị gia tăng (GTGT) khâu nhập khẩu là khoản thuế nội địa thu khi hàng hoá nhập khẩu, nằm trên nhánh sổ `thue/thue-noi-dia-khau-nk`. Tại thời điểm sổ ghi nhận, chính sách **giảm thuế suất GTGT từ 10% xuống 8%** được neo vào `174/2025/NĐ-CP` với `tinh_trang: CON_HIEU_LUC` và `het_hieu_luc_tu: 2026-12-31`. Sổ ghi mức xác minh `NGUON_THU_CAP` — chưa mở văn bản gốc bậc A.

## Variants

| Điểm cần nhớ | Theo sổ đăng ký |
|---|---|
| Văn bản neo chính sách giảm | `174/2025/NĐ-CP` — tên sổ: «Chính sách giảm thuế giá trị gia tăng (10% → 8%)» |
| Tình trạng | `CON_HIEU_LUC` |
| Ngày hết hiệu lực ghi trong sổ | `2026-12-31` |
| Việc theo dõi | ghi chú sổ: theo dõi văn bản gia hạn/thay thế |
| Khung thuế XNK (tách biệt) | Luật `107/2016/QH13`, nghị định `134/2016/NĐ-CP` (sửa `18/2021/NĐ-CP`), biểu thuế `26/2023/NĐ-CP` — nhánh `thue/luat-thue` / `thue/bieu-thue` |

**Không gộp:** thuế xuất/nhập khẩu (theo Luật `107/2016/QH13`) khác thuế GTGT khâu nhập. Tra biểu thuế XNK không thay thế việc tra chính sách GTGT `174/2025/NĐ-CP`.

## Key sources

Chưa có trang nguồn. Căn cứ: `registry/van-ban/174-2025-nd-cp.yaml` và các tệp thuế khung nêu trên.

## Related concepts

- [[concepts/thu-tuc-hai-quan-xnk]] — GTGT thường tính cùng lúc thông quan.
- [[concepts/phan-loai-ma-hs]] — mã HS ảnh hưởng thuế XNK; nhóm hàng hưởng 8% cần đối chiếu danh mục trong nghị định GTGT (chưa trích ở đây).
- [[concepts/doc-tinh-trang-hieu-luc]] — ngày `het_hieu_luc_tu` và khả năng gia hạn.

## Mentioned in

- [[summary/khung-thu-tuc-hai-quan]]

## Notes

Không phải tư vấn pháp lý. Câu hỏi mẫu #11 («đang 8% hay 10%, đến khi nào?») trả lời **một phần** từ sổ: neo `174/2025/NĐ-CP`, hết theo sổ `2026-12-31`, nhưng danh mục hàng được giảm và điều khoản thi hành **chưa** trích vì chưa có toàn văn / nguồn A.
