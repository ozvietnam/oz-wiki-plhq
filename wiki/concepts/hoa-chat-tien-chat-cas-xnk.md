---
id: hoa-chat-tien-chat-cas-xnk
title: "Hóa chất, tiền chất theo mã CAS và hàng hóa nguy hiểm trong XNK"
type: concept
created: 2026-11-22
updated: 2026-11-22
key_sources:
  - 26-2026-nd-cp
  - 28-2026-nd-cp
  - 33-2024-nd-cp
  - 34-2024-nd-cp
  - 73-2021-qh14
related_concepts:
  - khai-bao-hoa-chat-nhap-khau
  - giay-phep-hoa-chat-co-dieu-kien
  - hoa-chat-nguy-hiem-trong-hang-hoa
  - doc-tinh-trang-hieu-luc
  - nhan-hang-hoa-nhap-khau
  - thu-tuc-hai-quan-xnk
confidence: high
tags:
  - hoa-chat
  - tien-chat
  - cas
  - cwc
  - hang-nguy-hiem
  - ma-tuy
  - xnk
  - "2026"
---

## Definition

Quản lý xuất nhập khẩu hóa chất, tiền chất và hàng hóa nguy hiểm tại Việt Nam năm 2026 vận hành trên **ba trục danh mục tách biệt nhưng giao thoa theo chất**: (1) **Danh mục hóa chất theo mã CAS** tại 4 Phụ lục của `24/2026/NĐ-CP` (hướng dẫn Luật Hóa chất `69/2025/QH15`, thực thi qua `26/2026/NĐ-CP`, `25/2026/NĐ-CP`, `01/2026/TT-BCT`); (2) **Danh mục chất ma túy và 79 tiền chất** tại `28/2026/NĐ-CP` trên nền Luật Phòng, chống ma túy `73/2021/QH14`; và (3) **Danh mục hóa chất Bảng CWC (`33/2024/NĐ-CP`)** cùng **Danh mục hàng hóa nguy hiểm theo số UN (`34/2024/NĐ-CP`)**. Doanh nghiệp và Cổng MCP phải tra cứu song song theo **mã CAS, công thức, nồng độ % hỗn hợp, số UN và Chương HS**, tuyệt đối không chỉ dựa vào một danh mục đơn lẻ.

> **Ranh giới tuyệt đối với `hs-code-api` (0% trùng lặp):** Cẩm nang này chỉ tổng hợp khung pháp lý, phân tầng danh mục CAS/UN/tiền chất, quy tắc hỗn hợp và điều kiện chứng từ XNK. Wiki **không** thực hiện áp mã HS 8 số cho hóa chất/chế phẩm và **không** tính thuế suất nhập khẩu, GTGT hay TTĐB — mọi bài toán phân loại HS và tính thuế thuộc `hs-code-api`. Lưu ý thực tế: bảng gốc `24/2026/NĐ-CP` và Phụ lục I `34/2024/NĐ-CP` **không có cột mã HS**; chỉ Danh mục IV `28/2026/NĐ-CP` và Phụ lục I `33/2024/NĐ-CP` có gắn mã HS tham chiếu.

## Variants

### 1. Hệ thống 5 văn bản trụ cột và các nghị định triển khai Luật Hóa chất `69/2025/QH15`

Số liệu kiểm chứng trực tiếp từ `registry/van-ban/*.yaml` và `danh-muc/` tại ngày `22/11/2026`:

