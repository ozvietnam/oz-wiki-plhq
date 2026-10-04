# 10 luồng công việc

Mỗi luồng có nhãn GitHub riêng (`luong:<id>`), đầu vào, đầu ra và tiêu chí xong rõ ràng. Người hay agent
đều nhận việc theo cùng một cách: chọn issue có nhãn luồng → ghi "nhận" trong issue → làm → mở PR có
`npm test` xanh. Báo cáo điểm mù ([bao-cao/diem-mu.md](../bao-cao/diem-mu.md)) chia sẵn việc theo luồng.

| # | Luồng | Nhãn | Một câu |
|---|---|---|---|
| 1 | Do thám văn bản mới | `luong:do-tham` | Phát hiện văn bản mới ban hành có ảnh hưởng tới XNK |
| 2 | Hệ thống hoá | `luong:he-thong-hoa` | Điền đủ, đúng, thống nhất thông tin từng văn bản trong sổ |
| 3 | Hiệu lực cũ – mới, phủ định | `luong:hieu-luc` | Ghi đúng ai thay ai, ai sửa ai, ai bãi bỏ, ai tạm ngưng — từ ngày nào |
| 4 | Truy vết nguồn uy tín | `luong:truy-vet-nguon` | Mỗi văn bản có ít nhất một nguồn bậc A |
| 5 | Tải & làm sạch | `luong:nap-lam-sach` | Toàn văn gốc vào `raw/`, có dấu vân tay, bản chữ sạch |
| 6 | Điểm mù | `luong:diem-mu` | Tìm thứ thư viện chưa biết là mình chưa biết |
| 7 | Liên kết chéo | `luong:lien-ket-cheo` | Nối văn bản với văn bản, wiki với sổ, khái niệm với khái niệm |
| 8 | Cây dữ liệu XNK | `luong:cay-du-lieu` | Giữ cây phân nhánh gọn, đủ, đúng thực tế nghiệp vụ |
| 9 | Đọc hiểu vào wiki | `luong:doc-hieu` | Đọc toàn văn, viết trang wiki có trích điều khoản |
| 10 | Danh mục mã HS | `luong:danh-muc-hs` | Trích bảng mã HS trong phụ lục văn bản → biết mã nào chịu văn bản nào |

---

## 1. Do thám văn bản mới — `luong:do-tham`

- **Mục tiêu:** không để lọt văn bản mới (luật, nghị định, thông tư, quyết định công bố danh mục, công văn hướng dẫn chung) có ảnh hưởng tới xuất nhập khẩu.
- **Nguồn quét:** Công báo (congbao.chinhphu.vn), vanban.chinhphu.vn, vbpl.vn, customs.gov.vn, cổng các bộ (xem [nguồn uy tín](../registry/nguon-uy-tin.yaml)). Ưu tiên 8 bộ có danh mục kiểm tra chuyên ngành.
- **Đầu ra:** mỗi văn bản mới một tệp trong `registry/van-ban/` (dùng `node tools/them-van-ban.mjs "<số hiệu>" --ten ... --url ... --nhanh ...`), `tinh_trang: CHUA_XAC_MINH` nếu chưa chắc. Thay/sửa văn bản cũ thì ghi luôn `quan_he`.
- **Xong khi:** PR có văn bản mới + nguồn; nếu thay văn bản cũ thì báo điểm mù `MAU_THUAN_HIEU_LUC` đã hết.
- **Cho agent:** chạy theo lịch (vd mỗi sáng), so với sổ bằng `khoa()` trong `tools/lib/registry.mjs` để không tạo trùng. Một PR một nhóm văn bản cùng ngày.

## 2. Hệ thống hoá — `luong:he-thong-hoa`

- **Mục tiêu:** mỗi văn bản trong sổ có đủ tên chính xác, loại, cơ quan, ngày ban hành, ngày hiệu lực, nhánh cây.
- **Đầu vào:** điểm mù `VAN_BAN_KHUNG`, `THIEU_VAN_BAN`, `CHUA_PHAN_LOAI`.
- **Quy tắc:** tên văn bản chép **nguyên văn** từ nguồn A. Số hiệu đúng chuẩn (`28/2026/TT-BCT`, `1182/QĐ-BCT`). Tệp đặt tên theo `slugTuSoHieu`.
- **Xong khi:** `node tools/kiem-tra.mjs` không lỗi, điểm mù tương ứng biến mất.

