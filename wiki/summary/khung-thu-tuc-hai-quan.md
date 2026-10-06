---
id: khung-thu-tuc-hai-quan
title: "Khung thủ tục hải quan hàng xuất nhập khẩu"
type: summary
created: 2026-10-04
updated: 2026-10-04
covers:
  - thu-tuc-hai-quan-xnk
  - phan-loai-ma-hs
  - thue-gtgt-hang-nhap-khau
  - nhan-hang-hoa-nhap-khau
  - muc-do-rui-ro-hang-hoa
  - doc-tinh-trang-hieu-luc
tags: [hai-quan, thu-tuc, phan-loai-hs, thue]
---

## Overview

Thủ tục hải quan hàng xuất nhập khẩu nằm trên ba tầng văn bản đã có trong sổ đăng ký: **Luật Hải quan** `54/2014/QH13` (nhánh `hai-quan/luat-khung`, `CON_HIEU_LUC`); **Nghị định** `08/2015/NĐ-CP` hướng dẫn Luật về thủ tục, kiểm tra, giám sát, kiểm soát; **Thông tư** `38/2015/TT-BTC` (được `39/2018/TT-BTC` sửa đổi) quy định chi tiết thủ tục và chỉ tiêu khai. Song song, phân loại mã HS theo `14/2015/TT-BTC` (sửa bởi `17/2021/TT-BTC`) và danh mục `31/2022/TT-BTC`; thuế GTGT hàng nhập khẩu đang có chính sách giảm suất theo `174/2025/NĐ-CP` (sổ ghi hết hiệu lực dự kiến `2026-12-31`).

> Trang tổng hợp từ **metadata sổ đăng ký** (`registry/van-ban/`). Hầu hết văn bản khung hải quan/thuế trong sổ còn `hieu_luc_da_doi_chieu: false` và chưa có toàn văn trong `raw/`. Đây **không phải tư vấn pháp lý** — đối chiếu nguồn bậc A trước khi khai báo.

## Key themes

- **Tầng thủ tục** — xem [[concepts/thu-tuc-hai-quan-xnk]]. Luật → nghị định hướng dẫn → thông tư chỉ tiêu khai. Sổ ghi `39/2018/TT-BTC` sửa `38/2015/TT-BTC`; ghi chú sổ nhắc chỉ tiêu mô tả hàng hoá (mục 1.78) là căn cứ nghiệp vụ thường dùng khi mô tả trên tờ khai.
- **Phân loại mã HS** — xem [[concepts/phan-loai-ma-hs]]. Quy trình phân loại/phân tích: `14/2015/TT-BTC` + `17/2021/TT-BTC`. Danh mục hàng hoá XNK Việt Nam: `31/2022/TT-BTC` (nhánh `phan-loai-hs/danh-muc`).
- **Thuế GTGT khi nhập** — xem [[concepts/thue-gtgt-hang-nhap-khau]]. Sổ ghi `174/2025/NĐ-CP` là chính sách giảm GTGT 10% → 8%, `tinh_trang: CON_HIEU_LUC`, `het_hieu_luc_tu: 2026-12-31` — cần theo dõi văn bản gia hạn/thay thế.
- **Một cửa quốc gia sắp đổi khung** — `85/2019/NĐ-CP` (`hai-quan/mot-cua`) còn hiệu lực đến `2026-10-15`; bị `336/2026/NĐ-CP` thay thế từ cùng ngày (`tinh_trang: CHUA_CO_HIEU_LUC` tại thời điểm sổ ghi). Đọc quan hệ này theo [[concepts/doc-tinh-trang-hieu-luc]].
- **Nhãn hàng hoá là điểm mù riêng** — khung nhãn cũ (`43/2017/NĐ-CP`, `111/2021/NĐ-CP`) đã `HET_HIEU_LUC` từ `2026-01-23` theo quan hệ bãi bỏ của `37/2026/NĐ-CP` (cùng nghị định đặt [[concepts/muc-do-rui-ro-hang-hoa]]); văn bản đang điều chỉnh nhãn phụ tiếng Việt **chưa xác minh** trong sổ — xem [[concepts/nhan-hang-hoa-nhap-khau]].

## Sources covered

Chưa có trang `wiki/sources/` cho các văn bản trên (toàn văn chưa nạp). Các số hiệu dẫn trong trang này đều có tệp trong `registry/van-ban/`.

## Key concepts

- [[concepts/thu-tuc-hai-quan-xnk]]
- [[concepts/phan-loai-ma-hs]]
- [[concepts/thue-gtgt-hang-nhap-khau]]
- [[concepts/nhan-hang-hoa-nhap-khau]]
- [[concepts/muc-do-rui-ro-hang-hoa]]
- [[concepts/doc-tinh-trang-hieu-luc]]

## Open questions

- Hồ sơ hải quan hàng nhập khẩu thương mại gồm những chứng từ nào theo điều/khoản cụ thể của `08/2015/NĐ-CP` / `38/2015/TT-BTC`? (cần toàn văn)
- Xác định trước mã số: hồ sơ, thời hạn theo `14/2015/TT-BTC` (sửa `17/2021/TT-BTC`) — chưa trích điều.
- Sau `2026-10-15`, dẫn chiếu từ `37/2026/NĐ-CP` sang Điều 17 `85/2019/NĐ-CP` sẽ lạc hậu thế nào so với `336/2026/NĐ-CP`?
- Văn bản nào đang điều chỉnh nhãn phụ tiếng Việt sau khi `43/2017/NĐ-CP` hết hiệu lực?

## Notes

Trang này định hướng tra cứu theo sổ, không thay thế việc mở nguồn bậc A. Khi nạp toàn văn, ưu tiên `/lumi-ingest` cho `54/2014/QH13`, `08/2015/NĐ-CP`, `38/2015/TT-BTC`, `39/2018/TT-BTC`.