| Văn bản | Tình trạng (`registry/van-ban/`) | Hiệu lực từ | Đối tượng & Phạm vi kiểm soát XNK | Dữ liệu máy trong kho (`danh-muc/` & `dist/`) |
|---|---|---|---|---|
| `24/2026/NĐ-CP` | `CON_HIEU_LUC` (`NGUON_A`) | `2026-01-17` | 4 Phụ lục danh mục hóa chất hướng dẫn Luật `69/2025/QH15` (công nghiệp trọng điểm, SXKD có điều kiện, kiểm soát đặc biệt, kế hoạch sự cố) | `danh-muc/24-2026-nd-cp-cas.csv` (**1.377** dòng) → `dist/cas-index.json` (**1.258** mã CAS duy nhất + **14** dòng `khong_co_cas`) |
| `28/2026/NĐ-CP` | `CON_HIEU_LUC` (`NGUON_A`, có `dieu_khoan`) | `2026-01-19` | 4 Danh mục chất ma túy (`IA`, `IB`, `IIA`, `IIB`, `III`: 615 chất) và **79 tiền chất (`IVA`, `IVB`, `IVC`)**; thay thế `57/2022/NĐ-CP` và `90/2024/NĐ-CP` (đã hết hiệu lực) | `danh-muc/28-2026-nd-cp.csv` (**80** dòng cho 79 tiền chất Danh mục IV kèm mã HS 8 số & cơ quan quản lý, `da_doi_chieu: true`) |
| `33/2024/NĐ-CP` | `CON_HIEU_LUC` (`NGUON_A`, có `dieu_khoan`) | `2024-05-19` | Thực hiện Công ước Cấm vũ khí hóa học (CWC): hóa chất Bảng 1, 2, 3, DOC/DOC-PSF, báo cáo & thanh sát OPCW | `danh-muc/33-2024-nd-cp.csv` (**78** dòng / **38** mã HS 6 số, dẫn chiếu tại `60` mã HS biểu thuế, `da_doi_chieu: true`) |
| `34/2024/NĐ-CP` | `CON_HIEU_LUC` (`NGUON_A`, có `dieu_khoan`) | `2024-05-15` | Danh mục hàng hóa nguy hiểm **9 loại** theo **mã UN** (không có cột mã HS), đóng gói, biểu trưng nguy hiểm, giấy phép vận chuyển & giám sát hải quan (Điều 29) | Hiện chỉ còn hiệu lực phạm vi vận chuyển đường thủy nội địa (phần đường bộ đã tách sang nghị định đường bộ mới từ `01/01/2025`) |
| `73/2021/QH14` | `CON_HIEU_LUC` (`NGUON_A`, có `dieu_khoan`) | `2022-01-01` | Luật Phòng, chống ma túy (thay thế `23/2000/QH10` đã hết hiệu lực): Chương III (Điều 12–20) kiểm soát XNK, TNTX, quá cảnh & Điều 11, 50 thẩm quyền Hải quan | Văn bản luật khung, kết nối `28/2026/NĐ-CP` và pháp luật dược (`105/2016/QH13`, `44/2024/QH15`) |
| `26/2026/NĐ-CP` + `25/2026/NĐ-CP` + `01/2026/TT-BCT` | `CON_HIEU_LUC` (`NGUON_A`) | `2026-01-17` | `26/2026/NĐ-CP` quy định thủ tục **khai báo hóa chất NK (Điều 6)**, **giấy phép XNK (Điều 10, 14, 18)**, công bố sản phẩm chứa HC nguy hiểm (Điều 28–29); thay thế `113/2017/NĐ-CP` và `82/2022/NĐ-CP` (đã hết hiệu lực). `25/2026/NĐ-CP` quy định an toàn/an ninh/sự cố; `01/2026/TT-BCT` hướng dẫn biểu mẫu | Thủ tục điều hành trực tiếp trên 4 Phụ lục của `24/2026/NĐ-CP` và Chương 28–29 Danh mục hàng hóa XNK (`31/2022/TT-BTC`) |

### 2. Cấu trúc 4 Phụ lục `24/2026/NĐ-CP` & cách tra `cas-index` (`dist/cas-index.json`)

Theo `raw/download/congbao.chinhphu.vn/24-2026-nd-cp-body.txt` (5 Điều & 4 Phụ lục từ Công báo số 77), `danh-muc/24-2026-nd-cp-cas.csv` (`1.377` dòng) và quy tắc trích `danh-muc/24-2026-nd-cp-cas-quy-tac.md`:

