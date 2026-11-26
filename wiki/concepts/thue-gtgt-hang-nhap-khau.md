---
id: thue-gtgt-hang-nhap-khau
title: "Thuế GTGT hàng nhập khẩu (chính sách 8% / 10%)"
type: concept
created: 2026-10-04
updated: 2026-11-24
key_sources:
  - 204-2025-qh15
  - 174-2025-nd-cp
  - 181-2025-nd-cp
related_concepts:
  - thu-tuc-hai-quan-xnk
  - phan-loai-ma-hs
  - doc-tinh-trang-hieu-luc
confidence: high
tags: [thue, gtgt, sap-het-hieu-luc]
---

## Definition

Thuế giá trị gia tăng (GTGT) khâu nhập khẩu là khoản thuế nội địa thu khi hàng hóa nhập khẩu, nằm trên nhánh sổ `thue/thue-noi-dia-khau-nk`. Trong giai đoạn từ **`01/07/2025` đến hết ngày `31/12/2026`**, chính sách **giảm 2% thuế suất thuế GTGT (từ `10%` xuống `8%`)** được quy định tại Nghị quyết `204/2025/QH15` của Quốc hội và hướng dẫn chi tiết tại Nghị định `174/2025/NĐ-CP` của Chính phủ (cả hai văn bản đều ở trạng thái `CON_HIEU_LUC`, `het_hieu_luc_tu: 2026-12-31`, đã xác minh `NGUON_A` kèm toàn văn PDF ký số và điều khoản gốc).

Chính sách giảm thuế GTGT xuống `8%` được áp dụng thống nhất tại các khâu **nhập khẩu, sản xuất, gia công và kinh doanh thương mại** đối với các nhóm hàng hóa, dịch vụ đang áp dụng mức thuế suất `10%`, **trừ** các nhóm hàng hóa, dịch vụ bị loại trừ tại Phụ lục I và Phụ lục II ban hành kèm theo `174/2025/NĐ-CP` (có hiệu lực đến hết `31/12/2026`).

## Variants

| Điểm nghiệp vụ | Quy định theo sổ đăng ký & toàn văn bậc A |
|---|---|
| Văn bản gốc cấp Quốc hội | `204/2025/QH15` (áp dụng từ `2025-07-01`, có hiệu lực đến `2026-12-31`, `NGUON_A`) — giảm 2% thuế suất GTGT cho nhóm hàng chịu thuế `10%` theo khoản 3 Điều 9 Luật Thuế giá trị gia tăng năm 2024 |
| Nghị định hướng dẫn & danh mục loại trừ | `174/2025/NĐ-CP` (áp dụng từ `2025-07-01`, có hiệu lực đến `2026-12-31`, `NGUON_A`, 3 điều + 3 phụ lục, 56 trang PDF) |
| Nhóm KHÔNG được giảm (giữ `10%`) | **Phụ lục I** (viễn thông, hoạt động tài chính, ngân hàng, chứng khoán, bảo hiểm, kinh doanh bất động sản, sản phẩm kim loại, sản phẩm khai khoáng trừ than) và **Phụ lục II** (hàng hóa, dịch vụ chịu thuế tiêu thụ đặc biệt, trừ xăng) |
| Điểm mở rộng từ `01/07/2025` | Mặt hàng **than** (khâu khai thác và các khâu tiếp theo) và mặt hàng **xăng** thuộc diện chịu thuế suất `10%` được đưa vào diện giảm thuế GTGT xuống `8%` |
| Thời điểm xác định thuế GTGT khâu NK | Theo khoản 2 Điều 15 `181/2025/NĐ-CP`, thời điểm xác định thuế GTGT đối với hàng hóa nhập khẩu là **thời điểm xác định thuế nhập khẩu** (ngày đăng ký tờ khai hải quan) |
| Cảnh báo chuyển giao `31/12/2026` → `01/01/2027` | Cả `204/2025/QH15` và `174/2025/NĐ-CP` đang ở nhóm điểm mù mức Cao `SAP_HET_HIEU_LUC` (`het_hieu_luc_tu: 2026-12-31`); đến `24/11/2026` chưa có văn bản gia hạn sang năm 2027 trong sổ |
| Khung thuế XNK (tách biệt) | Luật `107/2016/QH13`, Nghị định `134/2016/NĐ-CP` (sửa đổi bởi `18/2021/NĐ-CP`), Biểu thuế XNK `26/2023/NĐ-CP` — nhánh `thue/luat-thue` và `thue/bieu-thue` |

**Không gộp:** Thuế xuất khẩu, thuế nhập khẩu (theo Luật `107/2016/QH13`) khác với thuế GTGT khâu nhập khẩu. Tra biểu thuế nhập khẩu ưu đãi không thay thế việc đối chiếu Phụ lục I, Phụ lục II của `174/2025/NĐ-CP` (và riêng nhóm xăng, dầu trong quý IV/2026 cần đối chiếu thêm cơ chế tại `43/2026/NQ-CP` và `19/2026/QH16`).

## Key sources

- [[sources/204-2025-qh15]] — Nghị quyết `204/2025/QH15` ngày 17/06/2025 của Quốc hội về giảm thuế giá trị gia tăng (có hiệu lực đến hết `31/12/2026`).
- [[sources/174-2025-nd-cp]] — Nghị định `174/2025/NĐ-CP` ngày 30/06/2025 của Chính phủ quy định chính sách giảm thuế GTGT theo Nghị quyết `204/2025/QH15` (có hiệu lực đến hết `31/12/2026`, kèm Phụ lục I, II danh mục mã HS hàng hóa loại trừ).
- [[sources/181-2025-nd-cp]] — Nghị định `181/2025/NĐ-CP` quy định chi tiết thi hành một số điều của Luật Thuế giá trị gia tăng năm 2024 (khoản 2 Điều 15 về thời điểm xác định thuế GTGT hàng nhập khẩu).

## Related concepts

- [[concepts/thu-tuc-hai-quan-xnk]] — thuế GTGT khâu nhập khẩu được kê khai, tính và thu cùng quy trình thông quan tờ khai hải quan.
- [[concepts/phan-loai-ma-hs]] — mã HS tại Phụ lục I, II của `174/2025/NĐ-CP` (có hiệu lực đến hết `31/12/2026`) dùng để xác định hàng hóa thuộc diện loại trừ giảm thuế.
- [[concepts/doc-tinh-trang-hieu-luc]] — nguyên tắc đọc trường `het_hieu_luc_tu: 2026-12-31` và cảnh báo chuyển giao năm.

## Mentioned in

- [[summary/khung-thu-tuc-hai-quan]]
- [[summary/van-ban-sap-het-hieu-luc-2026-2027]]

## Notes

Không phải tư vấn pháp lý. Wiki chỉ cung cấp căn cứ hiệu lực văn bản và điều khoản nguyên văn nguồn A; việc tra cứu biểu thuế chi tiết theo mã HS thuộc `hs-code-api`. Đối với các lô hàng nhập khẩu dự kiến cập cảng cuối tháng 12/2026 – đầu tháng 01/2027, xem hướng dẫn rà soát thời điểm mở tờ khai và kịch bản cắt chuyển trạng thái tại [[summary/van-ban-sap-het-hieu-luc-2026-2027]].
