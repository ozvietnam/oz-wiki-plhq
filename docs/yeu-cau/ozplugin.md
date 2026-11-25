# Yêu cầu tích hợp từ ozplugin ("Cổng OZ")

> Chỉ là tài liệu yêu cầu khởi tạo (10/10/2026). **Cập nhật Wave 29:** Toàn bộ **W1–W4 đã hoàn tất** và được mở rộng tương thích ngược lên lược đồ **`1.6.0`** (đồ thị sửa đổi cấp Điều khoản `trang_thai_dieu` + `lich_su_tac_dong`, tra cứu theo ngày `tai_ngay`, 2 tuyến `sap_co_hieu_luc`, cổng OOS `ngoai_pham_vi`, MCP resource `plhq://huong-dan/quy-trinh-agent`, phát hành GitHub Release `dist-YYYY-MM-DD` kèm `SHA256SUMS` và chuỗi CC BY 4.0 thống nhất).

## Bối cảnh

**ozplugin** là cổng MCP ("Cổng OZ") cho trợ lý AI của người làm xuất nhập khẩu. Cổng **không tự suy luận
pháp lý**: chỉ chuyển nguyên văn tình trạng hiệu lực từ kho này, qua
`hs-code-api` `GET /api/dataset?resource=legal_status&so=…` (hs-code-api chụp `dist/registry.json`).
Sắp tới Cổng cần thêm chiều **mã HS → danh sách văn bản**, từ `dist/hs-index.json`.

Cổng chỉ **đọc**; sai dữ liệu thì mở issue "Sai hiệu lực" (`docs/tich-hop.md:36`).

## Tóm tắt

| # | Yêu cầu | Hiện trạng (cập nhật 25/11/2026) |
|---|---|---|
| W1 | Số phiên bản lược đồ cho tệp máy | **Đã xong** (`LUOC_DO_PHIEN_BAN = "1.5.0"`, xuất kèm lịch sử lược đồ & test semver) |
| W2 | Phát hành ổn định, không phụ thuộc HEAD | **Đã xong** (`.github/workflows/bao-hs-code-api.yml` phát hành Release `dist-YYYY-MM-DD` + `SHA256SUMS` + `releases/latest/download/`) |
| W3 | Giữ ổn định các trường Cổng đọc | **Đã xong** (hợp đồng trường khóa tại `docs/tich-hop.md`, thêm `dist/hs-index-theo-ma.json` & `tools/mcp-server.mjs`) |
| W4 | Chuỗi ghi nguồn và miễn trừ | **Đã xong** (thống nhất chuỗi CC BY 4.0 tại `README.md`, `LICENSE.md`, mọi `dist/*.json`, MCP/CLI & Web V2) |

## W1. Phiên bản lược đồ cho dữ liệu máy

**Hiện trạng.** `dist/registry.json` và `dist/hs-index.json` chỉ có `phien_ban` là **ngày dựng**
(`tools/dung.mjs:25`, `tools/lib/danh-muc.mjs:128`). Hs-index có `luoc_do` trỏ tới tên tệp tài liệu
(`danh-muc.mjs:131`), không phải số phiên bản. Không có changelog lược đồ. Người dùng nhận được bản đổi
cấu trúc mà không biết.

**Yêu cầu.**
1. Cả hai tệp thêm `luoc_do_phien_ban` theo semver, ví dụ `"1.0.0"`. Ngày dựng giữ nguyên ở `phien_ban`.
2. Đổi **phá vỡ** (đổi tên, xoá trường, đổi nghĩa hoặc kiểu giá trị, đổi tên giá trị liệt kê như `tinh_trang`)
   thì tăng số **major**. Thêm trường mới thì tăng minor và không phá bên đọc.
3. Thêm mục "Lịch sử lược đồ" vào `docs/luoc-do-so-dang-ky.md` và `docs/luoc-do-danh-muc-hs.md`, liệt kê từng
   phiên bản và đổi gì. Đề xuất bản đầu `1.0.0` = cấu trúc hiện tại.
4. Hằng số phiên bản đặt một chỗ trong `tools/lib/` để cả hai tệp dùng chung. Thêm một ca vào `npm test`
   kiểm hai tệp có trường này và khớp semver.

**Lý do.** hs-code-api và Cổng so major khi đọc: lệch major thì từ chối dùng bản chụp và báo lỗi, thay vì
trả sai tình trạng hiệu lực cho người khai.

## W2. Phát hành ổn định

**Hiện trạng.** `docs/tich-hop.md:6` hứa URL `raw.githubusercontent.com/.../main/dist/registry.json`.
Bot dựng lại `dist/` sau mỗi lần gộp (`.github/workflows/bao-hs-code-api.yml`), nên tệp trên `main` luôn khớp
`registry/`. Không có release, thẻ hay bản đóng băng. Tệp có thể đổi giữa hai lần Cổng tải, và không có cách
quay về bản trước khi lỗi.

**Yêu cầu.**
1. Mỗi lần `npm run dung` tạo ra `dist/*.json` **khác bản trước**, bot tạo một GitHub Release gắn thẻ
   `dist-YYYY-MM-DD` (thêm hậu tố `.N` nếu trùng ngày), đính kèm `registry.json` và `hs-index.json` nguyên bản
   cùng tệp `SHA256SUMS`. Không tạo release nếu tệp không đổi.
2. Thêm một URL "mới nhất" cố định, ví dụ
   `https://github.com/ozvietnam/oz-wiki-plhq/releases/latest/download/registry.json`.
   Ghi hợp đồng URL này vào `docs/tich-hop.md`, cạnh URL `main` hiện có (giữ URL cũ để không phá bên đang dùng).
