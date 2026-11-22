---
id: khung-thu-tuc-hai-quan
title: "Khung thủ tục hải quan hàng xuất nhập khẩu"
type: summary
created: 2026-10-04
updated: 2026-11-22
covers:
  - thu-tuc-hai-quan-xnk
  - phan-loai-ma-hs
  - thue-gtgt-hang-nhap-khau
  - nhan-hang-hoa-nhap-khau
  - muc-do-rui-ro-hang-hoa
  - doc-tinh-trang-hieu-luc
  - co-quan-tiep-nhan-sau-sap-nhap
  - thu-tuc-tai-cua-khau-nhap
  - thue-chong-ban-pha-gia-thep
  - hoa-chat-tien-chat-cas-xnk
tags: [hai-quan, thu-tuc, phan-loai-hs, thue]
---

## Overview

Thủ tục hải quan hàng xuất nhập khẩu nằm trên ba tầng văn bản hiện hành đã đối chiếu nguồn bậc A trong sổ đăng ký: **Luật Hải quan** `54/2014/QH13` (`CON_HIEU_LUC`, hợp nhất tại `54/VBHN-VPQH`; sẽ được sửa đổi bởi `11/2026/QH16` từ `2027-03-01`); **Nghị định** `08/2015/NĐ-CP` (`CON_HIEU_LUC`, đã được sửa đổi, bổ sung bởi `167/2025/NĐ-CP` hiệu lực từ `2025-08-15`, bãi bỏ `59/2018/NĐ-CP`); **Thông tư** `38/2015/TT-BTC` (`CON_HIEU_LUC`, được sửa đổi, bổ sung bởi `39/2018/TT-BTC`, `60/2019/TT-BTC`, `121/2025/TT-BTC` hiệu lực từ `2026-02-01` và bãi bỏ một phần quy định miễn thuế bởi `86/2026/TT-BTC` từ `2026-07-01`). Song song, phân loại mã HS áp dụng `85/2026/TT-BTC` (hiệu lực từ `2026-09-15`, thay thế `14/2015/TT-BTC` và `17/2021/TT-BTC`), quy trình ngành Hải quan theo `117/QĐ-CHQ` (năm 2026, bãi bỏ `1921/QĐ-TCHQ`), cùng Danh mục hàng hóa XNK Việt Nam `31/2022/TT-BTC`; Cơ chế một cửa quốc gia áp dụng `336/2026/NĐ-CP` (hiệu lực từ `2026-10-15`, thay thế `85/2019/NĐ-CP`); thuế GTGT hàng nhập khẩu đang có chính sách giảm suất 10% → 8% theo `204/2025/QH15` và `174/2025/NĐ-CP` (hết hiệu lực từ `2026-12-31`).

> Trang tổng hợp dựa trên **sổ đăng ký (`registry/van-ban/`) và toàn văn đã đối chiếu**. Các văn bản khung chính của Hải quan, Một cửa, Phân loại HS và Thuế GTGT nêu trên đều đã đạt `NGUON_A` (`hieu_luc_da_doi_chieu: true`) và có bản gốc trong `raw/`; riêng một số quy trình nội ngành Hải quan (`117/QĐ-CHQ`, `2169/QĐ-CHQ`, `2123/QĐ-CHQ`) đã nạp PDF ký số nhưng còn ở mức `NGUON_B` (`hieu_luc_da_doi_chieu: false`, `chan: THIEU_PDF_A` chờ URL `customs.gov.vn`). Đây **không phải tư vấn pháp lý** — luôn đối chiếu điều khoản gốc trước khi khai báo.

## Key themes

