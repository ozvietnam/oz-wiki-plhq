---
id: van-ban-sap-het-hieu-luc-2026-2027
title: "Cẩm nang hành động: 8 văn bản sắp hết hiệu lực & 5 văn bản sắp có hiệu lực 2026 – 2027"
type: summary
created: 2026-11-22
updated: 2026-11-25
covers:
  - thue-gtgt-hang-nhap-khau
  - hang-cu-cam-nhap-khau
  - doc-tinh-trang-hieu-luc
  - co-quan-tiep-nhan-sau-sap-nhap
  - hoa-chat-tien-chat-cas-xnk
tags:
  - sap-het-hieu-luc
  - sap-co-hieu-luc
  - 2026
  - 2027
  - thue-gtgt
  - xang-dau
  - hang-da-qua-su-dung
  - quoc-phong
  - mcp
---

## Overview

Tính từ ngày `22/11/2026`, báo cáo điểm mù (`SAP_HET_HIEU_LUC` trong ngưỡng `60` ngày) ghi nhận đúng **8 văn bản mức Cao** có ngày hết hiệu lực rơi vào **`2026-12-31`** (7 văn bản) và **`2027-01-01`** (1 văn bản): `204/2025/QH15`, `174/2025/NĐ-CP`, `43/2026/NQ-CP`, `72/2026/NĐ-CP`, `11/2018/TT-BTTTT`, `12/2018/TT-BCT`, `08/2023/TT-BCT` và `173/2018/TT-BQP`. Toàn bộ 8/8 văn bản đều đã đạt mức xác minh `NGUON_A` (`hieu_luc_da_doi_chieu: true`) trong `registry/van-ban/`. Ở chiều ngược lại (`SAP_CO_HIEU_LUC`), từ ngày **`01/01/2027`** có **3 văn bản mới** chính thức có hiệu lực thi hành đã được nạp toàn văn và tổng hợp tại `wiki/sources/`: [[sources/154-2026-tt-btc]], [[sources/372-2026-nd-cp]] và [[sources/63-2026-tt-bkhcn]].

Về bức tranh thay thế: **chỉ có `11/2018/TT-BTTTT` đã có văn bản thay thế rõ ràng** (`63/2026/TT-BKHCN`, hiệu lực từ `01/01/2027`); **7 văn bản còn lại (hoặc phần chuyển tiếp thiết bị y tế cũ) hiện chưa có văn bản gia hạn hoặc thay thế trong sổ** — tạo thành vùng rủi ro trực tiếp cho tờ khai hải quan, hợp đồng giao nhận chuyển giao năm và câu trả lời tự động trên Cổng MCP.

> **Ranh giới tuyệt đối với `hs-code-api` (0% trùng lặp) & miễn trừ:** Cẩm nang này chỉ tổng hợp tình trạng hiệu lực, mốc chuyển tiếp, điểm mù văn bản và quy tắc hành động cho doanh nghiệp XNK cùng Cổng MCP (`ozplugin`). Wiki **không** áp mã HS và **không** tính thuế suất GTGT/MFN/BVMT/TTĐB theo tờ khai — việc tra cứu biểu thuế và tính thuế theo ngày đăng ký tờ khai thuộc `hs-code-api`. Tài liệu mang tính tham khảo, **không phải tư vấn pháp lý**; luôn đối chiếu văn bản gốc nguồn bậc A khi lập hồ sơ thông quan.

## Key themes

### 1. Bảng đối chiếu 8 văn bản mức Cao sắp hết hiệu lực (`31/12/2026` & `01/01/2027`)

Số liệu đối chiếu trực tiếp từ từng tệp YAML trong `registry/van-ban/` tại ngày `22/11/2026`:

| Số hiệu | Cơ quan | Tình trạng (`tinh_trang`) | Hiệu lực từ | Hết hiệu lực từ | Xác minh | Văn bản kế nhiệm / trạng thái thay thế hiện tại |
|---|---|---|---|---|---|---|
| `204/2025/QH15` | `QH` | `CON_HIEU_LUC` | `2025-07-01` | `2026-12-31` | `NGUON_A` (`hieu_luc_da_doi_chieu: true`) | **Chưa ban hành** NQ Quốc hội mới kéo dài giảm thuế GTGT sang 2027 |
| `174/2025/NĐ-CP` | `CP` | `CON_HIEU_LUC` | `2025-07-01` | `2026-12-31` | `NGUON_A` (`hieu_luc_da_doi_chieu: true`) | **Chưa ban hành** NĐ/NQ kéo dài (hết `31/12/2026` theo Điều 2 khoản 1) |
| `43/2026/NQ-CP` | `CP` | `CON_HIEU_LUC` | `2026-10-01` | `2026-12-31` | `NGUON_A` (`hieu_luc_da_doi_chieu: true`) | **Chưa ban hành** NQ Chính phủ kéo dài ưu đãi thuế xăng dầu sang 2027 |
| `72/2026/NĐ-CP` | `CP` | `CON_HIEU_LUC` | `2026-03-09` | `2027-01-01` | `NGUON_A` (`hieu_luc_da_doi_chieu: true`) | **Chưa có** gia hạn mới sau hạn `43/2026/NQ-CP`; hết hạn thì thuế MFN quay về `26/2023/NĐ-CP` |
| `11/2018/TT-BTTTT` | `BTTTT` | `CON_HIEU_LUC` | `2018-11-30` | `2026-12-31` | `NGUON_A` (`hieu_luc_da_doi_chieu: true`) | **ĐÃ CÓ** `63/2026/TT-BKHCN` (`CHUA_CO_HIEU_LUC`, thay thế từ `2027-01-01`) |
| `12/2018/TT-BCT` | `BCT` | `HET_HIEU_LUC_MOT_PHAN` | `2018-06-15` | `2026-12-31` | `NGUON_A` (`hieu_luc_da_doi_chieu: true`) | Khung chính đã bị `48/2026/TT-BCT` bãi bỏ từ `05/09/2026`; riêng PL I (thiết bị y tế cũ) chuyển tiếp hết `31/12/2026`, **chưa có TT mới thay phần này** |
| `08/2023/TT-BCT` | `BCT` | `HET_HIEU_LUC_MOT_PHAN` | `2023-05-16` | `2026-12-31` | `NGUON_A` (`hieu_luc_da_doi_chieu: true`) | Khoản 1 Đ1 & PL I bị `48/2026/TT-BCT` bãi từ `05/09/2026` (trừ TB y tế cũ chuyển tiếp hết `31/12/2026`, **chưa có TT thay riêng**); **PL II–V vẫn còn hiệu lực** |
| `173/2018/TT-BQP` | `BQP` | `CON_HIEU_LUC` | `2019-01-01` | `2026-12-31` | `NGUON_A` (`hieu_luc_da_doi_chieu: true`) | Chuyển tiếp hết `31/12/2026` theo Đ64 khoản 4 `292/2026/NĐ-CP`; **chưa có TT-BQP mới thay thế** danh mục cấm theo mã HS |

