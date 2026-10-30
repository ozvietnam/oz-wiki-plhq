---
id: phan-loai-ma-hs
title: Phân loại mã số HS hàng xuất nhập khẩu
type: concept
created: 2026-10-04
updated: 2026-10-30
key_sources:
  - 85-2026-tt-btc
  - 14-2015-tt-btc
  - 17-2021-tt-btc
  - 31-2022-tt-btc
  - 49-2010-tt-btc
  - 1628-qd-tchq
  - 1921-qd-tchq
related_concepts:
  - thu-tuc-hai-quan-xnk
  - thue-gtgt-hang-nhap-khau
  - muc-do-rui-ro-hang-hoa
  - gri-wco
  - mo-ta-hang-hoa-khai-bao
confidence: high
tags:
  - phan-loai-hs
  - hai-quan
---

## Definition

Phân loại mã HS là việc gắn hàng hoá xuất nhập khẩu vào mã số trong Danh mục hàng hoá XNK Việt Nam để xác định thuế, chính sách và kiểm tra chuyên ngành. Quy trình thuộc nhánh `phan-loai-hs/quy-trinh-phan-loai`; danh mục mã số thuộc nhánh `phan-loai-hs/danh-muc`.

## Trạng thái hiệu lực (cập nhật 09/10/2026)

**Đã thay thế vào 15/09/2026**: TT 14/2015/TT-BTC + TT 17/2021/TT-BTC **HẾT hiệu lực** theo Điều 15.1 của **TT 85/2026/TT-BTC** (Công báo số 409 ngày 18/07/2026). Mọi tra cứu quy trình phân loại phải dùng 85/2026/TT-BTC từ 15/09/2026 trở đi.

## Variants (3 VB then chốt)

| Văn bản (sổ) | Tên ngắn theo sổ | Nhánh | Hiệu lực |
|---|---|---|---|
| `85/2026/TT-BTC` | Quy định phân loại hàng hoá, phân tích để phân loại hàng hoá XNK | `phan-loai-hs/quy-trinh-phan-loai` | **CÒN** hiệu lực từ 15/09/2026; thay thế 14/2015 + 17/2021 |
| `14/2015/TT-BTC` | Hướng dẫn phân loại hàng hoá; phân tích để phân loại; phân tích kiểm tra chất lượng/ATTP | `phan-loai-hs/quy-trinh-phan-loai` | **HẾT** hiệu lực từ 15/09/2026 |
| `17/2021/TT-BTC` | Sửa đổi, bổ sung một số điều của 14/2015/TT-BTC | `phan-loai-hs/quy-trinh-phan-loai` | **HẾT** hiệu lực từ 15/09/2026 |
| `31/2022/TT-BTC` | Ban hành Danh mục hàng hoá xuất khẩu, nhập khẩu Việt Nam | `phan-loai-hs/danh-muc` | CÒN hiệu lực từ 01/12/2022 |

## Điểm mới trong 85/2026 (so với 14/2015)

| Điều | Nội dung |
|---|---|
| Điều 4 | 5 nguyên tắc tuân thủ gồm **6 GRI WCO** — lần đầu ghi nhận trong luật nội địa |
| Điều 6.1 | Liệt kê **4 tài liệu** tra cứu khi chưa xác định được mã duy nhất: (a) Chú giải chi tiết HS WCO, (b) Tuyển tập ý kiến WCO, (c) Chú giải bổ sung AHTN, (d) CSDL VN. **Nguyên văn không quy định thứ tự ưu tiên** giữa 4 tài liệu. |
| Điều 6.2 | Mô tả VN khác HS WCO thì **áp dụng HS WCO** — mặc định ưu tiên quốc tế |
| Điều 7 | Phân loại máy liên hợp/tổ hợp máy Ch.84/85/90 theo Chú giải pháp lý 3, 4, 5 Phần XVI |
| Điều 16 | Máy liên hợp đã đăng ký Danh mục trước 15/09/2026 tiếp tục theo TT 14/2015 đến khi nhập hết (chuyển tiếp) |