- **Tầng thủ tục** — xem [[concepts/thu-tuc-hai-quan-xnk]]. Chuỗi hiện hành gồm `54/2014/QH13` → `08/2015/NĐ-CP` (sửa bởi `167/2025/NĐ-CP`, bãi bỏ `59/2018/NĐ-CP`) → `38/2015/TT-BTC` (sửa bởi `39/2018/TT-BTC`, `121/2025/TT-BTC`). Chỉ tiêu mô tả hàng hoá trên tờ khai nhập khẩu (mục 1.78 Mẫu 01 Phụ lục II) được cập nhật tại `121/2025/TT-BTC`. Luật `11/2026/QH16` đã thông qua `2026-08-23`, hiện `CHUA_CO_HIEU_LUC` (sẽ có hiệu lực từ `2027-03-01`).
- **Phân loại mã HS** — xem [[concepts/phan-loai-ma-hs]]. Quy trình phân loại, phân tích để phân loại hiện hành là `85/2026/TT-BTC` (`CON_HIEU_LUC` từ `2026-09-15`, thay thế toàn bộ `14/2015/TT-BTC` và `17/2021/TT-BTC` theo Điều 15 khoản 1; lưu ý chuyển tiếp cho máy liên hợp/tổ hợp máy đã đăng ký trước `2026-09-15` theo Điều 16 khoản 2). Danh mục hàng hoá XNK Việt Nam hiện hành: `31/2022/TT-BTC` (`CON_HIEU_LUC` từ `2022-12-01`). **Tiền thân** `49/2010/TT-BTC` ("Hướng dẫn việc phân loại, áp dụng mức thuế", đã `HET_HIEU_LUC` từ `2015-03-16`) đã nạp — xem [[sources/49-2010-tt-btc]].
- **Quy trình phân loại của ngành Hải quan** — nhánh quy trình nội ngành hiện hành từ `2026-02-01` là `117/QĐ-CHQ` (ban hành `2026-01-20`, hiệu lực `2026-02-01`, `CON_HIEU_LUC`, nguồn B `THIEU_PDF_A`: Quy trình Xác định trước mã số; Kiểm tra tên hàng, mô tả hàng hóa, mã số, mức thuế, đơn vị tính trong thông quan; Thống nhất công tác phân loại), **bãi bỏ** `1921/QĐ-TCHQ` (`HET_HIEU_LUC` từ `2026-02-01`). Nhánh quy chế/quy trình phân tích, kiểm định đi qua chuỗi lịch sử `1628/QĐ-TCHQ` (đã hết hiệu lực từ `2013-12-09` — xem [[sources/1628-qd-tchq]]) → `4023/QĐ-TCHQ` (đã hết hiệu lực) → `2131/QĐ-TCHQ` (đã hết hiệu lực) → `2999/QĐ-TCHQ` & `2166/QĐ-TCHQ` (đã hết hiệu lực từ `2026-02-01`) → `2169/QĐ-CHQ` (`CON_HIEU_LUC` từ `2026-02-01`, nguồn B `THIEU_PDF_A`). Quy trình kiểm tra sau thông quan hiện hành là `2123/QĐ-CHQ` (`CON_HIEU_LUC` từ `2026-02-01`, nguồn B).
- **Thuế GTGT khi nhập** — xem [[concepts/thue-gtgt-hang-nhap-khau]]. `204/2025/QH15` và `174/2025/NĐ-CP` quy định chính sách giảm thuế GTGT từ 10% → 8% đối với nhóm hàng hóa, dịch vụ chịu thuế 10% (trừ Phụ lục I và Phụ lục II), `CON_HIEU_LUC` từ `2025-07-01` và `het_hieu_luc_tu: 2026-12-31` — cần theo dõi văn bản gia hạn/thay thế cho thời gian sau `2026-12-31`.
- **Một cửa quốc gia đã đổi khung** — từ `2026-10-15`, `336/2026/NĐ-CP` (`CON_HIEU_LUC`, `NGUON_A`) thay thế toàn bộ `85/2019/NĐ-CP` (`HET_HIEU_LUC` từ `2026-10-15` theo Điều 48 khoản 2 `336/2026/NĐ-CP`). Đọc quan hệ thay thế này theo [[concepts/doc-tinh-trang-hieu-luc]].
- **Phân luồng tờ khai theo mức rủi ro** — xem [[concepts/thu-tuc-hai-quan-xnk]]. Quy định gốc là **Điều 22 TT `81/2019/TT-BTC`** (Luồng 1 Xanh / Luồng 2 Vàng / Luồng 3 Đỏ theo rủi ro thấp – trung bình – cao), sửa bởi `06/2024/TT-BTC` từ `2024-03-15` — xem [[sources/81-2019-tt-btc]] và [[sources/06-2024-tt-btc]].
- **Cơ quan tiếp nhận sau sáp nhập** — xem [[concepts/co-quan-tiep-nhan-sau-sap-nhap]]. Ánh xạ 5 nhóm cơ quan kế thừa (`BNNPTNT`/`BTNMT`→`BNNMT`, `BTTTT`→`BKHCN`, `BGTVT`→`BXD`, `BLĐTBXH`→`BNV`, `TCHQ`→`CHQ`) để tra đúng ký hiệu cơ quan ban hành văn bản mới và nơi nộp hồ sơ.
- **Nhãn hàng hoá là điểm mù riêng** — khung nhãn cũ (`43/2017/NĐ-CP`, `111/2021/NĐ-CP`) đã `HET_HIEU_LUC` từ `2026-01-23` theo quan hệ bãi bỏ của `37/2026/NĐ-CP` (cùng nghị định đặt [[concepts/muc-do-rui-ro-hang-hoa]]); văn bản đang điều chỉnh nhãn phụ tiếng Việt **chưa xác minh** trong sổ — xem [[concepts/nhan-hang-hoa-nhap-khau]].
- **Làm thủ tục tại cửa khẩu nhập** — xem [[concepts/thu-tuc-tai-cua-khau-nhap]]. Danh mục 12 nhóm hàng nhập khẩu phải làm thủ tục hải quan tại cửa khẩu nhập từ `14/08/2026` áp dụng theo `31/2026/QĐ-TTg` (`CON_HIEU_LUC`, `NGUON_A`, trên nền Điều 4 `08/2015/NĐ-CP` sửa bởi `167/2025/NĐ-CP`), thay thế `23/2019/QĐ-TTg` (**đã hết hiệu lực** từ `14/08/2026`).
- **Thuế chống bán phá giá thép** — xem [[concepts/thue-chong-ban-pha-gia-thep]]. Khung phòng vệ thương mại hiện hành gồm Luật `05/2017/QH14` và Nghị định `86/2025/NĐ-CP` (`CON_HIEU_LUC` từ `01/07/2025`, thay thế `10/2018/NĐ-CP` **đã hết hiệu lực**), cùng 07 quyết định thép còn hiệu lực (`143/QĐ-BCT`, `1959/QĐ-BCT`, `2310/QĐ-BCT`, `2822/QĐ-BCT`, `3011/QĐ-BCT`, `3765/QĐ-BCT`, `3176/QĐ-BCT`); tách bạch với các quyết định **đã hết hiệu lực** (`691/QĐ-BCT`, `693/QĐ-BCT`, `1975/QĐ-BCT`).
- **Hóa chất, tiền chất Danh mục IV & hàng nguy hiểm XNK** — xem [[concepts/hoa-chat-tien-chat-cas-xnk]] (`24/2026/NĐ-CP`, `28/2026/NĐ-CP`, `33/2024/NĐ-CP`, `34/2024/NĐ-CP`, `73/2021/QH14`).
- **Theo dõi văn bản mức Cao sắp hết hiệu lực 31/12/2026 & 01/01/2027** — xem [[summary/van-ban-sap-het-hieu-luc-2026-2027]] (gồm giảm GTGT 8% `204/2025/QH15` + `174/2025/NĐ-CP`, xăng dầu `72/2026/NĐ-CP` + `43/2026/NQ-CP`, CNTT cũ `11/2018/TT-BTTTT`, BCT `08/2023/TT-BCT` + `12/2018/TT-BCT`, BQP `173/2018/TT-BQP`).