### 2. Nhóm chính sách giảm thuế GTGT 8% (`204/2025/QH15` + `174/2025/NĐ-CP`)

- **Cấu trúc hiệu lực:** `204/2025/QH15` (`CON_HIEU_LUC`, ban hành `17/06/2025`, hiệu lực `01/07/2025 – 31/12/2026`) là nghị quyết gốc của Quốc hội; `174/2025/NĐ-CP` (`CON_HIEU_LUC`, ban hành `30/06/2025`, hiệu lực `01/07/2025 – 31/12/2026`) hướng dẫn thi hành, quy định giảm thuế GTGT từ `10%` xuống `8%` thống nhất ở các khâu nhập khẩu, sản xuất, gia công, kinh doanh thương mại (xem [[concepts/thue-gtgt-hang-nhap-khau]] và [[sources/174-2025-nd-cp]]).
- **Phạm vi loại trừ hiện hành:** Không áp dụng cho hàng hóa/dịch vụ thuộc **Phụ lục I** (viễn thông, tài chính, ngân hàng, chứng khoán, bảo hiểm, bất động sản, kim loại, sản phẩm khai khoáng...) và **Phụ lục II** (hàng chịu thuế TTĐB, **trừ xăng** được hưởng giảm 8%); hàng đã thuộc diện không chịu thuế hoặc thuế suất `5%` thực hiện theo Luật Thuế GTGT hiện hành (`181/2025/NĐ-CP`).
- **Tác động thời điểm đăng ký tờ khai:** Theo Điều 15 khoản 2 `181/2025/NĐ-CP`, thời điểm xác định thuế GTGT đối với hàng hóa nhập khẩu là **thời điểm xác định thuế nhập khẩu** (ngày đăng ký tờ khai hải quan). Tờ khai đăng ký đến hết `31/12/2026` áp dụng chính sách của `204/2025/QH15` và `174/2025/NĐ-CP`; từ `01/01/2027`, nếu Quốc hội/Chính phủ chưa ban hành văn bản gia hạn mới thì chính sách giảm 2% mặc định kết thúc (quay về `10%` theo quy định chung).
- **Điểm mù trung thực (cập nhật đến `25/11/2026`):** Trên nguồn bậc A đến `25/11/2026`, **chưa có** Nghị quyết Quốc hội hoặc Nghị định mới ban hành kéo dài giảm thuế GTGT 8% sang năm 2027 (việc Chính phủ giao Bộ Tài chính nghiên cứu phương án chính sách thuế hết hiệu lực từ `01/01/2027` chưa phải văn bản quy phạm kéo dài hiệu lực). Doanh nghiệp và Cổng MCP cần theo dõi sát Công báo cuối tháng 11–12/2026 và không tự khẳng định mức `8%` cho lô hàng mở tờ khai từ `01/01/2027`.

### 3. Nhóm ưu đãi thuế xăng, dầu & nguyên liệu (`72/2026/NĐ-CP` + `43/2026/NQ-CP` + `19/2026/QH16`)

Chính sách thuế đối với xăng, dầu và nhiên liệu bay cuối năm 2026 nằm trên **hai lớp kéo dài đan xen**:

1. **Lớp thuế nhập khẩu ưu đãi (MFN) — `72/2026/NĐ-CP` (`het_hieu_luc_tu: 2027-01-01`):**
   - `72/2026/NĐ-CP` (`CON_HIEU_LUC`, ban hành và hiệu lực từ `09/03/2026`) sửa đổi thuế suất MFN cho **68 dòng mã HS 8 số** thuộc 4 nhóm `27.07`, `27.09`, `27.10`, `29.02` tại Phụ lục II `26/2023/NĐ-CP` (đưa về `0%` với xăng động cơ không pha chì RON 90–97+ nhóm `2710.12.21/22/24/25`, diesel, dầu nhiên liệu, nhiên liệu phản lực, condensate, naphtha/reformate... — xem [[sources/72-2026-nd-cp]]).
   - Hiệu lực ban đầu theo Điều 2 khoản 1 chỉ đến `30/04/2026`, được Chính phủ gia hạn qua các nghị quyết và **lần gần nhất kéo dài đến hết ngày `31/12/2026` theo Điều 1 `43/2026/NQ-CP`** (`het_hieu_luc_tu: 2027-01-01` trên sổ của `72/2026/NĐ-CP` đánh dấu mốc chuyển trạng thái sau ngày `31/12/2026`).
   - **Hệ quả nếu hết hạn:** Theo đúng câu chữ Điều 2 khoản 1 `72/2026/NĐ-CP`, sau khi hết hiệu lực mà chưa có Nghị quyết Chính phủ mới kéo dài theo cơ chế khoản 2 Điều 2 (Bộ Công Thương đề xuất, Bộ Tài chính trình Chính phủ), thuế suất MFN của 68 dòng mã HS này **tự động thực hiện trở lại theo `26/2023/NĐ-CP`**.