**Đọc đúng cặp gốc–sửa:** từ 15/09/2026, đọc `85/2026/TT-BTC` (kế thừa 14/2015 + 17/2021, xem [[concepts/doc-tinh-trang-hieu-luc]]). Danh mục mã số là văn bản riêng (`31/2022/TT-BTC`), không thay thế thông tư quy trình.

## Key sources

- [[sources/49-2010-tt-btc]] — TT 49/2010/TT-BTC, khung "phân loại + áp dụng mức thuế" đầu tiên (đã hết hiệu lực 16/03/2015)
- [[sources/1628-qd-tchq]] — QĐ 1628/QĐ-TCHQ, quy chế phân tích/phân loại của ngành Hải quan (đã hết hiệu lực 09/12/2013)
- [[sources/1921-qd-tchq]] — QĐ 1921/QĐ-TCHQ, Quy trình phân loại hàng hóa, áp dụng mức thuế của ngành Hải quan (2018) — **CHƯA XÁC MINH**, mới có bản bậc C
- `registry/van-ban/85-2026-tt-btc.yaml` (NGUON_A, đã đọc toàn văn 23 trang, 711KB)
- `registry/van-ban/14-2015-tt-btc.yaml` (HET_HIEU_LUC từ 15/09/2026, NGUON_A)
- `registry/van-ban/17-2021-tt-btc.yaml` (HET_HIEU_LUC theo quan hệ thay thế 85/2026)
- `registry/van-ban/31-2022-tt-btc.yaml` (CON_HIEU_LUC từ 01/12/2022)
- `registry/van-ban/49-2010-tt-btc.yaml` (HET_HIEU_LUC từ 16/03/2015 — TT 49/2010 "Hướng dẫn việc phân loại, áp dụng mức thuế", bản nền tảng trước TT 14/2015)
- `registry/van-ban/1628-qd-tchq.yaml` (HET_HIEU_LUC từ 09/12/2013 — Quy chế phân tích, phân loại hàng hoá **của ngành Hải quan**)
- `registry/van-ban/1921-qd-tchq-2018.yaml` (CHUA_XAC_MINH — Quy trình phân loại + áp dụng mức thuế của ngành Hải quan, 2018; mới có bản đăng lại bậc C)
- Toàn văn 85/2026: `raw/download/congbaocdn.chinhphu.vn/2026/7/18/85-2026-tt-btc.pdf`

## Related concepts

- [[concepts/thu-tuc-hai-quan-xnk]] — mô tả hàng trên tờ khai gắn với mã khai.
- [[concepts/thue-gtgt-hang-nhap-khau]] — thuế suất phụ thuộc phân loại và biểu thuế.
- [[concepts/muc-do-rui-ro-hang-hoa]] — danh mục rủi ro KTCN cũng gắn mã HS theo từng bộ.
- [[concepts/mo-ta-hang-hoa-khai-bao]] — mô tả trên tờ khai là căn cứ xác định mã số (chỉ tiêu 1.78).

## Mentioned in

- [[summary/dong-bo-quan-diem-phan-loai]]

- [[summary/luat-duoc-va-phan-loai-hs]]

## Notes

- **Quan trọng**: Trước 15/09/2026, tham chiếu `14/2015/TT-BTC + 17/2021/TT-BTC`. Từ 15/09/2026, **chỉ tham chiếu `85/2026/TT-BTC`**.
- Câu hỏi mẫu #8 (xác định trước mã số: hồ sơ, thời hạn) trong `docs/cau-hoi-mau.md` đánh dấu **chưa** — cần trích điều từ toàn văn 85/2026/TT-BTC (Điều 8-12).
- Nhánh `phan-loai-hs/chu-giai` và `phan-loai-hs/thong-bao-phan-loai` đang trống trên cây (điểm mù cao).
- Có **hai** nhánh văn bản về phân loại song song: của **Bộ Tài chính** (TT 49/2010 → TT 14/2015 → TT 85/2026) và của **ngành Hải quan** (QĐ 1628/QĐ-TCHQ → 4023/QĐ-TCHQ → 2131 → 2999 → 2166 → 2169/QĐ-CHQ). Cả hai đều đã hết hiệu lực ở các mốc khác nhau — xem [[sources/1628-qd-tchq]].