## 3. Hiệu lực cũ – mới, phủ định — `luong:hieu-luc`

- **Mục tiêu:** trả lời đúng câu "văn bản này còn dùng được không, từ ngày nào thì không".
- **Ghi gì:** ở văn bản **MỚI**: `quan_he.thay_the / sua_doi / bai_bo / tam_ngung / huong_dan / hop_nhat`; dạng đầy đủ `{so_hieu, pham_vi: "Điều 4", tu_ngay: YYYY-MM-DD, can_cu: "Điều 97 khoản 2 điểm b"}`. Ở văn bản **CŨ**: `tinh_trang`, `het_hieu_luc_tu`.
- **Phân biệt kỹ:** *thay thế* (cả văn bản) ≠ *sửa đổi* (một phần) ≠ *bãi bỏ* (không có văn bản thay) ≠ *tạm ngưng* (chưa bị bãi bỏ, có thể sống lại — vd NĐ 46/2026 thay NĐ 15/2018 nhưng đang tạm ngưng nên NĐ 15/2018 vẫn áp dụng).
- **Đầu vào:** điểm mù `MAU_THUAN_HIEU_LUC`, `SAP_HET_HIEU_LUC`, `SAP_CO_HIEU_LUC`, `HUONG_DAN_MO_COI`, `HIEU_LUC_CHUA_DOI_CHIEU`.
- **Xong khi:** đặt `xac_minh.hieu_luc_da_doi_chieu: true` + `ngay` + `boi` **chỉ sau khi** mở nguồn bậc A.

## 4. Truy vết nguồn uy tín — `luong:truy-vet-nguon`

- **Mục tiêu:** mọi văn bản có ít nhất một URL bậc A; mọi thông tin đến từ bài báo/bài tổng hợp được truy về văn bản gốc.
- **Đầu vào:** điểm mù `KHONG_NGUON_A`, `CANH_BAO_NGUON`; văn bản có `xac_minh.muc: NGUON_THU_CAP`.
- **Đầu ra:** thêm `nguon: [{url, truy_cap}]`, nâng `xac_minh.muc`. Nguồn mâu thuẫn nhau → ghi cả hai vào `ghi_chu` và mở issue, không tự chọn.
- **Thêm tên miền vào bậc A/B:** PR sửa `registry/nguon-uy-tin.yaml` kèm lý do.

## 5. Tải & làm sạch — `luong:nap-lam-sach`

- **Mục tiêu:** có bản gốc toàn văn trong kho để đọc, đối chiếu, trích dẫn.
- **Công cụ:** `node tools/nap.mjs <url> --so-hieu "<số hiệu>" --ghi` → `raw/download/<tên miền>/<slug>.pdf|html` + `.nguon.json` (url, ngày, sha256, bậc nguồn) + `.txt` sạch với HTML. Trang giới thiệu có link PDF thì công cụ gợi ý tải PDF.
- **Quy tắc:** `raw/` bất biến — không sửa, không xoá; nội dung khác cùng tên thì báo lỗi (có thể văn bản đã bị sửa ở nguồn → mở issue hiệu lực). PDF quét ảnh: ghi chú để luồng 9 OCR, không tự gõ lại.
- **Xong khi:** `toan_van` có trong tệp sổ, điểm mù `KHONG_TOAN_VAN` biến mất.

## 6. Điểm mù — `luong:diem-mu`

- **Mục tiêu:** biết mình chưa biết gì. `node tools/diem-mu.mjs` chạy tự động hằng tuần (GitHub Actions) và mở/cập nhật issue "Báo cáo điểm mù".
- **Việc của luồng:** (a) xử lý điểm mức **Cao** hoặc chia việc cho luồng đúng; (b) **đề xuất luật phát hiện mới** trong `tools/diem-mu.mjs` (kèm test trong `tools/test/run.mjs`) — vd "thông tư danh mục không có mã HS", "nghị định chức năng bộ cũ hơn đợt sáp nhập".
- **Cũng là điểm mù:** câu hỏi người dùng hỏi mà wiki không trả lời được → mở issue mẫu "Điểm mù".