2. **Lớp thuế BVMT & GTGT xăng dầu — `43/2026/NQ-CP` (`het_hieu_luc_tu: 2026-12-31`) sửa đổi thời hạn của `19/2026/QH16`:**
   - Điều 2 `43/2026/NQ-CP` (`CON_HIEU_LUC`, hiệu lực `01/10/2026 – 31/12/2026`) kéo dài đến hết `31/12/2026` việc áp dụng **Điều 1** (thuế bảo vệ môi trường `0 đồng/lít` đối với xăng trừ etanol, dầu diesel, dầu hỏa, dầu mazut và nhiên liệu bay) và **Điều 2** (thuộc đối tượng không phải kê khai, tính nộp thuế GTGT nhưng được khấu trừ thuế GTGT đầu vào) của Nghị quyết `19/2026/QH16`.
   - **Tách bạch với thuế TTĐB:** `43/2026/NQ-CP` Điều 3 khoản 2 chỉ kéo dài Điều 1 và Điều 2 của `19/2026/QH16`, **không** kéo dài Điều 3 (thuế TTĐB `0%` đối với xăng các loại), mà dẫn về Luật Thuế TTĐB `66/2025/QH15` và các văn bản hướng dẫn thi hành (trước khi có nghị quyết mới của Chính phủ nếu có).
- **Điểm mù trung thực (cập nhật đến `25/11/2026`):** Đến `25/11/2026`, trên nguồn bậc A **chưa có** Nghị quyết Chính phủ mới kéo dài hiệu lực của `72/2026/NĐ-CP` (thuế MFN) và Điều 1–2 `19/2026/QH16` (BVMT `0` đồng & miễn kê khai GTGT) qua mốc `31/12/2026` (mặc định hết hạn quay về biểu thuế MFN `26/2023/NĐ-CP` và mức BVMT chuẩn nếu không có gia hạn mới). Lưu ý phụ trợ: `80/2023/NĐ-CP` (`CON_HIEU_LUC`, sửa đổi, bổ sung một số điều của `83/2014/NĐ-CP` và `95/2021/NĐ-CP` đều đang `CON_HIEU_LUC`) vẫn còn hiệu lực ổn định về điều kiện đầu mối/phân phối và nhập khẩu phụ gia nhiên liệu.

### 4. Nhóm hàng đã qua sử dụng & chuyển tiếp theo `292/2026/NĐ-CP` (`11/2018/TT-BTTTT`, `12/2018/TT-BCT`, `08/2023/TT-BCT`)

Theo Điều 64 khoản 4 `292/2026/NĐ-CP` (hiệu lực từ `05/09/2026`, thay thế văn bản lịch sử đã hết hiệu lực `69/2018/NĐ-CP`), các thông tư đang có hiệu lực hướng dẫn `69/2018/NĐ-CP` chỉ được tiếp tục thực hiện **đến hết ngày `31/12/2026`**:

- **Sản phẩm CNTT / công nghệ số đã qua sử dụng (`11/2018/TT-BTTTT` → `63/2026/TT-BKHCN`):**
  - `11/2018/TT-BTTTT` (`CON_HIEU_LUC` đến hết `2026-12-31`, [[sources/11-2018-tt-btttt]]) hiện điều chỉnh Danh mục sản phẩm CNTT đã qua sử dụng cấm nhập khẩu (`danh-muc/11-2018-tt-btttt.csv`, 38 dòng lá, `da_doi_chieu: true` / `186` mã HS biểu thuế).
  - Sau hợp nhất `BTTTT` → `BKHCN` ([[concepts/co-quan-tiep-nhan-sau-sap-nhap]]), Bộ KH&CN đã ban hành **`63/2026/TT-BKHCN`** (`CHUA_CO_HIEU_LUC`, hiệu lực từ `2027-01-01`, `NGUON_A`). Kể từ `01/01/2027`, thông tư mới này sẽ thay thế toàn bộ `11/2018/TT-BTTTT` (trừ chuyển tiếp giấy phép đã cấp theo Điều 3 khoản 3). `danh-muc/63-2026-tt-bkhcn.csv` gồm **37 dòng lá** (8 mã nhóm `8443`, 11 nhóm 4 số, 18 mã nhóm `8544`), đã bỏ mã `8443.32.49` theo `31/2022/TT-BTC` và bỏ 2 dòng tiêu đề cha `8443`/`8544`.
  - Lưu ý phạm vi: quy định này tách biệt với thông tư cấp phép sản phẩm an toàn thông tin mạng (`10/2022/TT-BTTTT`, `CON_HIEU_LUC`) và sửa đổi danh mục in/xuất bản phẩm/CNTT (`11/2024/TT-BTTTT`, `CON_HIEU_LUC`).
