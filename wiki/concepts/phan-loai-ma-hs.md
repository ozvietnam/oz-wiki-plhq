---
id: phan-loai-ma-hs
title: Phân loại mã số HS hàng xuất nhập khẩu
type: concept
created: 2026-10-04
updated: 2026-11-21
key_sources:
  - 85-2026-tt-btc
  - 117-qd-chq
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

Phân loại mã HS là việc gắn hàng hoá xuất nhập khẩu vào mã số trong Danh mục hàng hoá XNK Việt Nam để xác định thuế, chính sách và kiểm tra chuyên ngành (Điều 26 Luật Hải quan `54/2014/QH13`; Điều 16 Nghị định `08/2015/NĐ-CP`, sửa đổi bởi khoản 15 Điều 1 Nghị định `167/2025/NĐ-CP`). Quy trình thuộc nhánh `phan-loai-hs/quy-trinh-phan-loai`; danh mục mã số thuộc nhánh `phan-loai-hs/danh-muc`. Theo phân vai hệ thống, trang này chỉ trình bày **khung pháp lý và dẫn nguồn văn bản** — việc áp mã HS, 6 quy tắc GIR và chú giải HS/AHTN thuộc phạm vi của `hs-code-api`.

## Trạng thái hiệu lực (cập nhật 21/11/2026)

- **Nhánh Bộ Tài chính — đã thay thế từ `15/09/2026`:** `14/2015/TT-BTC` và `17/2021/TT-BTC` **đã HẾT hiệu lực từ `15/09/2026`**, bị thay thế bởi Điều 15 khoản 1 **[[sources/85-2026-tt-btc|TT 85/2026/TT-BTC]]** (`CON_HIEU_LUC`, `NGUON_A`, Công báo số 409 ngày `18/07/2026`). Mọi tra cứu quy trình phân loại từ `15/09/2026` trở đi áp dụng `85/2026/TT-BTC` (trừ trường hợp chuyển tiếp tại Điều 16).
- **Nhánh quy trình ngành Hải quan — đã thay thế từ `01/02/2026`:** `1921/QĐ-TCHQ` **đã HẾT hiệu lực từ `01/02/2026`**, bị bãi bỏ toàn bộ bởi Điều 2 khoản 2 **[[sources/117-qd-chq|QĐ 117/QĐ-CHQ]]** ngày `20/01/2026` của Cục Hải quan (`CON_HIEU_LUC` từ `01/02/2026`; đang ở `NGUON_B` với bản PDF ký số 28 trang, chờ URL `customs.gov.vn` để nâng `NGUON_A`). Nhờ điều khoản dẫn chiếu động tại Điều 20 khoản 3 Quy trình kèm `117/QĐ-CHQ`, khi `85/2026/TT-BTC` có hiệu lực từ `15/09/2026`, quy trình tại `117/QĐ-CHQ` nối sang `85/2026/TT-BTC`.

## Variants

| Văn bản (sổ) | Tên ngắn theo sổ | Nhánh | Hiệu lực |
|---|---|---|---|
| `85/2026/TT-BTC` | Quy định phân loại hàng hoá, phân tích để phân loại hàng hoá XNK | `phan-loai-hs/quy-trinh-phan-loai` | **CÒN** hiệu lực từ `15/09/2026` (`NGUON_A`); thay thế `14/2015/TT-BTC` + `17/2021/TT-BTC` |
| `31/2022/TT-BTC` | Ban hành Danh mục hàng hoá xuất khẩu, nhập khẩu Việt Nam | `phan-loai-hs/danh-muc` | **CÒN** hiệu lực từ `01/12/2022` (`NGUON_A`) |
| `117/QĐ-CHQ` | Quy trình Xác định trước mã số; Kiểm tra tên hàng, mô tả, mã số, mức thuế, đơn vị tính trong thông quan; Thống nhất phân loại toàn ngành | `phan-loai-hs/quy-trinh-phan-loai`, `hai-quan/so-tay-nghiep-vu` | **CÒN** hiệu lực từ `01/02/2026` (`NGUON_B`, `THIEU_PDF_A`); bãi bỏ `1921/QĐ-TCHQ` |
| `2169/QĐ-CHQ` | Quy trình phân tích phân loại và kiểm tra tiêu chí kỹ thuật tại cơ quan Kiểm định hải quan | `phan-loai-hs/quy-trinh-phan-loai` | **CÒN** hiệu lực từ `01/02/2026` (`NGUON_B`, `THIEU_PDF_A`); thay thế `2999/QĐ-TCHQ` + `2166/QĐ-TCHQ` |
| `2079/QĐ-TCHQ` | Danh mục hàng hóa rủi ro về phân loại hàng hóa (tham chiếu tại Điều 2 khoản 1 điểm g Quy trình `117/QĐ-CHQ`) | `hai-quan/so-tay-nghiep-vu` | **CÒN** hiệu lực từ `19/07/2021` (`NGUON_A` về hiệu lực; tệp nội bộ bậc C) |
| `14/2015/TT-BTC` | Hướng dẫn phân loại hàng hoá; phân tích để phân loại; phân tích kiểm tra chất lượng/ATTP | `phan-loai-hs/quy-trinh-phan-loai` | **HẾT** hiệu lực từ `15/09/2026` (`NGUON_A`), bị thay thế bởi `85/2026/TT-BTC` |
| `17/2021/TT-BTC` | Sửa đổi, bổ sung một số điều của `14/2015/TT-BTC` | `phan-loai-hs/quy-trinh-phan-loai` | **HẾT** hiệu lực từ `15/09/2026` (`NGUON_A`), bị thay thế bởi `85/2026/TT-BTC` |
| `1921/QĐ-TCHQ` | Quy trình phân loại hàng hóa, áp dụng mức thuế đối với hàng hóa XNK của Tổng cục Hải quan | `phan-loai-hs/quy-trinh-phan-loai`, `hai-quan/so-tay-nghiep-vu` | **HẾT** hiệu lực từ `01/02/2026` (`NGUON_A`), bị bãi bỏ bởi `117/QĐ-CHQ` |

