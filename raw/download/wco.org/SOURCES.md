# WCO Compendium of Classification Opinions — Sources

**Mục đích:** Theo TT 85/2026/TT-BTC Điều 6.1(b), Tuyển tập ý kiến phân loại của WCO là nguồn ưu tiên thứ 2 khi không xác định được mã HS.

## Trạng thái: ❌ CHƯA CÓ FILE (trả phí)

WCO Compendium of Classification Opinions là **tài liệu chính thức của WCO** (World Customs Organization), xuất bản dưới dạng PDF, **có bản quyền và bán qua WCO Bookshop** (https://www.wcoomdpublications.org).

## Thông tin về tài liệu

| Mục | Giá trị |
|---|---|
| Phiên bản hiện tại | HS Committee 77th Session (2025) |
| Tần suất cập nhật | 2 lần/năm (Sau mỗi phiên HS Committee — tháng 3, tháng 10) |
| Số lượng Classification Opinions | ~6.500 opinions tích lũy (từ 1995 đến nay) |
| Giá bán | ~500-800 EUR / bộ đầy đủ (WCO Bookshop) |
| Bản dùng thử miễn phí | Chỉ vài opinion mới nhất (công bố tại wcoomd.org) |

## Nguồn miễn phí thay thế (một phần)

| Nguồn | URL | Nội dung |
|---|---|---|
| WCO Classification Opinions (trang chính thức) | https://www.wcoomd.org/en/topics/nomenclature/instrument-and-tools/tools-to-assist-with-the-classification-in-the-hs/hs_classification-decisions/classification-decisions.aspx | Opinions mới nhất + Amendments HS Committee 77th (PDF công khai) |
| WCO Compendium Excerpts (Scribd) | https://www.scribd.com/document/743584452/ophs73en | Một phần Compendium 73rd Session (bản upload không chính thức) |
| HS Nomenclature 2022 PDF | https://www.wcoomd.org/en/topics/nomenclature/instrument-and-tools/hs-nomenclature-2022-edition.aspx | Miễn phí (PDF toàn văn) |

## Hướng xử lý (chờ Sếp chỉ định)

1. **Cách 1 (khả thi):** Tải từng Classification Opinion mới nhất từ WCO (mỗi session ~50 opinions) → tự build corpus nhỏ
2. **Cách 2 (chờ):** Sếp mua Compendium chính thức → OCR/PDF to text
3. **Cách 3 (thực tế):** Dùng TB-TCHQ (Thông báo kết quả phân loại từ HQVN) làm "Compendium VN" — cùng bản chất (classification opinions của cơ quan hải quan)
4. **Cách 4:** Tạm thời KHÔNG có — chấp nhận hạn chế này, ghi vào `bao-cao/diem-mu.md` để team xử lý sau

## File cần tạo

- ❌ `raw/download/wco.org/compendium-classification-opinions-77.pdf` (chưa tải được — trả phí)
- ❌ `raw/download/wco.org/classification-decisions-77-amendments.pdf` (tải được, chưa tải)
- ✅ `raw/download/wco.org/SOURCES.md` (file này)

## Tạm thời: dùng nguồn thay thế

| Cần thông tin | Tạm dùng file |
|---|---|
| Mã 6 số WCO + Explanatory Notes | `hs-code-api/data/wco-hs-international.csv` + `explanatory-notes.json` |
| Tiền lệ phân loại VN | TB-TCHQ LV=313 trong `oz-wiki/data/customs/processed/all-LV313.csv` (~2.122 records) |
| Ý kiến phân loại (cơ quan HQ) | `oz-wiki-plhq/registry/van-ban/*.yaml` (chính sách thay thế qua các TT) |