- **Hàng tiêu dùng, phương tiện & thiết bị y tế đã qua sử dụng (`12/2018/TT-BCT` & `08/2023/TT-BCT`):**
  - Cả `12/2018/TT-BCT` và `08/2023/TT-BCT` đều ở trạng thái **`HET_HIEU_LUC_MOT_PHAN`**, không phải `CON_HIEU_LUC` nguyên vẹn và cũng chưa `HET_HIEU_LUC` toàn phần!
  - Cụ thể: từ `05/09/2026`, [[sources/48-2026-tt-bct]] (`48/2026/TT-BCT`) Điều 20 bãi bỏ toàn bộ `12/2018/TT-BCT` và bãi bỏ **khoản 1 Điều 1 + Phụ lục I** của `08/2023/TT-BCT` (chuyển hàng tiêu dùng và phương tiện đã qua sử dụng cấm nhập khẩu sang Phụ lục I, II của `48/2026/TT-BCT` — xem [[concepts/hang-cu-cam-nhap-khau]]).
  - Tuy nhiên, Điều 21 khoản 3 `48/2026/TT-BCT` cho phép **Danh mục thiết bị y tế đã qua sử dụng cấm nhập khẩu** (Mục III Phụ lục I `12/2018/TT-BCT` sửa đổi bởi Phụ lục I `08/2023/TT-BCT`, gồm 5 nhóm `9018`–`9022`) tiếp tục thực hiện **đến hết `31/12/2026`**.
  - **Cảnh báo dễ nhầm đối với `08/2023/TT-BCT` ([[sources/08-2023-tt-bct]]):** Khoản 2 Điều 1 (**Phụ lục II** — tạm ngừng kinh doanh tạm nhập, tái xuất, chuyển khẩu) và Điều 2 (**Phụ lục III, IV, V** sửa đổi `41/2019/TT-BCT` về thóc gạo xuất khẩu, nguyên liệu/giấy thuốc lá, máy móc thiết bị chuyên ngành thuốc lá) **vẫn còn hiệu lực** và **không** hết hiệu lực vào `31/12/2026`.
  - **Điểm mù trung thực phần thiết bị y tế cũ:** Theo Phụ lục I Mục II `292/2026/NĐ-CP`, thẩm quyền quản lý `"Thiết bị y tế đã qua sử dụng"` thuộc **Bộ Y tế** (trong khi `07/2023/NĐ-CP` sửa đổi `98/2021/NĐ-CP` tại Điều 46 khoản 6 lại dẫn chiếu về pháp luật quản lý ngoại thương). Đến `24/11/2026`, **chưa có** Thông tư mới của Bộ Công Thương hay Bộ Y tế trong sổ ban hành danh mục mã HS thay thế riêng cho Mục III Phụ lục I sau `31/12/2026`. Bảng `danh-muc/08-2023-tt-bct.csv` (`427` dòng lá) đã hoàn tất đối chiếu người thứ hai (`da_doi_chieu: true`), tách rõ `dieu_kien` giữa Mục I–II đã hết hiệu lực từ `05/09/2026` với Mục III (`9018`–`9022`) còn chuyển tiếp đến hết `31/12/2026` và Phụ lục II–V còn hiệu lực.

### 5. Hàng hóa cấm XK/NK chuyên ngành Quốc phòng (`173/2018/TT-BQP`) & mốc chuyển tiếp `31/12/2026` khác

- **`173/2018/TT-BQP` (`CON_HIEU_LUC`, `2019-01-01` → `het_hieu_luc_tu: 2026-12-31`):** Ban hành 24 mục hàng hóa cấm xuất khẩu, cấm nhập khẩu thuộc diện quản lý chuyên ngành Bộ Quốc phòng (thay thế văn bản lịch sử đã hết hiệu lực `40/2017/TT-BQP`), gồm 12 mục có mã HS trích tại `danh-muc/173-2018-tt-bqp.csv` (phủ `41` mã HS trong biểu thuế, `da_doi_chieu: true`) và 12 mục không gắn mã HS.
  - **Vì sao hết hạn `31/12/2026`:** `173/2018/TT-BQP` hướng dẫn văn bản lịch sử đã hết hiệu lực `69/2018/NĐ-CP`, nên chỉ còn hiệu lực chuyển tiếp đến hết `31/12/2026` theo Điều 64 khoản 4 `292/2026/NĐ-CP`. Trong khi đó, Điều 9 khoản 1 `292/2026/NĐ-CP` giao Bộ trưởng Bộ Quốc phòng quyết định danh mục hàng hóa XNK phục vụ quốc phòng, an ninh và cấp phép XNK.
  - **Điểm mù trung thực cần nêu rõ (cập nhật đến `25/11/2026`):** (1) Đến `25/11/2026`, **chưa có** Thông tư BQP mới trên nguồn bậc A thay thế danh mục hàng hóa cấm XK/NK của `173/2018/TT-BQP` (lưu ý `126/2026/TT-BQP` là danh mục sản phẩm, hàng hóa có khả năng gây mất an toàn phục vụ KTCN, không thay thế `173/2018/TT-BQP`); (2) PDF gốc `173-2018-tt-bqp.pdf` đã được OCR, trích nguyên văn Điều 1, Điều 2, Điều 3 vào `xac_minh.dieu_khoan` và bảng `danh-muc/173-2018-tt-bqp.csv` (12 mục có mã HS) đã hoàn tất đối chiếu người thứ hai (`da_doi_chieu: true`).
- **Các mốc chuyển tiếp `31/12/2026` liên quan về hóa chất, tiền chất & hạn ngạch:**
  - Về hóa chất và tiền chất (xem chi tiết tại [[concepts/hoa-chat-tien-chat-cas-xnk]]): **trước ngày `31/12/2026`**, doanh nghiệp kinh doanh/sử dụng hợp pháp **1,4-Butanediol (`BDO`, CAS `110-63-4`)** phải tuân thủ quy định quản lý tiền chất theo Điều 3 khoản 4 `28/2026/NĐ-CP`; các cơ sở có hóa chất mới thuộc diện kiểm soát đặc biệt/có điều kiện và lập Kế hoạch ứng phó sự cố hóa chất cũng có mốc hoàn tất trước `31/12/2026` theo Điều 30 khoản 3, 4, 7 `26/2026/NĐ-CP` và Điều 40 khoản 2 `25/2026/NĐ-CP`.
  - Về hạn ngạch thuế quan theo cam kết song phương trong Phụ lục IV `48/2026/TT-BCT`: các mục **XIII** (Việt Nam – Campuchia), **XIV** (Nghị định thư Việt Nam – Nga) và **XV** (Nghị định thư Việt Nam – Bê-la-rút) đều có mốc hiệu lực ghi đến `31/12/2026`.

### 6. Checklist rà soát trước `31/12/2026` cho doanh nghiệp XNK & Quy tắc vận hành cho Cổng MCP

#### Checklist hành động cho doanh nghiệp XNK (trước `31/12/2026`)