| Phụ lục `24/2026/NĐ-CP` | Nội dung & Phân nhóm | Số lượng trên CSV | Quy tắc hỗn hợp & Ngưỡng áp dụng (nguyên văn) | Ý nghĩa thực tế khi XNK |
|---|---|---|---|---|
| **Phụ lục I** | Hóa chất cơ bản thuộc lĩnh vực công nghiệp hóa chất trọng điểm | **39** dòng (`38` có CAS + `1` không CAS: STT 12 `Diisocyanate (TDI, MDI, HDI…)`) | **Không có** quy tắc hỗn hợp (chỉ liệt kê chất cơ bản thuộc ngành trọng điểm) | Phục vụ phát triển công nghiệp hóa chất trọng điểm (khoản 2 Điều 6 Luật `69/2025/QH15`); **không** đồng nghĩa với diện phải xin giấy phép XNK chỉ vì nằm ở PL I |
| **Phụ lục II** *(Mục 1 & 2)* | Hóa chất sản xuất, kinh doanh **có điều kiện** | **793** dòng cho **786** STT (`790` có CAS + `3` không CAS; `4` chất đa-CAS tách thành `11` dòng) | Hỗn hợp chứa ít nhất 01 thành phần thuộc PL II có hàm lượng **lớn hơn 5% khối lượng** (Mục 2 PL II) | NK để **kinh doanh**: phải có GCN đủ điều kiện KD hóa chất có điều kiện; NK để **tự sử dụng**: công bố mục đích sử dụng trên CSDL chuyên ngành hóa chất, **không** cần GCN (Điều 10 `26/2026/NĐ-CP`) |
| **Phụ lục III** *(Nhóm 1 & 2)* | Hóa chất **cần kiểm soát đặc biệt**: Nhóm 1 (`1A` tiền chất CN: 22; `1B` CWC Bảng 2: 13; `1C` HC khác: 113) & Nhóm 2 (`2A` tiền chất CN: 20; `2B` CWC Bảng 3: 17; `2C` Rotterdam/Stockholm: 84) | **269** dòng (`269` dòng có CAS, tương ứng **267** mã CAS duy nhất) | Hỗn hợp chứa thành phần: (a) Nhóm 1 **> 1%** khối lượng; (b) Hóa chất CWC/công ước quốc tế thuộc Nhóm 2 **> 1%** khối lượng; (c) Tiền chất công nghiệp Nhóm 2 **> 5%** khối lượng. Nếu chứa **đồng thời** chất PL II và PL III → **coi là hỗn hợp PL III** | **Bắt buộc có Giấy phép XK/NK** của Bộ Công Thương qua Cổng một cửa quốc gia là **điều kiện thông quan** (Điều 14 `26/2026/NĐ-CP`, hiệu lực 06 tháng); lập tài khoản & công bố mục đích nếu NK để sản xuất (Điều 15) |
| **Phụ lục IV** *(Bảng A & Bảng B)* | Hóa chất phải xây dựng **Kế hoạch phòng ngừa, ứng phó sự cố hóa chất** | Bảng A: **276** dòng cho **271** STT (`266` có CAS + `10` không CAS, có cột `nguong_kg`); Bảng B: phân loại GHS cho hỗn hợp (không có CAS riêng) | Áp dụng cho chất tại Bảng A và hỗn hợp chứa chất Bảng A khi phân loại theo GHS thuộc trường hợp Bảng B | Căn cứ thẩm định điều kiện kho chứa/an toàn nhà xưởng (khối lượng tồn trữ lớn nhất tại một thời điểm so với `nguong_kg`; riêng Amoni nitrat STT 8 có 4 ngưỡng theo thành phần hỗn hợp) |

**4 quy tắc tra cứu bắt buộc trên `dist/cas-index.json`:**
1. **Một mã CAS có thể nằm đồng thời ở 2–3 Phụ lục:** Trong `cas-index.json`, có **10 mã CAS** xuất hiện ở từ 3 Phụ lục trở lên (ví dụ `106-99-0` *1,3-Butadien* nằm ở PL I, PL II và PL IV `nguong_kg: 10.000`; `7647-01-0` *Axit Hydrochloric* nằm ở PL I, PL III Nhóm 2 mục A và PL IV `nguong_kg: 25.000`; `7664-41-7` *Amoniac khan* nằm ở PL I, PL II, PL IV). Cổng MCP phải đọc **trọn mảng `theo_cas[cas]`**, không dừng ở bản ghi đầu tiên.
2. **Bắt buộc quét `khong_co_cas[]` (`14` mục):** Nhiều nhóm hóa chất không có số CAS đơn nhất (như `Diisocyanate (TDI, MDI, HDI…)` PL I STT 12; `Amalgam`, `Triorganostannic`, hợp chất Niken dạng bột tại PL II; `Axit asenic/asenơ`, `Các ankyl chì`, `Các hợp chất xyanua`, `Thủy ngân và các hợp chất của thủy ngân`, `Hỗn hợp chứa natri hypoclorit`, nhóm chất gây ung thư `> 5%` tại PL IV STT 271). Tra thiếu mảng `khong_co_cas` sẽ bỏ sót nghĩa vụ an toàn/kinh doanh.
3. **Ghi nhận 2 lỗi in gốc tại Công báo số 77 (giữ nguyên theo nguồn bậc A):** `10037-74-3` (PL II STT 135 *Canxi clorat*, chuẩn quốc tế là `10137-74-3`) và `7746-08-4` (PL II STT 634 *Selen dioxit*, chuẩn quốc tế là `7446-08-4`) không đạt checksum mod-10 trên bản in Công báo số 77. Khi tra từ MSDS quốc tế, cần đối chiếu thêm theo tên hóa chất IUPAC/tiếng Việt.
4. **Phân biệt phạm vi Khai báo hóa chất NK (Điều 6 `26/2026/NĐ-CP`) với 4 Phụ lục `24/2026/NĐ-CP`:**
   - Theo **Điều 6 khoản 1 `26/2026/NĐ-CP`**, nghĩa vụ **khai báo hóa chất nhập khẩu** qua **Cổng thông tin một cửa quốc gia** (tự động chuyển sang Bộ Công Thương) áp dụng cho **hóa chất thuộc Chương 28 và Chương 29** của Danh mục hàng hóa XNK Việt Nam (`31/2022/TT-BTC`), **không** giới hạn trong 4 Phụ lục `24/2026/NĐ-CP`.
   - **5 trường hợp miễn khai báo** (Điều 6 khoản 7 `26/2026/NĐ-CP`): (a) hóa chất cần kiểm soát đặc biệt đã có Giấy phép nhập khẩu; (b) hóa chất cấm đã có Giấy phép nhập khẩu; (c) nhập khẩu **dưới `10 kg`** hóa chất Chương 28–29; (d) nhập khẩu **dưới `01 kg`** hóa chất mới để thử nghiệm; (đ) **hỗn hợp chất không thuộc Chương 28 và Chương 29** dù có chứa thành phần thuộc Chương 28–29.
   - *(Đính chính nội bộ wiki:* `khai-bao-hoa-chat-nhap-khau` trước đây ghi nhầm nộp trên `itc.gov.vn` và theo danh mục chung — quy định hiện hành tại Điều 6 khoản 1 & 3 `26/2026/NĐ-CP` thực hiện trên **Cổng thông tin một cửa quốc gia** cho **Chương 28 & 29**; đồng thời Điều 29 `26/2026/NĐ-CP` yêu cầu khai báo & công bố thông tin hàm lượng hóa chất nguy hiểm trong sản phẩm, hàng hóa lên **Cơ sở dữ liệu chuyên ngành hóa chất** trước khi lưu thông.)*