3. Ghi trong `docs/tich-hop.md`: URL thẻ cụ thể là bất biến; URL `latest` đổi theo mỗi lần phát hành; bản
   cũ không bị xoá.

**Phương án thay thế** nếu chủ kho không muốn Release: nhánh ổn định `dist-latest` chỉ chứa `dist/*.json`.
Cổng chấp nhận bất kỳ phương án nào, miễn có URL bất biến theo phiên bản và có kèm hash.

## W3. Trường Cổng đọc, đề nghị giữ ổn định

Đã kiểm trên `dist/` hiện tại (2.232 văn bản trong `registry.json`). Cổng **tiêu thụ** các trường sau.
Đề nghị coi đây là hợp đồng: đổi tên hoặc đổi nghĩa thì tăng major (W1).

`dist/registry.json`, mỗi văn bản:

| Trường | Hiện trạng | Ghi chú |
|---|---|---|
| `so_hieu`, `so_hieu_khac` | Có (`so_hieu_khac` chỉ khi sổ khai) | Khoá tra cứu; khoá chuẩn theo `khoa()` |
| `tinh_trang` | Có, 6 giá trị (`docs/luoc-do-so-dang-ky.md:52`) | Cổng hiện nguyên giá trị, không suy lại |
| `het_hieu_luc_tu` | Có 60/2232 | Khi vắng thì không được suy ra "còn hiệu lực" |
| `hieu_luc_tu` | Có 2188/2232 | Kể cả ngày tương lai (`CHUA_CO_HIEU_LUC`) |
| `quan_he` (chiều đi) | Có 100/2232 | Ví dụ `thay_the`, `sua_doi`, `bai_bo`, `tam_ngung`, `huong_dan`, `hop_nhat` |
| `quan_he_nguoc` | Có, tính sẵn | Cổng dùng `bi_thay_the_boi`, `bi_sua_doi_boi`, `bi_bai_bo_boi`, `bi_tam_ngung_boi`; giữ `pham_vi`, `tu_ngay`, `can_cu` |
| `xac_minh.muc`, `xac_minh.hieu_luc_da_doi_chieu` | Có | Cổng hiện cảnh báo "chưa đối chiếu nguồn A" khi `false` |
| `xac_minh.chan` | Có khi khai | Chỉ để Cổng hiểu vì sao chưa đối chiếu; không hiện cho người dùng |
| `nguon[].url`, `bac_nguon_cao_nhat` | Có | Cổng chọn nguồn bậc A làm liên kết "văn bản gốc" |

Lưu ý: ví dụ ở `docs/tich-hop.md:11-26` thiếu `hieu_luc_tu`, `quan_he`, `ngay_ban_hanh` và `nguon`,
nên cũ so với `dist/registry.json` thật. Đề nghị cập nhật ví dụ cùng lúc làm W1.

`dist/hs-index.json`: hiện là danh sách **theo văn bản**; mỗi văn bản có `so_hieu`, `tinh_trang`,
`hieu_luc_tu`, `het_hieu_luc_tu`, `hieu_luc_da_doi_chieu` và mảng `dong` (`ma_hs`, `loai_tac_dong`,
`dieu_kien`, `muc_rui_ro`, `dan_chieu`, `trang`). Cổng sẽ tự đảo chiều thành mã HS → văn bản
(khớp theo tiền tố, như `danh-muc.mjs:127`).

Đề nghị giữ ổn định: tên các trường trên và **danh sách giá trị liệt kê của `loai_tac_dong`** (11 giá trị trong
`docs/luoc-do-danh-muc-hs.md:28`), vì Cổng ánh xạ chúng sang nhãn tiếng Việt cho người dùng cuối
("kiểm tra chuyên ngành", "giấy phép"…). Giá trị mới thêm vào thì ghi trong lịch sử lược đồ.

**Chưa yêu cầu làm ngay:** bản đảo sẵn mã HS → văn bản trong kho. Nếu thấy hợp, chủ kho có thể thêm
`dist/hs-index-theo-ma.json` ở một minor sau. Còn không thì Cổng tự đảo.

## W4. Miễn trừ và ghi nguồn

Cổng sẽ hiện, ở mọi câu trả lời có dùng dữ liệu kho này:

> Tham khảo, không phải tư vấn pháp lý. Xem văn bản gốc: <url nguồn bậc A>.

**Cần chủ kho xác nhận chuỗi ghi nguồn CC BY 4.0.** Hiện có hai cách viết khác nhau:
- `README.md:43` và `docs/tich-hop.md:7`: `"oz-wiki-plhq"`.
- `LICENSE.md:9-10`: `"oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq"`, kèm nêu rõ nếu có chỉnh sửa.

Cổng đề xuất dùng đúng chuỗi của `LICENSE.md`, thêm câu về chỉnh sửa vì Cổng rút gọn và dịch nhãn:

> Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0). Đã rút gọn và đổi nhãn hiển thị.

Xin chủ kho: (a) chọn chuỗi này hoặc đưa chuỗi chính xác khác; (b) thống nhất lại hai nơi đang viết khác nhau
vào một chuỗi duy nhất; (c) cho biết có muốn Cổng ghi thêm ngày `phien_ban` của bản dữ liệu đang dùng không
(Cổng đề xuất có).

## Việc xin chủ kho (tóm lại)

1. Duyệt hoặc chỉnh W1 (số phiên bản `1.0.0` khởi đầu, vị trí lịch sử lược đồ).
2. Chọn Release hay nhánh `dist-latest` cho W2.
3. Xác nhận hợp đồng trường ở W3.
4. Chốt chuỗi ghi nguồn ở W4.

Trong lúc chờ, Cổng tiếp tục dùng đường hs-code-api như hiện nay.