- [ ] **1. Chốt lịch mở tờ khai & điều khoản giá hợp đồng đối với hàng chịu thuế GTGT 8% (`204/2025/QH15`, `174/2025/NĐ-CP`):** Rà soát lô hàng dự kiến cập cảng cuối tháng 12/2026 – đầu tháng 01/2027; hoàn tất mở tờ khai trước `24:00` ngày `31/12/2026` nếu đủ điều kiện thông quan hợp pháp, đồng thời lập dự phòng chi phí dòng tiền thuế GTGT `10%` cho tờ khai từ `01/01/2027` nếu chưa có nghị quyết gia hạn mới.
- [ ] **2. Kiểm tra lô xăng dầu, condensate, hydrocarbon thơm (`72/2026/NĐ-CP`, `43/2026/NQ-CP`, `19/2026/QH16`):** Rà soát toàn bộ tờ khai nhóm `27.07`, `27.09`, `27.10`, `29.02` và nhiên liệu bay; chuẩn bị kịch bản thuế MFN quay về `26/2023/NĐ-CP`, chấm dứt mức BVMT `0` đồng/lít và hết cơ chế không kê khai/tính nộp GTGT từ `01/01/2027` trừ khi Chính phủ ban hành Nghị quyết gia hạn mới trong tháng 12/2026.
- [ ] **3. Cập nhật bộ lọc máy móc, thiết bị CNTT/công nghệ số đã qua sử dụng (`11/2018/TT-BTTTT` → `63/2026/TT-BKHCN`):** Từ `01/01/2027`, chuyển hoàn toàn sang `63/2026/TT-BKHCN` (cơ quan ban hành kế thừa là `BKHCN`); kiểm tra giấy phép đã cấp trước `01/01/2027` theo điều khoản chuyển tiếp (Điều 3 khoản 3 `63/2026/TT-BKHCN`) và cập nhật mã HS biểu thuế hiện hành `31/2022/TT-BTC` (bỏ `8443.32.49`).
- [ ] **4. Tách biệt phần hết hạn vs phần còn hiệu lực của `12/2018/TT-BCT` & `08/2023/TT-BCT`:** Với thiết bị y tế đã qua sử dụng nhóm `9018`–`9022`, theo dõi thông báo/văn bản mới của Bộ Y tế và Bộ Công Thương cho giai đoạn từ `01/01/2027`; nhưng **tiếp tục tuân thủ** Phụ lục II (`08/2023/TT-BCT`, tạm ngừng TNTX/chuyển khẩu) và Phụ lục III–V (`08/2023/TT-BCT`, thóc gạo XK & nguyên liệu/máy móc thuốc lá) vì các phần này không hết hiệu lực ngày `31/12/2026`.
- [ ] **5. Hàng quốc phòng nhạy cảm (`173/2018/TT-BQP`):** Kiểm tra hồ sơ giấy phép chuyên ngành Bộ Quốc phòng cho hàng hóa nhóm `3601`–`3603`, `8710`, `8802`, `8906`, `9301`–`9306` (và 12 mục không gắn mã HS) theo Điều 9 `292/2026/NĐ-CP`; không tự ý nhập khẩu khi chưa xác minh văn bản thay thế `173/2018/TT-BQP`.
- [ ] **6. Hoàn tất thủ tục tiền chất & hóa chất trước `31/12/2026`:** Kiểm kê các lô **1,4-Butanediol (`BDO`, CAS `110-63-4`)** theo Điều 3 khoản 4 `28/2026/NĐ-CP` và giấy phép hóa chất kiểm soát đặc biệt/có điều kiện/kế hoạch sự cố theo Điều 30 `26/2026/NĐ-CP` & Điều 40 khoản 2 `25/2026/NĐ-CP` (xem [[concepts/hoa-chat-tien-chat-cas-xnk]]).

#### Quy tắc xử lý bắt buộc cho Cổng MCP (`ozplugin`) & hệ thống tiêu thụ `dist/`

1. **Không tự động chuyển `tinh_trang` chỉ dựa vào đồng hồ hệ thống:** Luôn đọc nguyên giá trị `tinh_trang`, `het_hieu_luc_tu`, `xac_minh.hieu_luc_da_doi_chieu` và `quan_he_nguoc` từ `dist/registry.json` (theo [[concepts/doc-tinh-trang-hieu-luc]]). Đặc biệt đối với `08/2023/TT-BCT` (`HET_HIEU_LUC_MOT_PHAN`), dù `het_hieu_luc_tu` ghi `2026-12-31` cho phần chuyển tiếp Phụ lục I, các Phụ lục II–V **vẫn đang có hiệu lực**.
2. **Hiển thị cặp chuyển giao khi đã có văn bản kế nhiệm:** Khi tra `11/2018/TT-BTTTT`, Cổng MCP trả đồng thời văn bản hiện hành (`CON_HIEU_LUC` đến `2026-12-31`); đồng thời đọc trường `quan_he_nguoc.bi_thay_the_boi` để hiển thị văn bản kế nhiệm là `63/2026/TT-BKHCN` (`CHUA_CO_HIEU_LUC`, hiệu lực từ `2027-01-01`).
3. **Bắt buộc cảnh báo điểm mù khi chưa có văn bản thay thế:** Với `204/2025/QH15`, `174/2025/NĐ-CP`, `43/2026/NQ-CP`, `72/2026/NĐ-CP`, `173/2018/TT-BQP` và phần thiết bị y tế cũ của `12/2018/TT-BCT` / `08/2023/TT-BCT`, Cổng MCP phải gắn cảnh báo rõ **"Sắp hết hiệu lực đến `31/12/2026` (hoặc `01/01/2027`); hiện chưa ghi nhận văn bản gia hạn/thay thế trong sổ `oz-wiki-plhq`"** và dẫn URL nguồn bậc A (`nguon_a`) để người dùng tự kiểm tra Công báo mới nhất.
4. **Cẩn trọng khi dùng `tom_tat_nhap`:** Trong 8 văn bản, `174/2025/NĐ-CP` và `11/2018/TT-BTTTT` có thêm tệp `data/doc-hieu/*.dieu.jsonl` (`TOM_TAT_NHAP`, `da_soat: false`); Cổng MCP chỉ được trích dẫn nguyên văn từ tầng `NGUYEN_VAN_NGUON_A` (`08/2023/TT-BCT`, `11/2018/TT-BTTTT`, `72/2026/NĐ-CP`, `19/2026/QH16`, `292/2026/NĐ-CP`, `28/2026/NĐ-CP`, `181/2025/NĐ-CP`).