### 3. 79 tiền chất Danh mục IV `28/2026/NĐ-CP` & giao thoa Luật `73/2021/QH14`

Khác với `24/2026/NĐ-CP`, Phụ lục `28/2026/NĐ-CP` ([[sources/28-2026-nd-cp]]) chia **79 tiền chất Danh mục IV** thành 3 nhóm kèm **cột mã HS 8 số tham chiếu** và **cơ quan quản lý** (`danh-muc/28-2026-nd-cp.csv` có `80` dòng dữ liệu vì *Sulfuric acid* `IVC.15` có 2 mã HS `2807.00.10` và `2807.00.90`):

| Tiểu mục Danh mục IV | Bản chất & Chế độ pháp lý (`Điều 1`, `Điều 2`) | Số lượng | Cơ quan quản lý theo `28/2026/NĐ-CP` | Điểm giao thoa với `24/2026/NĐ-CP` & `73/2021/QH14` |
|---|---|---|---|---|
| **IVA** *(IVA.1 – IVA.31)* | Tiền chất thiết yếu tham gia cấu trúc ma túy, **không có ứng dụng hợp pháp** trong y học/đời sống; chỉ dùng hạn chế cho nghiên cứu, kiểm nghiệm, giám định, QP-AN theo quy định đặc biệt | **31** tiền chất | **Bộ Công an** quản lý toàn bộ (`22` chất thuộc các nhóm `2918`/`2924`/`2925`/`2933`/`2939` + `9` chất `IVA.12–IVA.20` mã `2932.99.00` chuẩn hóa từ `2932.99.90` trong bản in) | Thuộc diện kiểm soát đặc biệt nghiêm ngặt theo Điều 17 Luật `73/2021/QH14` |
| **IVB** *(IVB.1 – IVB.30)* | Tiền chất thiết yếu có ứng dụng hợp pháp trong y học/đời sống | **30** tiền chất | **Bộ Công Thương**, **Bộ Y tế** (7 tiền chất dược dụng như *Ephedrine, Pseudoephedrine, Ergometrine, Ergotamine*...), **Bộ Nông nghiệp và Môi trường** | Giao thoa mạnh với PL III Nhóm 1 mục A (`24/2026/NĐ-CP`); lưu ý **1,4-Butanediol (`BDO`, CAS `110-63-4`)** có hạn chuyển tiếp bắt buộc **trước `31/12/2026`** (Điều 3 khoản 4 `28/2026/NĐ-CP`) |
| **IVC** *(IVC.1 – IVC.18)* | Hóa chất, dung môi, chất xúc tác dùng trong sản xuất chất ma túy (`Acetone`, `Acetic acid`, `Hydrochloric acid`, `Sulfuric acid`, `Toluene`, `MEK`, `Potassium permanganate`...) | **18** tiền chất (`19` dòng CSV) | **Bộ Công Thương** và **Bộ Nông nghiệp và Môi trường** | Giao thoa trực tiếp với PL III Nhóm 2 mục A (`24/2026/NĐ-CP`); khi xuất khẩu tiền chất công nghiệp thuộc PL III `24/2026/NĐ-CP`, BCT phải lấy **văn bản chấp thuận của Bộ Công an** (thông báo tiền xuất khẩu trong `03` ngày làm việc — Điều 14 khoản 6 điểm d `26/2026/NĐ-CP`) |