## Điểm mới trong 85/2026 (so với 14/2015)

| Điều | Nội dung |
|---|---|
| Điều 4 | 5 nguyên tắc tuân thủ gồm **6 GRI WCO** — lần đầu ghi nhận trong luật nội địa |
| Điều 6.1 | Liệt kê **4 tài liệu** tra cứu khi chưa xác định được mã duy nhất: (a) Chú giải chi tiết HS WCO, (b) Tuyển tập ý kiến WCO, (c) Chú giải bổ sung AHTN, (d) CSDL VN. **Nguyên văn không quy định thứ tự ưu tiên** giữa 4 tài liệu. |
| Điều 6.2 | Mô tả VN khác HS WCO thì **áp dụng HS WCO** — mặc định ưu tiên quốc tế |
| Điều 7 | Phân loại máy liên hợp/tổ hợp máy Ch.84/85/90 theo Chú giải pháp lý 3, 4, 5 Phần XVI |
| Điều 16 | Máy liên hợp đã đăng ký Danh mục trước `15/09/2026` tiếp tục theo `14/2015/TT-BTC` (đã hết hiệu lực cho hồ sơ mới) đến khi nhập hết (chuyển tiếp) |

**Đọc đúng cặp gốc–sửa:** từ `15/09/2026`, đọc `85/2026/TT-BTC` (thay thế `14/2015/TT-BTC` + `17/2021/TT-BTC`, xem [[concepts/doc-tinh-trang-hieu-luc]]). Danh mục mã số là văn bản riêng (`31/2022/TT-BTC`), không thay thế thông tư quy trình. Quy trình nội ngành Hải quan đọc theo `117/QĐ-CHQ` và `2169/QĐ-CHQ`.

## Key sources

- [[sources/85-2026-tt-btc]] — `85/2026/TT-BTC` (`CON_HIEU_LUC` từ `15/09/2026`, `NGUON_A`), khung quy trình phân loại và phân tích để phân loại hàng hóa XNK
- [[sources/117-qd-chq]] — `117/QĐ-CHQ` (`CON_HIEU_LUC` từ `01/02/2026`, `NGUON_B` `THIEU_PDF_A`), quy trình hiện hành của Cục Hải quan về xác định trước mã số, kiểm tra trong thông quan và thống nhất phân loại toàn ngành (bãi bỏ `1921/QĐ-TCHQ`)
- [[sources/49-2010-tt-btc]] — TT `49/2010/TT-BTC`, khung "phân loại + áp dụng mức thuế" đầu tiên (**đã hết hiệu lực** từ `16/03/2015`, bị thay thế bởi `14/2015/TT-BTC` → nay là `85/2026/TT-BTC`)
- [[sources/1628-qd-tchq]] — QĐ `1628/QĐ-TCHQ`, quy chế phân tích/phân loại trước đây của ngành Hải quan (**đã hết hiệu lực** từ `09/12/2013`, bị thay thế bởi `4023/QĐ-TCHQ`)
- [[sources/1921-qd-tchq]] — QĐ `1921/QĐ-TCHQ` (`28/06/2018`), quy trình phân loại hàng hóa, áp dụng mức thuế trước đây của Tổng cục Hải quan — **đã hết hiệu lực từ `01/02/2026`**, bị bãi bỏ bởi Điều 2 khoản 2 Quyết định `117/QĐ-CHQ` (đã đối chiếu `NGUON_A` từ bản PDF ký gốc dấu đỏ 52 trang)
- `registry/van-ban/85-2026-tt-btc.yaml` (`CON_HIEU_LUC` từ `15/09/2026`, `NGUON_A`, toàn văn 23 trang Công báo)
- `registry/van-ban/117-qd-chq-2026.yaml` (`CON_HIEU_LUC` từ `01/02/2026`, `NGUON_B`, PDF ký số 28 trang; chờ URL `customs.gov.vn`)
- `registry/van-ban/2169-qd-chq-2025.yaml` (`CON_HIEU_LUC` từ `01/02/2026`, `NGUON_B`, PDF 77 trang; thay thế `2999/QĐ-TCHQ` và `2166/QĐ-TCHQ`)
- `registry/van-ban/31-2022-tt-btc.yaml` (`CON_HIEU_LUC` từ `01/12/2022`, `NGUON_A`)
- `registry/van-ban/2079-qd-tchq.yaml` (`CON_HIEU_LUC` từ `19/07/2021`, `NGUON_A` về hiệu lực)
- `registry/van-ban/14-2015-tt-btc.yaml` (`HET_HIEU_LUC` từ `15/09/2026`, `NGUON_A`, bị thay thế bởi `85/2026/TT-BTC`)
- `registry/van-ban/17-2021-tt-btc.yaml` (`HET_HIEU_LUC` từ `15/09/2026`, `NGUON_A`, bị thay thế bởi `85/2026/TT-BTC`)
- `registry/van-ban/49-2010-tt-btc.yaml` (`HET_HIEU_LUC` từ `16/03/2015`, `NGUON_A`)
- `registry/van-ban/1628-qd-tchq.yaml` (`HET_HIEU_LUC` từ `09/12/2013`, `NGUON_A`)
- `registry/van-ban/1921-qd-tchq-2018.yaml` (`HET_HIEU_LUC` từ `01/02/2026`, `NGUON_A`, bị bãi bỏ bởi `117/QĐ-CHQ`)
- Toàn văn `85/2026/TT-BTC`: `raw/download/congbaocdn.chinhphu.vn/2026/7/18/85-2026-tt-btc.pdf`