### 7. Nhóm 3 văn bản mới sắp CÓ hiệu lực từ `01/01/2027` (`SAP_CO_HIEU_LUC`)

Song song với 8 văn bản sắp hết hiệu lực, sổ đăng ký ghi nhận **3 văn bản ở trạng thái `CHUA_CO_HIEU_LUC` (`NGUON_A`, `hieu_luc_da_doi_chieu: true`) sẽ chính thức có hiệu lực từ ngày `01/01/2027`** — đều đã đọc toàn văn nguồn bậc A và tổng hợp chi tiết:

| Văn bản (`wiki/sources/`) | Cơ quan / Ban hành | Hiệu lực từ | Tác động nghiệp vụ XNK từ `01/01/2027` |
|---|---|---|---|
| [[sources/154-2026-tt-btc]] (`154/2026/TT-BTC`) | `BTC` (`15/10/2026`) | `2027-01-01` | Sửa đổi, bổ sung Điều 4, 5, 6, 7 và thay Phụ lục I–III của `80/2019/TT-BTC` về thủ tục hải quan, thuế thương mại biên giới: điện tử hoá tờ khai cư dân biên giới, bỏ bảng kê mua gom cũ `BK-MGHCDBG 2019/HQVN` (khai số tờ khai cư dân tại ô vận đơn), miễn thủ tục mua gom khi đã hoàn thành đủ nghĩa vụ thuế/KTCL (phải lập hoá đơn điện tử khi lưu thông nội địa), mở rộng thanh toán điện tử và cập nhật tên cơ quan mới (`Cục Hải quan`, `Hải quan khu vực`, `Hải quan cửa khẩu`). *(Lưu ý: toàn văn quy định **thương nhân mua gom của cư dân biên giới**, không phải "mua gom của người nước ngoài" như dòng `ten` đang ghi trên YAML sổ.)* |
| [[sources/372-2026-nd-cp]] (`372/2026/NĐ-CP`) | `CP` (`29/09/2026`) | `2027-01-01` | Quy định Nền tảng quốc gia về định danh, xác thực và truy xuất nguồn gốc (`VnUID`) và mã `UID` (GS1 Digital Link / W3C `DID` / TCVN 13274:2020): **bắt buộc** đối với **hàng hóa mức độ rủi ro cao** theo `37/2026/NĐ-CP` (gồm dữ liệu chủ chuẩn hóa mã HS, sự kiện trọng yếu thông quan/hóa đơn, số hóa C/O và chứng nhận chất lượng thành chứng chỉ số), khuyến khích tự nguyện với rủi ro trung bình/thấp & hàng XK, loại trừ TNTX/quá cảnh/chuyển khẩu/kho ngoại quan; chuyển tiếp kết nối tối đa `06` tháng từ khi công bố Nền tảng đủ điều kiện. |
| [[sources/63-2026-tt-bkhcn]] (`63/2026/TT-BKHCN`) | `BKHCN` (`27/10/2026`) | `2027-01-01` | Thay thế toàn bộ `11/2018/TT-BTTTT` về Danh mục sản phẩm công nghệ số đã qua sử dụng cấm nhập khẩu kèm mã HS theo `292/2026/NĐ-CP` (chuẩn hóa `37` dòng lá trong `danh-muc/63-2026-tt-bkhcn.csv` theo `31/2022/TT-BTC`, bỏ mã `8443.32.49`), bổ sung **ngoại lệ mới** cho máy móc/dây chuyền phục vụ dự án sản xuất, đóng gói, kiểm thử **vi mạch bán dẫn** hoặc đào tạo, R&D công nghệ số (điểm e khoản 2 Điều 2) và chuyển tiếp giấy phép đã cấp trước `01/01/2027` (khoản 3 Điều 3). |

Bổ sung mốc kế tiếp **`01/03/2027`** (**2 văn bản `CHUA_CO_HIEU_LUC`** đã có trong sổ đăng ký & `wiki/sources/`):

| Văn bản (`wiki/sources/`) | Cơ quan / Ban hành | Hiệu lực từ | Tác động nghiệp vụ XNK từ `01/03/2027` |
|---|---|---|---|
| [[sources/11-2026-qh16]] (`11/2026/QH16`) | `QH` (`23/08/2026`) | `2027-03-01` | Luật sửa đổi, bổ sung một số điều của Luật Hải quan `54/2014/QH13` (`NGUON_A`, `hieu_luc_da_doi_chieu: true`). |
| [[sources/417-2026-nd-cp]] (`417/2026/NĐ-CP`) | `CP` (`20/11/2026`) | `2027-03-01` | Quản lý hải quan đối với hàng hóa XNK qua nền tảng thương mại điện tử và quy định miễn thuế NK đối với đơn hàng TMĐT trị giá từ `1` triệu đồng trở xuống (Điều 12). |

### 8. Kịch bản cắt chuyển trạng thái sổ đăng ký (`registry/van-ban/`) tại mốc `31/12/2026` – `01/01/2027`

Do cổng kiểm tự động `tools/kiem-tra.mjs` chặn việc đặt `tinh_trang: HET_HIEU_LUC` khi `het_hieu_luc_tu > today` (và chặn giữ `CON_HIEU_LUC` khi `het_hieu_luc_tu <= today`), việc cập nhật sổ đăng ký được chia thành **2 pha rõ ràng** và được tự động hóa an toàn bằng công cụ **`npm run chuyen-hieu-luc`** (`tools/chuyen-hieu-luc.mjs`, mặc định dry-run):