- **Mức độ chồng lấn CAS đo được:** Trong `66` mã CAS duy nhất thuộc Danh mục IV `28/2026/NĐ-CP`, có **`40` mã CAS** đồng thời xuất hiện trong `cas-index.json` của `24/2026/NĐ-CP`. Doanh nghiệp nhập khẩu dung môi/axit phổ biến như `Acetone` (`67-64-1`), `Toluene` (`108-88-3`), `Axit Hydrochloric` (`7647-01-0`), `Axit Sulfuric` (`7664-93-9`) chịu kiểm soát **kép** cả tiền chất (`28/2026/NĐ-CP` + Luật `73/2021/QH14`) và hóa chất kiểm soát đặc biệt (`24/2026/NĐ-CP` + `26/2026/NĐ-CP`).
- **Quy tắc dẫn xuất & đồng phân lập thể (Ghi chú chung `28/2026/NĐ-CP`):** Bất kỳ **muối, ester, ether, đồng phân, muối của đồng phân** (gồm cặp đối quang `R`/`S`, hỗn hợp `RS-racemic`) của chất thuộc Danh mục I–IV vẫn bị kiểm soát **ngay cả khi mã CAS riêng của dẫn xuất đó không in trong Phụ lục**.
- **Nghĩa vụ theo Luật `73/2021/QH14` ([[sources/73-2021-qh14]]):** Hoạt động XNK, TNTX, quá cảnh chất ma túy, tiền chất phải có giấy phép và đi đúng hành trình ghi trên giấy phép quá cảnh (Điều 17); riêng thuốc gây nghiện, thuốc hướng thần, thuốc tiền chất dự phòng sơ cứu trên phương tiện vận tải quốc tế không bị coi là hàng XNK nhưng người điều khiển phương tiện phải **khai báo với cơ quan Hải quan** và giải trình số lượng đã sử dụng (Điều 20 khoản 1). Thuốc/nguyên liệu làm thuốc chứa tiền chất cho người thực hiện theo Luật Dược (`105/2016/QH13`, sửa bởi `44/2024/QH15`) trừ hoạt động TNTX, quá cảnh tại Điều 17 Luật `73/2021/QH14` (Điều 15).

### 4. Hóa chất Bảng CWC (`33/2024/NĐ-CP`) & đối chiếu chéo với `26/2026/NĐ-CP`

- **Phụ lục I `33/2024/NĐ-CP` (`danh-muc/33-2024-nd-cp.csv` — `78` dòng / `38` mã HS 6 số, dẫn tại `60` mã HS biểu thuế):**
  - **Bảng 1 (`1A` 36 dòng, `1B` 4 dòng):** Thuộc diện **cấm đầu tư kinh doanh** (Điều 5 khoản 5 `33/2024/NĐ-CP`), **không miễn trừ theo nồng độ**, chỉ XNK phục vụ mục đích đặc biệt với **Quốc gia thành viên Công ước CWC** (không nằm trong bảng `24/2026/NĐ-CP` Phụ lục III vì PL III `24/2026/NĐ-CP` chỉ liệt kê Bảng 2 và Bảng 3 CWC).
  - **Bảng 2 (`2A`/`2A*` 3 dòng, `2B` 18 dòng):** Chỉ XNK với **Quốc gia thành viên Công ước CWC**; trong `33/2024/NĐ-CP` Điều 5 & Phụ lục I mục 2B ghi ngoại trừ *Fonofos* (CAS `944-22-9` tại STT 4), *N,N-Dimethylaminoethanol* (CAS `108-01-0`) và *N,N-Diethylaminoethanol* (CAS `100-37-8` tại STT 11). *(Lưu ý điểm cần đối chiếu bản gốc: trong bảng `24/2026/NĐ-CP` PL III mục B `2B`, 3 CAS này vẫn được in ở dòng ví dụ dưới mô tả nhóm dẫn xuất, vì vậy doanh nghiệp cần kiểm tra kỹ phạm vi ngoại trừ trước khi khai báo).*
  - **Bảng 3 (`3A` 4 dòng, `3B` 13 dòng):** Được phép XNK với nước ngoài Công ước nhưng khi xuất khẩu sang **quốc gia không phải thành viên CWC** phải có **Giấy chứng nhận sử dụng cuối cùng (End-User Certificate)** (quy định này được giữ tại Điều 14 khoản 5 điểm g `26/2026/NĐ-CP`).