## Sources covered

Đã có trang `wiki/sources/` cho: `54/2014/QH13` → [[sources/54-vbhn-vpqh]], `08/2015/NĐ-CP` → [[sources/08-2015-nd-cp]], `38/2015/TT-BTC` → [[sources/38-2015-tt-btc]], `39/2018/TT-BTC` → [[sources/39-2018-tt-btc]], `85/2026/TT-BTC` → [[sources/85-2026-tt-btc]], `121/2025/TT-BTC` → [[sources/121-2025-tt-btc]], `11/2026/QH16` → [[sources/11-2026-qh16]], `31/2026/QĐ-TTg` → [[sources/31-2026-qd-ttg]], `124/2026/TT-BTC` → [[sources/124-2026-tt-btc]], `143/2026/NĐ-CP` → [[sources/143-2026-nd-cp]], `186/2026/NĐ-CP` → [[sources/186-2026-nd-cp]], `19/2026/QH16` → [[sources/19-2026-qh16]], cùng 4 văn bản lịch sử/quản lý rủi ro: [[sources/49-2010-tt-btc]], [[sources/1628-qd-tchq]], [[sources/81-2019-tt-btc]] và [[sources/06-2024-tt-btc]]. Ngoài ra trong `wiki/sources/` còn có trang riêng cho `167/2025/NĐ-CP`, `60/2019/TT-BTC`, `117/QĐ-CHQ`, `1921/QĐ-TCHQ`, `2123/QĐ-CHQ`, `174/2025/NĐ-CP`, `204/2025/QH15`, `37/2026/NĐ-CP`.