## Related concepts

- [[concepts/thu-tuc-hai-quan-xnk]] — mô tả hàng trên tờ khai gắn với mã khai.
- [[concepts/thue-gtgt-hang-nhap-khau]] — thuế suất phụ thuộc phân loại và biểu thuế.
- [[concepts/muc-do-rui-ro-hang-hoa]] — danh mục rủi ro KTCN cũng gắn mã HS theo từng bộ.
- [[concepts/mo-ta-hang-hoa-khai-bao]] — mô tả trên tờ khai là căn cứ xác định mã số (chỉ tiêu 1.78).

## Mentioned in

- [[summary/dong-bo-quan-diem-phan-loai]]

- [[summary/luat-duoc-va-phan-loai-hs]]

## Notes

- **Quan trọng**: Trước `15/09/2026`, tham chiếu `14/2015/TT-BTC` + `17/2021/TT-BTC` (nay đều đã hết hiệu lực). Từ `15/09/2026`, **chỉ tham chiếu `85/2026/TT-BTC`** (cùng `117/QĐ-CHQ` và `2169/QĐ-CHQ` từ `01/02/2026` cho quy trình ngành Hải quan).
- Hồ sơ, thời hạn xác định trước mã số (CH-08 trong `eval/cau-hoi-nghiep-vu.yaml`) dẫn chiếu theo Điều 28 Luật Hải quan `54/2014/QH13`, Điều 24 NĐ `08/2015/NĐ-CP` (sửa bởi `167/2025/NĐ-CP`), Điều 7 TT `38/2015/TT-BTC` (sửa bởi `121/2025/TT-BTC`) và Phần I Quy trình kèm `117/QĐ-CHQ`; riêng hồ sơ phân tích mẫu và thông báo KQPTPL quy định tại Điều 8–12 `85/2026/TT-BTC`.
- Nhánh `phan-loai-hs/chu-giai` và `phan-loai-hs/thong-bao-phan-loai` đang trống trên cây (theo ranh giới `docs/SO-DO-HE-THONG.md`, chú giải HS/GIR do `hs-code-api` giữ và phục vụ; `oz-wiki-plhq` không xuất `chu-giai-hs.json` hay sao chép động cơ phân loại HS).
- Hệ thống văn bản về phân loại gồm khung của **Bộ Tài chính** (`49/2010/TT-BTC` → `14/2015/TT-BTC` + `17/2021/TT-BTC` [đều đã hết hiệu lực] → **`85/2026/TT-BTC`** còn hiệu lực) và 2 nhánh quy trình của **ngành Hải quan**: (1) xác định trước mã số & kiểm tra trong thông quan (`1921/QĐ-TCHQ` [đã hết hiệu lực] → **`117/QĐ-CHQ`** còn hiệu lực từ `01/02/2026`), và (2) phân tích phân loại tại cơ quan Kiểm định (`1628/QĐ-TCHQ` → `4023/QĐ-TCHQ` → `2131/QĐ-TCHQ` → `2999/QĐ-TCHQ` & `2166/QĐ-TCHQ` [đều đã hết hiệu lực] → **`2169/QĐ-CHQ`** còn hiệu lực từ `01/02/2026`; xem [[sources/1628-qd-tchq]]).