- **Điểm giao thoa lập pháp quan trọng giữa `26/2026/NĐ-CP` và `33/2024/NĐ-CP`:**
  - Theo **nguyên văn Điều 31 khoản 4 `26/2026/NĐ-CP`** (PDF Công báo số 78), Chính phủ đã **bãi bỏ** điểm a khoản 14 Điều 4 và **các Điều 10, 11, 12, 13, 14, 15, 17, 18, 19, 20 của `33/2024/NĐ-CP`** kể từ `17/01/2026` để thống nhất trình tự cấp phép SXKD và XNK hóa chất Bảng 2, 3 theo cơ chế **hóa chất cần kiểm soát đặc biệt** (Điều 11–15 `26/2026/NĐ-CP`) và hóa chất Bảng 1 theo cơ chế **hóa chất cấm** (Điều 16–18 `26/2026/NĐ-CP`). Các nghĩa vụ báo cáo hằng năm qua CSDL hóa chất quốc gia và thanh sát OPCW tại `33/2024/NĐ-CP` (Điều 23–33) vẫn áp dụng song song.
  - Theo Điều 30 khoản 4 và khoản 6 `26/2026/NĐ-CP`, giấy phép SXKD/XNK hóa chất Bảng đã cấp theo `33/2024/NĐ-CP` được tiếp tục dùng đến hết thời hạn ghi trên giấy phép (hoặc chuyển tiếp hết `31/12/2026`).
  - *(Lưu ý kỹ thuật dữ liệu kho:* Hồ sơ `registry/van-ban/33-2024-nd-cp.yaml` và `26-2026-nd-cp.yaml` hiện mới ghi nhận việc bãi bỏ khoản 2 Điều 34 của `33/2024/NĐ-CP` mà chưa liệt kê hết các Điều 10–15, 17–20 trong `quan_he`; Cổng MCP và người tra cứu cần đọc Điều 14, 16–18, 30, 31 khoản 4 của `26/2026/NĐ-CP` cùng `33/2024/NĐ-CP`.)*

### 5. Hàng hóa nguy hiểm theo mã số UN (`34/2024/NĐ-CP`) khi thông quan & vận chuyển

- **Phân loại theo 9 loại/nhóm loại & số UN (Điều 4–5 `34/2024/NĐ-CP`):** Phụ lục I phân theo **số UN** và số hiệu nguy hiểm (Loại 1 chất nổ → Loại 9 chất/vật phẩm nguy hiểm khác), **không gắn mã HS**. Lưu ý: vỏ bao bì, thùng chứa chưa được làm sạch bên trong/bên ngoài sau khi dỡ hàng vẫn bị coi là hàng nguy hiểm tương ứng (Điều 4 khoản 2).
- **Nghĩa vụ bao bì, ghi nhãn và giám sát hải quan (Điều 6, 7, 29):**
  - Bao bì, thùng chứa đối với **hàng hóa nhập khẩu** thực hiện theo khuyến cáo và yêu cầu của nhà sản xuất (Điều 6 khoản 1).
  - Ngoài nhãn hàng hóa theo pháp luật nhãn ([[concepts/nhan-hang-hoa-nhap-khau]]) và Luật Hóa chất, mặt ngoài mỗi bao bì phải dán **biểu trưng nguy hiểm** và **báo hiệu nguy hiểm** (bên dưới biểu trưng) theo Phụ lục III (Điều 7).
  - Bộ Tài chính / cơ quan Hải quan kiểm tra, giám sát hàng hóa nguy hiểm và phương tiện chở hàng nguy hiểm trong **địa bàn hoạt động hải quan** (Điều 29).
- **Thẩm quyền cấp & 5 ngưỡng miễn Giấy phép vận chuyển (Điều 17):**
  - Bộ Công an cấp phép Loại 1, 2, 3, 4, 9 (trừ thuốc BVTV & quốc phòng); Bộ KH&CN cấp phép Loại 5, 8; UBND cấp tỉnh cấp phép thuốc BVTV; Bộ Quốc phòng cấp cho đơn vị trực thuộc; Loại 7 (phóng xạ) theo pháp luật năng lượng nguyên tử.
  - **Miễn Giấy phép vận chuyển** (Điều 17 khoản 8) nhưng vẫn phải bảo đảm PCCC đối với: LNG/CNG `< 1.080 kg`, LPG `< 2.250 kg`, nhiên liệu lỏng `< 1.500 lít`, hóa chất BVTV `< 1.000 kg`, và hóa chất độc nguy hiểm còn lại.