1. **Pha trước `15/12/2026`:** Hoàn tất toàn bộ 8/8 trang `wiki/sources/` và đồng bộ các trang `wiki/concepts/`, `wiki/summary/`; canh Công báo mỗi kỳ đối với 7 văn bản chưa có văn bản kế nhiệm/gia hạn (nếu có văn bản mới ban hành thì nạp ngay toàn văn bậc A và gắn `quan_he.thay_the` / `sua_doi`). Chạy xem trước kịch bản cắt chuyển bất kỳ lúc nào bằng:
   - `npm run chuyen-hieu-luc -- --ngay 2027-01-01` (liệt kê `6` văn bản `CON_HIEU_LUC → HET_HIEU_LUC`, `3` văn bản `CHUA_CO_HIEU_LUC → CON_HIEU_LUC`, khóa bảo vệ **`2` văn bản `HET_HIEU_LUC_MOT_PHAN` (`12/2018/TT-BCT`, `08/2023/TT-BCT`) vào danh sách `can_soat_tay`** và xuất danh sách trang wiki cần rà lại để tránh `WIKI_DAN_VB_HET_HIEU_LUC`).
2. **Pha cắt chuyển đúng hạn (`31/12/2026` – `01/01/2027`):** Nếu đến ngày hết hạn mà cơ quan có thẩm quyền không ban hành văn bản gia hạn mới:
   - Bước 1: Chạy `npm run chuyen-hieu-luc -- --ngay 2027-01-01 --ghi` để cắt chuyển an toàn 9 văn bản `CON_HIEU_LUC`/`CHUA_CO_HIEU_LUC`.
   - Bước 2: Soát tay 2 tệp `HET_HIEU_LUC_MOT_PHAN` theo bảng dưới (`12-2018-tt-bct.yaml` → `HET_HIEU_LUC`; `08-2023-tt-bct.yaml` → giữ `HET_HIEU_LUC_MOT_PHAN` và bỏ `het_hieu_luc_tu`).
   - Bước 3: Rà các trang wiki trong `wiki_can_ra_soat` và chạy `npm run kiem-tra && npm run diem-mu && npm test` trước khi mở PR.

| Tệp `registry/van-ban/` | Trạng thái hiện tại | Thao tác cắt chuyển tại mốc `31/12/2026` – `01/01/2027` (nếu không có VB gia hạn mới) | Lý do & kiểm chứng `kiem-tra.mjs` |
|---|---|---|---|
| `11-2018-tt-btttt.yaml` | `CON_HIEU_LUC` (`het_hieu_luc_tu: '2026-12-31'`) | Đổi `tinh_trang: HET_HIEU_LUC` | Đã có `63-2026-tt-bkhcn.yaml` ghi `quan_he.thay_the` từ `2027-01-01` |
| `12-2018-tt-bct.yaml` | `HET_HIEU_LUC_MOT_PHAN` (`het_hieu_luc_tu: '2026-12-31'`) | Đổi `tinh_trang: HET_HIEU_LUC` | Phần chính đã bị `48/2026/TT-BCT` bãi bỏ toàn bộ từ `05/09/2026`; phần chuyển tiếp duy nhất còn lại (Phụ lục I thiết bị y tế cũ theo khoản 3 Điều 21 `48/2026/TT-BCT`) kết thúc ngày `31/12/2026` |
| `08-2023-tt-bct.yaml` | `HET_HIEU_LUC_MOT_PHAN` (`het_hieu_luc_tu: '2026-12-31'`) | **Giữ** `tinh_trang: HET_HIEU_LUC_MOT_PHAN`, **bỏ** trường `het_hieu_luc_tu: '2026-12-31'` và cập nhật `ghi_chu` | Chỉ phần chuyển tiếp thiết bị y tế cũ tại Phụ lục I kết thúc ngày `31/12/2026`; Khoản 2 Điều 1 (Phụ lục II) và Điều 2 (Phụ lục III–V sửa `41/2019/TT-BCT`) **vẫn còn hiệu lực** nên tuyệt đối không chuyển sang `HET_HIEU_LUC` |
| `173-2018-tt-bqp.yaml` | `CON_HIEU_LUC` (`het_hieu_luc_tu: '2026-12-31'`) | Đổi `tinh_trang: HET_HIEU_LUC` (hoặc gắn `quan_he.thay_the` từ TT-BQP mới nếu ban hành kịp) | Hết thời hạn chuyển tiếp văn bản hướng dẫn `69/2018/NĐ-CP` theo khoản 4 Điều 64 `292/2026/NĐ-CP` |
| `204-2025-qh15.yaml` | `CON_HIEU_LUC` (`het_hieu_luc_tu: '2026-12-31'`) | Đổi `tinh_trang: HET_HIEU_LUC` (trừ khi có NQ Quốc hội mới kéo dài) | Hết thời hạn thi hành theo Điều 2 `204/2025/QH15` |
| `174-2025-nd-cp.yaml` | `CON_HIEU_LUC` (`het_hieu_luc_tu: '2026-12-31'`) | Đổi `tinh_trang: HET_HIEU_LUC` (trừ khi có NĐ/NQ mới kéo dài) | Hết thời hạn thi hành theo khoản 1 Điều 2 `174/2025/NĐ-CP` |
| `43-2026-nq-cp.yaml` | `CON_HIEU_LUC` (`het_hieu_luc_tu: '2026-12-31'`) | Đổi `tinh_trang: HET_HIEU_LUC` | Hết thời hạn kéo dài quý IV/2026 theo khoản 1 Điều 3 `43/2026/NQ-CP` |
| `72-2026-nd-cp.yaml` | `CON_HIEU_LUC` (`het_hieu_luc_tu: '2027-01-01'`) | Đổi `tinh_trang: HET_HIEU_LUC` từ `2027-01-01` (trừ khi có NQ-CP mới kéo dài theo khoản 2 Điều 2) | Hết hạn kéo dài theo Điều 1 `43/2026/NQ-CP`; thuế MFN xăng dầu tự động quay về `26/2023/NĐ-CP` |
| `63-2026-tt-bkhcn.yaml`, `154-2026-tt-btc.yaml`, `372-2026-nd-cp.yaml` | `CHUA_CO_HIEU_LUC` (`hieu_luc_tu: '2027-01-01'`) | Đổi `tinh_trang: CON_HIEU_LUC` vào ngày `2027-01-01` | Đóng cả 3 điểm mù `SAP_CO_HIEU_LUC` và ngăn phát sinh `MAU_THUAN_HIEU_LUC` |