## 7. Liên kết chéo — `luong:lien-ket-cheo`

- **Mục tiêu:** đi từ một văn bản tới mọi thứ liên quan: văn bản gốc nó hướng dẫn, văn bản sửa nó, trang wiki giải thích nó, mặt hàng/mã HS chịu tác động.
- **Đầu ra:** `quan_he.huong_dan` trong sổ; trong wiki dùng `[[slug]]` hai chiều theo quy tắc LuminaWiki; mọi số hiệu nhắc trong wiki phải có trong sổ (điểm mù `WIKI_NHAC_CHUA_DANG_KY`).
- **Kiểm:** `/lumi-check` (liên kết hỏng, thiếu liên kết ngược) + `npm test`.

## 8. Cây dữ liệu XNK — `luong:cay-du-lieu`

- **Mục tiêu:** cây trong [`registry/cay-xnk.yaml`](../registry/cay-xnk.yaml) phản ánh đúng cách người làm XNK tra cứu: Luật Hải quan → nghị định → thông tư thủ tục; biểu thuế; phân loại HS; xuất xứ & FTA; kiểm tra chuyên ngành theo bộ; sổ tay nghiệp vụ...
- **Việc:** thêm nút còn thiếu, tách nút quá to, gắn `can_co` (loại văn bản bắt buộc phải có) để điểm mù báo khi nhánh thiếu luật/nghị định gốc; xếp văn bản `chua-phan-loai`.
- **Xong khi:** `bao-cao/cay-van-ban.md` (chạy `npm run dung`) đọc thấy hợp lý với người làm nghề.

## 9. Đọc hiểu vào wiki — `luong:doc-hieu`

- **Mục tiêu:** biến toàn văn thành kiến thức dùng được: tóm tắt, nghĩa vụ chính, thời hạn, ngoại lệ, chuyển tiếp — **có trích điều, khoản**.
- **Cách làm:** mở phiên AI trong repo, gõ `/lumi-ingest raw/download/.../<tệp>`; duyệt bản nháp; `/lumi-verify` đối chiếu lại với toàn văn. Trang nguồn ghi số hiệu chuẩn để nối với sổ.
- **Ưu tiên:** văn bản đang có hiệu lực, được biểu thuế dẫn nhiều (`trich_dan_trong_bieu_thue`), danh mục KTCN 2026.
- **Xong khi:** `/lumi-check` sạch, `npm test` xanh, trang có trong `wiki/index.md`.

## 10. Danh mục mã HS — `luong:danh-muc-hs`

- **Mục tiêu:** với mỗi văn bản có phụ lục mã HS (danh mục KTCN 2026, cấm, giấy phép, phòng vệ thương mại…), có
  `danh-muc/<slug>.csv` trích **nguyên văn** từ bản gốc → ứng dụng trả lời được "mã 8 số này hôm nay chịu văn bản
  nào, theo phụ lục nào, điều kiện gì".
- **Đầu vào:** điểm mù `DANH_MUC_CHUA_TRICH` (xếp sẵn: danh mục KTCN từ 01/7/2026 trước, rồi theo số mã biểu thuế dẫn).
- **Cách làm:** [docs/luoc-do-danh-muc-hs.md](luoc-do-danh-muc-hs.md). Bản có phụ lục thường là **Công báo** (có lớp
  chữ); trích bằng máy, không gõ lại, không đoán mã; bản chỉ có ảnh quét → ghi chú và để lại.
- **Kiểm:** `npm test` (định dạng), `npm run diem-mu` (mã không có trong biểu thuế → `HS_KHONG_TON_TAI`); PR kèm 10 dòng
  mẫu đặt cạnh nguyên văn.
- **Xong khi:** bảng qua kiểm, `HS_KHONG_TON_TAI` của bảng = 0 hoặc từng mã đã giải thích, YAML có `danh_muc_hs`.