- **Lưu ý phạm vi & chống nhầm lẫn:** Từ `01/01/2025`, phần vận chuyển hàng nguy hiểm trên đường bộ đã tách sang nghị định đường bộ mới (chưa mở tệp riêng trong sổ); `34/2024/NĐ-CP` tiếp tục `CON_HIEU_LUC` đối với vận chuyển trên **đường thủy nội địa**. Đồng thời, **không** nhầm `34/2024/NĐ-CP` (mã UN) với `33/2024/NĐ-CP` (hóa chất Bảng CWC) như từng xảy ra ở một số chú thích biểu thuế cũ.

### 6. Quy trình tra cứu thực chiến 5 bước trước khi mở tờ khai hóa chất

1. **Chuẩn hóa định danh kỹ thuật từ MSDS & COA:** Thu thập tên IUPAC, **mã CAS** từng thành phần, **hàm lượng % khối lượng**, **số UN**, phân loại GHS và xác định hàng là đơn chất hay hỗn hợp/chế phẩm. *(Việc áp mã HS 8 số thuộc `hs-code-api`.)*
2. **Tra mã CAS (và `khong_co_cas`) trong `24/2026/NĐ-CP` (`cas-index`):** Kiểm tra toàn bộ mảng `theo_cas[cas]` xem rơi vào PL I, II, III hay IV; nếu là hỗn hợp, áp ngưỡng **> 5%** (PL II), **> 1%** (PL III Nhóm 1 & CWC Nhóm 2), **> 5%** (tiền chất CN Nhóm 2), và quy tắc "có thành phần PL III thì toàn hỗn hợp tính là PL III"; kiểm tra `nguong_kg` PL IV.
3. **Tra Danh mục chất ma túy & tiền chất (`28/2026/NĐ-CP` + `73/2021/QH14`):** Soi cả 4 Danh mục `I–IV` (kể cả muối, ester, ether, đồng phân lập thể dù không in CAS riêng); xác định cơ quan quản lý (`BCA`, `BCT`, `BYT`, `BNNMT`, `BQP`) và lưu ý lộ trình **`1,4-Butanediol` trước `31/12/2026`**.
4. **Kiểm tra giấy phép CWC, giấy phép `26/2026/NĐ-CP` & Khai báo hóa chất NK:**
   - Nếu thuộc PL III `24/2026/NĐ-CP` (hóa chất cần kiểm soát đặc biệt) hoặc hóa chất Bảng CWC → xin **Giấy phép XK/NK của BCT** qua Cổng một cửa quốc gia trước khi thông quan (kèm chấp thuận BCA nếu xuất khẩu tiền chất CN, hoặc End-User Certificate nếu xuất khẩu Bảng 3 ngoài CWC).
   - Nếu thuộc **Chương 28 hoặc Chương 29** (nhưng không thuộc diện miễn Điều 6 khoản 7 `26/2026/NĐ-CP` như `< 10 kg` hoặc đã có Giấy phép NK kiểm soát đặc biệt/cấm) → thực hiện **Khai báo hóa chất nhập khẩu** qua Cổng thông tin một cửa quốc gia trước khi thông quan.
   - Nếu là **sản phẩm, hàng hóa chứa hóa chất nguy hiểm** → kiểm tra nghĩa vụ khai báo hàm lượng lên CSDL chuyên ngành hóa chất và công bố thông tin (Điều 28–29 `26/2026/NĐ-CP`).
5. **Kiểm tra vận chuyển hàng nguy hiểm & KTCN khác:** Tra số UN theo `34/2024/NĐ-CP` để dán biểu trưng/báo hiệu nguy hiểm và kiểm tra ngưỡng Giấy phép vận chuyển; kiểm tra thêm danh mục rủi ro hàng hóa nếu thuộc nhóm tiền chất thuốc nổ/hóa chất công nghiệp (`33/2026/TT-BCT`) hoặc vật liệu cháy nổ/PCCC (`125/2026/TT-BCA`).

## Key sources