Các số hiệu khác dẫn trong trang này đều có tệp trong `registry/van-ban/` nhưng **chưa có trang wiki**: `31/2022/TT-BTC`, `336/2026/NĐ-CP`, `2169/QĐ-CHQ`, `86/2026/TT-BTC`, cùng các văn bản đã hết hiệu lực `14/2015/TT-BTC`, `17/2021/TT-BTC`, `85/2019/NĐ-CP`, `4023/QĐ-TCHQ`, `2131/QĐ-TCHQ`, `2999/QĐ-TCHQ`, `2166/QĐ-TCHQ`.

## Key concepts

- [[concepts/thu-tuc-hai-quan-xnk]]
- [[concepts/phan-loai-ma-hs]]
- [[concepts/thue-gtgt-hang-nhap-khau]]
- [[concepts/nhan-hang-hoa-nhap-khau]]
- [[concepts/muc-do-rui-ro-hang-hoa]]
- [[concepts/doc-tinh-trang-hieu-luc]]
- [[concepts/co-quan-tiep-nhan-sau-sap-nhap]]
- [[concepts/thu-tuc-tai-cua-khau-nhap]]
- [[concepts/thue-chong-ban-pha-gia-thep]]
- [[concepts/hoa-chat-tien-chat-cas-xnk]]

## Open questions

- Sau mốc `2026-10-15`, cần trích điều khoản `336/2026/NĐ-CP` và đối chiếu tác động đối với dẫn chiếu Điều 17 `85/2019/NĐ-CP` (đã hết hiệu lực) trong `37/2026/NĐ-CP`.
- Cần trích `xac_minh.dieu_khoan` (nguyên văn bậc A) cho các văn bản khung đã có `NGUON_A` như `54/2014/QH13`, `08/2015/NĐ-CP`, `167/2025/NĐ-CP`, `38/2015/TT-BTC`, `39/2018/TT-BTC`, `121/2025/TT-BTC`, `336/2026/NĐ-CP`, `174/2025/NĐ-CP`.
- Chờ `customs.gov.vn` mở truy cập tự động để gắn URL bậc A và nâng `117/QĐ-CHQ`, `2169/QĐ-CHQ`, `2123/QĐ-CHQ` từ `NGUON_B` lên `NGUON_A`.
- Theo dõi văn bản mới sau `2026-12-31` khi `174/2025/NĐ-CP` và `204/2025/QH15` hết thời hạn giảm thuế GTGT 8%.
- Văn bản nào đang điều chỉnh nhãn phụ tiếng Việt sau khi `43/2017/NĐ-CP` và `111/2021/NĐ-CP` hết hiệu lực từ `2026-01-23`?
- Xác minh văn bản gốc quy định mốc chuyển đổi và thẩm quyền `TCHQ` → `CHQ`.

## Notes

Trang này định hướng tra cứu theo sổ đăng ký và wiki, không thay thế việc mở văn bản nguồn bậc A. Lưu ý: `336/2026/NĐ-CP`, `31/2022/TT-BTC`, `86/2026/TT-BTC`, `2169/QĐ-CHQ` hiện mới có hồ sơ trong `registry/van-ban/` và toàn văn `raw/`, chưa có trang riêng trong `wiki/sources/`.
