# Yêu cầu từ hs-code-api: dữ liệu có cấu trúc cho TT 85/2026/TT-BTC

Người gửi: nhóm dev `hs-code-api` (API tra mã HS cho ERP của Oz). Người vận hành: ozvietnam.

## Vì sao

CEO yêu cầu mọi cách gọi và cách trả lời của `hs-code-api` phải có căn cứ pháp luật. `hs-code-api` sẽ có module
`lib/legal-basis.js` là nơi **duy nhất** được trích điều luật (như `lib/gir.js` làm với 6 quy tắc GIR); mỗi phản hồi có
`canCuPhapLy[]` ghi bước nào đã quyết định mã, theo điều/khoản/điểm nào. Trích sai điều luật còn tệ hơn không trích, nên module
đó cần một nguồn điều khoản **do kho này xác minh** để test so khớp, thay vì dev tự gõ lại.

Bản toàn văn đã đọc: `raw/download/congbaocdn.chinhphu.vn/2026/7/18/85-2026-tt-btc.pdf` (sha256 `652932cd…d4fdfe`, 23 trang).

## Việc cần kho này làm (từ quan trọng đến ít quan trọng)

### 1. Điều khoản có cấu trúc của TT 85/2026 (cần nhất)
Tạo tệp có cấu trúc, ví dụ `registry/dieu-khoan/85-2026-tt-btc.yaml` (kho tự chọn đường dẫn/lược đồ, nhưng xin xuất thêm vào `dist/`
để `hs-code-api` đồng bộ như `dist/registry.json`). Mỗi mục: `dieu`, `khoan`, `diem` (nếu có), `noi_dung` **nguyên văn**, `trang_pdf`,
`sha256_pdf`. Tối thiểu các điều sau:

| Điều | Vì sao `hs-code-api` cần |
|---|---|
| 4.1, 4.2 (a–e) | nguyên tắc một mã duy nhất; phải tuân thủ Danh mục, Biểu thuế, 6 quy tắc tổng quát |
| 5.1, 5.2 | kết quả phân loại dùng cho chính sách và thuế theo biểu **có hiệu lực tại thời điểm đăng ký tờ khai** |
| 6.1 (a–d), 6.2, 6.3, 6.4, 6.5 | các tài liệu dùng khi chưa xác định được mã duy nhất; xung đột mô tả; tiêu chuẩn kỹ thuật; mã chuyên ngành; hướng dẫn của Cục trưởng |
| 7, 8 | máy liên hợp/tổ hợp máy Ch.84/85/90; máy tháo rời (quy tắc 2a) |
| 3.3, 12.6, 12.7, 13 | trách nhiệm người khai; thông báo kết quả phân tích là cơ sở xác định thuế; khiếu nại; nguồn của cơ sở dữ liệu |
| 15, 16 | hiệu lực 15/09/2026, thay TT 14/2015 + TT 17/2021, điều khoản chuyển tiếp |

Tiêu chí nghiệm thu: `hs-code-api` chạy được test "mỗi câu trích có nguyên văn trong tệp của kho" mà không phải đọc PDF.

### 2. Cách ghi Điều 6.1 trong sổ đăng ký (xin xem lại câu chữ)
`registry/van-ban/85-2026-tt-btc.yaml` (trường `xac_minh.pham_vi`) ghi "Điều 6.1 thứ tự ưu tiên 4 nguồn tra cứu". Nguyên văn Điều 6.1 chỉ
ghi: "chưa xác định được mã số duy nhất … thì sử dụng các tài liệu sau: a) … b) … c) … d) …". **Văn bản không có cụm "theo thứ tự" hay "ưu tiên".**
Theo nguyên tắc 5 của kho (bất đồng về cách hiểu thì ghi cả hai cách hiểu kèm nguồn), xin ghi: (i) nguyên văn liệt kê a→d; (ii) cách hiểu
"thứ tự ưu tiên" là diễn giải, nếu có văn bản nào (vd Quy trình ở mục 3) xác nhận thì dẫn nguồn.

### 3. Văn bản hướng dẫn chi tiết theo Điều 17.1
Điều 17.1 giao Cục trưởng Cục Hải quan ban hành **Quy trình phân loại hàng hoá, áp dụng mức thuế**; Quy trình phân tích phân loại; Quy chế xây dựng
cơ sở dữ liệu. Nếu thứ tự và cách dùng 4 tài liệu của Điều 6.1 được hướng dẫn chi tiết, nhiều khả năng nằm ở đây. Xin: tìm, xác định số hiệu và
ngày ban hành, mở nguồn bậc A, đăng ký vào `registry/van-ban/`. Nếu chưa ban hành thì ghi là điểm mù.

### 4. TT 121/2025/TT-BTC có sửa TT 39/2018 không
TT 85/2026 nhắc "TT 38/2015 được sửa đổi bởi TT 39/2018 và TT 121/2025". `hs-code-api` đang dẫn **TT 39/2018 mục 1.78** làm căn cứ cho mô tả
hàng khai báo. Xin đối chiếu: TT 121/2025 có sửa/thay mục này (hoặc Điều 29 khoản 5, 5a của TT 38/2015) không; ghi quan hệ sửa đổi kèm `pham_vi`
và điều khoản căn cứ.

### 5. Phối hợp về hai nguồn của Điều 6.1 (không cần kho này nạp)
- **6.1.b Tuyển tập ý kiến phân loại WCO:** Oz có bản quyền dùng nội bộ (mua lại), `hs-code-api` xử lý **riêng tư** (không đưa lên repo công khai vì bản
  quyền WCO). Điểm mù `THIEU_NGUON_WCO_COMPENDIUM` xin đổi trạng thái thành "có nguồn riêng tư, ngoài kho công khai" thay vì kêu gọi mua/nạp.
- **6.1.c SEN của AHTN:** `hs-code-api` đã có SEN 2022 (395 mục / 683 mã); không cần kho này làm gì ngoài việc cập nhật điểm mù.

### 6. Việc nhỏ đã biết
Trang `phan-loai-ma-hs` còn ghi TT 14/2015 (đã được thay thế từ 15/09/2026).

## Phía `hs-code-api` sẽ làm (để kho biết cái gì sắp đọc)
- `lib/legal-basis.js` + trường `canCuPhapLy[]` trong `/api/suggest`, `/api/classify`, `/api/describe`; test so khớp trích dẫn với tệp ở mục 1.
- Tham số `ngayDangKy` cho `/api/tax` (Điều 5.2).
- Mỗi nguồn trong Điều 6.1 sẽ ghi trạng thái thật (đã dùng / chưa có), không khẳng định nguồn chưa tra.