- `registry/van-ban/24-2026-nd-cp.yaml` (`24/2026/NĐ-CP`, `CON_HIEU_LUC`, `NGUON_A`) — `danh-muc/24-2026-nd-cp-cas.csv` (`1.377` dòng), `danh-muc/24-2026-nd-cp-cas-quy-tac.md` & `dist/cas-index.json`.
- [[sources/26-2026-nd-cp]] (`26/2026/NĐ-CP`, `CON_HIEU_LUC`, `NGUON_A`) — quy định khai báo NK (Điều 6), giấy phép (Điều 10, 14, 18), hóa chất nguy hiểm trong sản phẩm (Điều 28–29), chuyển tiếp `31/12/2026` (Điều 30), hiệu lực/bãi bỏ (Điều 31).
- [[sources/28-2026-nd-cp]] (`28/2026/NĐ-CP`, `CON_HIEU_LUC`, `NGUON_A`) & `danh-muc/28-2026-nd-cp.csv` — 4 danh mục ma túy & 79 tiền chất Danh mục IV.
- [[sources/33-2024-nd-cp]] (`33/2024/NĐ-CP`, `CON_HIEU_LUC`, `NGUON_A`) & `danh-muc/33-2024-nd-cp.csv` — Công ước CWC (78 dòng Bảng 1–3).
- [[sources/34-2024-nd-cp]] (`34/2024/NĐ-CP`, `CON_HIEU_LUC`, `NGUON_A`) — Danh mục hàng hóa nguy hiểm theo mã UN & vận chuyển.
- [[sources/73-2021-qh14]] (`73/2021/QH14`, `CON_HIEU_LUC`, `NGUON_A`) — Luật Phòng, chống ma túy.
- Văn bản nền Luật Hóa chất & hướng dẫn: `registry/van-ban/69-2025-qh15.yaml` (`69/2025/QH15`), `registry/van-ban/25-2026-nd-cp.yaml` (`25/2026/NĐ-CP`), `registry/van-ban/01-2026-tt-bct.yaml` (`01/2026/TT-BCT`), `registry/van-ban/31-2022-tt-btc.yaml` (`31/2022/TT-BTC`), [[sources/33-2026-tt-bct]] (`33/2026/TT-BCT`), `registry/van-ban/125-2026-tt-bca.yaml` (`125/2026/TT-BCA`), [[sources/105-2016-qh13]] (`105/2016/QH13`), [[sources/44-2024-qh15]] (`44/2024/QH15`).

## Related concepts

- [[concepts/khai-bao-hoa-chat-nhap-khau]]
- [[concepts/giay-phep-hoa-chat-co-dieu-kien]]
- [[concepts/hoa-chat-nguy-hiem-trong-hang-hoa]]
- [[concepts/doc-tinh-trang-hieu-luc]]
- [[concepts/nhan-hang-hoa-nhap-khau]]
- [[concepts/thu-tuc-hai-quan-xnk]]

## Mentioned in

- [[summary/khung-thu-tuc-hai-quan]]
- [[summary/van-ban-sap-het-hieu-luc-2026-2027]]

## Notes

- Không phải tư vấn pháp lý; luôn đối chiếu toàn văn Công báo số 77 (`24/2026/NĐ-CP`), Công báo số 78 (`26/2026/NĐ-CP`), Công báo số 82 (`28/2026/NĐ-CP`) và bản ký số `33/2024/NĐ-CP`, `34/2024/NĐ-CP`, `73/2021/QH14` trước khi khai báo hải quan.
- **Văn bản lịch sử đã hết hiệu lực được nhắc trong ngữ cảnh thay thế/bãi bỏ:** `06/2007/QH12` (đã hết hiệu lực từ `01/01/2026`, bị thay thế bởi `69/2025/QH15`), `113/2017/NĐ-CP` và `82/2022/NĐ-CP` (đã hết hiệu lực từ `17/01/2026`, bị thay thế bởi `26/2026/NĐ-CP`), `57/2022/NĐ-CP` và `90/2024/NĐ-CP` (đã hết hiệu lực từ `19/01/2026`, bị thay thế bởi `28/2026/NĐ-CP`), `23/2000/QH10` (đã hết hiệu lực từ `01/01/2022`, bị thay thế bởi `73/2021/QH14`), `73/2018/NĐ-CP` (tiền thân trước đây của danh mục ma túy, đã hết hiệu lực từ `25/08/2022`).
- **Điểm mù cần tiếp tục hoàn thiện ở sổ/wiki:** (1) `24/2026/NĐ-CP`, `25/2026/NĐ-CP`, `69/2025/QH15`, `01/2026/TT-BCT` chưa có trang riêng trong `wiki/sources/` và chưa trích `xac_minh.dieu_khoan`; (2) cần cập nhật `quan_he` trong `registry/van-ban/26-2026-nd-cp.yaml` và `33-2024-nd-cp.yaml` để phản ánh đầy đủ việc Điều 31 khoản 4 `26/2026/NĐ-CP` bãi bỏ điểm a khoản 14 Điều 4 và các Điều 10–15, 17–20 của `33/2024/NĐ-CP`, đồng thời đồng bộ lại `khai-bao-hoa-chat-nhap-khau` và `giay-phep-hoa-chat-co-dieu-kien` theo toàn văn `26/2026/NĐ-CP`; (3) cần đăng ký nghị định đường bộ năm 2024 tách phạm vi vận chuyển hàng nguy hiểm đường bộ ra khỏi `34/2024/NĐ-CP` từ `01/01/2025`.