## Sources covered

- **8 văn bản `SAP_HET_HIEU_LUC` mức Cao (đã có đủ 8/8 trang `wiki/sources/`):**
  - [[sources/204-2025-qh15]] (`204/2025/QH15`) & [[sources/174-2025-nd-cp]] (`174/2025/NĐ-CP`) — nhóm giảm thuế GTGT `8%`.
  - [[sources/72-2026-nd-cp]] (`72/2026/NĐ-CP`) & [[sources/43-2026-nq-cp]] (`43/2026/NQ-CP`) — nhóm ưu đãi thuế xăng, dầu (kèm [[sources/19-2026-qh16]] `19/2026/QH16`, [[sources/26-2023-nd-cp]] `26/2023/NĐ-CP`, [[sources/80-2023-nd-cp]] `80/2023/NĐ-CP`).
  - [[sources/11-2018-tt-btttt]] (`11/2018/TT-BTTTT`) — kèm văn bản kế nhiệm [[sources/63-2026-tt-bkhcn]] (`63/2026/TT-BKHCN`).
  - [[sources/12-2018-tt-bct]] (`12/2018/TT-BCT`) & [[sources/08-2023-tt-bct]] (`08/2023/TT-BCT`) — kèm [[sources/48-2026-tt-bct]] (`48/2026/TT-BCT`), `registry/van-ban/98-2021-nd-cp.yaml` (`98/2021/NĐ-CP`), [[sources/07-2023-nd-cp]] (`07/2023/NĐ-CP`).
  - [[sources/173-2018-tt-bqp]] (`173/2018/TT-BQP`) — gắn điều khoản chuyển tiếp của [[sources/292-2026-nd-cp]] (`292/2026/NĐ-CP`, thay thế văn bản lịch sử đã hết hiệu lực `69/2018/NĐ-CP`).
- **Văn bản `CHUA_CO_HIEU_LUC` hiệu lực `01/01/2027` & `01/03/2027` (`SAP_CO_HIEU_LUC` & kế tiếp):**
  - [[sources/154-2026-tt-btc]] (`154/2026/TT-BTC`, sửa đổi `80/2019/TT-BTC`, kèm [[sources/14-2018-nd-cp]], [[sources/122-2024-nd-cp]], [[sources/34-2025-tt-bct]]).
  - [[sources/372-2026-nd-cp]] (`372/2026/NĐ-CP`, gắn với [[sources/37-2026-nd-cp]]).
  - [[sources/63-2026-tt-bkhcn]] (`63/2026/TT-BKHCN`, thay thế [[sources/11-2018-tt-btttt]] từ `01/01/2027`).
  - [[sources/11-2026-qh16]] (`11/2026/QH16`, hiệu lực `01/03/2027`) & [[sources/417-2026-nd-cp]] (`417/2026/NĐ-CP`, hiệu lực `01/03/2027`).
- **Văn bản khung & hóa chất liên quan mốc `31/12/2026`:** [[sources/181-2025-nd-cp]] (`181/2025/NĐ-CP`), [[sources/28-2026-nd-cp]] (`28/2026/NĐ-CP`), [[sources/26-2026-nd-cp]] (`26/2026/NĐ-CP`), `registry/van-ban/25-2026-nd-cp.yaml` (`25/2026/NĐ-CP`), `registry/van-ban/31-2022-tt-btc.yaml` (`31/2022/TT-BTC`).

## Key concepts

- [[summary/khung-thu-tuc-hai-quan]]
- [[concepts/thue-gtgt-hang-nhap-khau]]
- [[concepts/hang-cu-cam-nhap-khau]]
- [[concepts/doc-tinh-trang-hieu-luc]]
- [[concepts/co-quan-tiep-nhan-sau-sap-nhap]]
- [[concepts/hoa-chat-tien-chat-cas-xnk]]

## Open questions

- Quốc hội và Chính phủ có ban hành nghị quyết gia hạn chính sách giảm thuế GTGT `8%` (`204/2025/QH15`, `174/2025/NĐ-CP`) và ưu đãi thuế xăng dầu (`43/2026/NQ-CP`, `72/2026/NĐ-CP`, `19/2026/QH16`) cho giai đoạn từ `01/01/2027` hay không?
- Bộ Y tế (theo thẩm quyền Phụ lục I `292/2026/NĐ-CP`) và Bộ Công Thương sẽ ban hành văn bản hướng dẫn chi tiết mã HS nào đối với **thiết bị y tế đã qua sử dụng** sau khi chuyển tiếp tại Điều 21 khoản 3 `48/2026/TT-BCT` kết thúc ngày `31/12/2026`?
- Bộ Quốc phòng có ban hành Thông tư mới thay thế danh mục hàng hóa cấm XK/NK trong `173/2018/TT-BQP` theo Điều 9 khoản 1 `292/2026/NĐ-CP` trước ngày `31/12/2026` hay không?

## Notes

- Rà soát trực tiếp từ `registry/van-ban/*.yaml`, `danh-muc/*.csv`, và kết quả `node tools/diem-mu.mjs --stdout` ngày `24/11/2026` (đối chiếu Công báo đến số 584).
- Trong sổ hiện có các văn bản lịch sử liên quan đã `HET_HIEU_LUC` được nêu rõ ngữ cảnh thay thế/bãi bỏ: `69/2018/NĐ-CP` (đã hết hiệu lực từ `05/09/2026`, bị thay thế bởi `292/2026/NĐ-CP`), `40/2017/TT-BQP` (đã hết hiệu lực từ `01/01/2019`, bị thay thế bởi `173/2018/TT-BQP`), `04/2014/TT-BCT` / `11/2017/TT-BCT` / `49/2015/TT-BCT` (đã hết hiệu lực từ `15/06/2018`, bị bãi bỏ bởi `12/2018/TT-BCT`). *(Ghi chú đối chiếu kỹ thuật: căn cứ mới thay thế `69/2018/NĐ-CP` là `292/2026/NĐ-CP`.)*
