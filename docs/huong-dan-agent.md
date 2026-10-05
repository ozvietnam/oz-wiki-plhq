# Hướng dẫn cho AI agent đóng góp

Kho này nhận đóng góp từ agent (Claude Code, Codex, Gemini CLI, Cursor, agent tự chạy theo lịch...).
Agent phải làm việc như một người đóng góp cẩn thận: có nguồn, có dấu vết, nhỏ, kiểm được.

## Trước khi làm

1. Đọc `README.md` (phần "Quy tắc riêng của thư viện" + schema LuminaWiki), tệp này, và
   [luồng công việc](luong-cong-viec.md) của việc mình nhận.
2. Lấy việc từ: issue có nhãn `luong:*` chưa ai nhận, hoặc [bao-cao/diem-mu.md](../bao-cao/diem-mu.md)
   (chạy `npm run diem-mu` để có bản mới nhất).
3. Ghi một bình luận "nhận" vào issue (ghi rõ là agent và người vận hành) để không trùng việc.

## Khi làm

- **Một PR một việc nhỏ:** một văn bản, một nhóm văn bản cùng ngày, hoặc một trang wiki. PR lớn khó duyệt.
- **Mỗi khẳng định phải có nguồn.** Tình trạng hiệu lực chỉ được đánh `hieu_luc_da_doi_chieu: true` khi
  đủ CẢ HAI: (1) đã đọc điều khoản thi hành trên nguồn bậc A, và (2) đã kiểm **tình trạng hiện tại** — tìm
  văn bản ban hành sau có thay/bãi bỏ/tạm ngưng nó không (thẻ "Văn bản bị thay thế/Tình trạng hiệu lực" trên
  vbpl.vn, tìm số hiệu trên vanban.chinhphu.vn/congbao.chinhphu.vn). Đọc mỗi điều khoản thi hành của chính
  văn bản chỉ chứng minh **ngày bắt đầu**, chưa chứng minh **còn hiệu lực hôm nay**. Ghi
  `xac_minh.boi: <tên-agent>@<người-vận-hành>`, `ngay` và nêu rõ đã kiểm (2) bằng nguồn nào trong `pham_vi`.
  Vì sao chặt: hs-code-api biến văn bản `HET_HIEU_LUC` + `true` thành cảnh báo "đã bị thay" mức HIGH cho
  người khai hải quan.
- **Không suy ra quan hệ thay thế từ tên văn bản.** Phải thấy điều khoản hiệu lực / điều khoản thi hành
  (thường là điều cuối) nói "thay thế", "bãi bỏ", "hết hiệu lực". Ghi `can_cu` (điều, khoản, điểm).
- **Không sửa `raw/` đã có.** Chỉ thêm tệp mới qua `tools/nap.mjs` hoặc skill LuminaWiki.
- **Không xoá văn bản khỏi sổ.** Văn bản hết hiệu lực vẫn giữ — người khai cần biết vì sao không dùng nữa.
- **Không đưa thông tin khách hàng, tờ khai, hợp đồng, giá** vào kho.
- Chạy `npm test` trước khi mở PR. Đỏ thì sửa, không bỏ qua test.
- **Không commit `dist/` và `bao-cao/`.** Đó là tệp sinh tự động; bot dựng lại ngay sau khi PR được gộp
  (workflow `dung-lai-va-bao-hs-code-api`). Commit chúng làm mọi PR mở song song xung đột với nhau. Chạy
  `node tools/dung.mjs && node tools/diem-mu.mjs` để tự xem kết quả thì được, nhưng trước khi commit:
  `git checkout -- dist bao-cao`.
- **Bảng mã HS** (`luong:danh-muc-hs`): theo [lược đồ](luoc-do-danh-muc-hs.md) — một PR một văn bản, trích từ lớp chữ
  của bản có phụ lục (thường là Công báo), không gõ lại, không đoán mã.
- **Ưu tiên việc có ảnh hưởng thật:** nhóm `HS_API_*` trong báo cáo điểm mù được xếp theo số mã HS mà
  hs-code-api đang dẫn văn bản đó (xem [tích hợp](tich-hop.md)). Làm từ trên xuống.

### Kinh nghiệm — tải toàn văn (`luong:nap-lam-sach`)

- **Ưu tiên URL tải:** `datafiles.chinhphu.vn` và `congbaocdn.chinhphu.vn` (từ trang vanban/congbao), rồi `moit.gov.vn/upload/...`. Dùng `node tools/nap.mjs <url> --so-hieu "..." --ghi`.
- **Đối chiếu số hiệu trước khi nạp.** Tên tệp trên CDN đôi khi lệch (vd trang 08/2023/TT-BCT gắn `03-bct.signed.pdf`); tiêu đề trang nguồn A mới là chuẩn. Nếu số hiệu trên Công báo khác nội dung sổ đang mô tả thì **không nạp** — ghi `ghi_chu` và để truy vết lại (bài học `11/2022/TT-BCT`).
- **vbpl.vn FileData / attachment** hay 403/404 — bỏ qua, tìm lại trên vanban/congbao/cổng bộ.
- **OLE `.doc` bị gắn `.docx`:** kiểm magic `D0 CF 11 E0`, đổi đuôi thành `.doc` và sửa `toan_van` (vd `05/2007/QH12`, `108/2008/NĐ-CP`).
- **ZIP trên moit:** được phép trích PDF bên trong, ghi `nguon` trỏ ZIP/trang công bố và ghi chú nếu tên tệp trong ZIP sai (vd `765/QĐ-BCT`).
- PDF ký số dạng ảnh vẫn nạp được; OCR là việc sau.

## Mở PR

- Tiêu đề: `<luồng>: <việc>` — ví dụ `hieu-luc: 28/2026/TT-BCT thay 11/2022/TT-BCT`.
- Mô tả theo mẫu PR: nguồn đã mở (URL bậc A), điều khoản căn cứ, điểm mù đã xử lý (mã), phần chưa chắc.
- Ghi ở cuối: `Agent: <tên> · Người vận hành: <github>`.

## Gợi ý lịch cho agent chạy tự động

| Luồng | Nhịp | Việc |
|---|---|---|
| Do thám | hằng ngày | Quét nguồn A + cổng 8 bộ; tạo văn bản mới |
| Hiệu lực | hằng tuần | Xử lý `SAP_HET_HIEU_LUC`, `SAP_CO_HIEU_LUC`, `MAU_THUAN_HIEU_LUC` |
| Truy vết nguồn | liên tục | 5–10 văn bản `KHONG_NGUON_A` mỗi lượt, ưu tiên `trich_dan_trong_bieu_thue` cao |
| Tải & làm sạch | liên tục | Văn bản đã có nguồn A nhưng chưa có `toan_van` |
| Đọc hiểu | theo đợt | Văn bản có toàn văn mà chưa có trang wiki |
| Điểm mù | hằng tuần (tự động bằng Actions) | Đề xuất luật phát hiện mới khi thấy kiểu lỗi lặp lại |

## Kinh nghiệm đã gặp (cập nhật khi lặp lỗi)

### `hieu-luc` + PDF Công báo

- Ưu tiên PDF trên `congbaocdn.chinhphu.vn` (thường có lớp chữ). Trích điều khoản thi hành bằng `pdftotext`; đừng chỉ dựa thẻ HTML.
- `hieu_luc_da_doi_chieu: true` cần **cả** ngày bắt đầu **và** tình trạng hiện tại (văn bản sau thay/bãi, hoặc ghi rõ đã kiểm).
- Khi Công báo slug 404: thử `datafiles.chinhphu.vn/cpp/files/vbpq/<năm>/<tháng>/NN-cq.signed.pdf`.
- Form tìm congbao/moit đôi khi trả trang generic — 0 hit ≠ chắc chắn không có văn bản.

### `hieu-luc` + HS_API đã cạn nguồn A (đừng săn lặp)

Sau đợt Công báo + PVTM, phần còn lại của `HS_API_UU_TIEN_DOI_CHIEU` thường là **tường cấu trúc**, không phải thiếu cố gắng. Loop chỉ HEAD lại datafiles/trav sẽ không ra PDF mới.

**Trước mỗi vòng săn:** `node tools/san-hieu-luc.mjs` — chỉ làm mục «Làm được ngay». Nếu = 0, **dừng săn hiệu lực** và chuyển luồng khác (`danh-muc-hs`, `do-tham`, `doc-hieu`).

**Khi kẹt:** ghi `xac_minh.chan` (`ma` + `ngay` + `viec_tiep`). Điểm mù chuyển sang `HS_API_CHO_MO_CHAN` (Thấp). Xóa `chan` khi đã đối chiếu xong.

| `chan.ma` | Nghĩa | Việc tiếp hữu ích |
|---|---|---|
| `THIEU_PDF_A` | Không có toàn văn bậc A | Mở stub văn bản thay (nếu nguồn B nêu); theo dõi cổng bộ |
| `THIEU_DIEU_THI_HANH_A` | Biết hết/còn từ văn bản A khác, thiếu điều thi hành của chính nó | Chờ PDF gốc; không OCR lại nguồn C |
| `THIEU_BAI_TUONG_MINH` | Có PDF A nhưng không điều khoản bãi tường minh | Không suy ra hết vì mất khung NĐ; chờ QĐ/TT mới |
| `SO_HIEU_LECH` | Công báo/vbpl không có số hiệu đó | Đối chiếu mã HS bên hs-code-api; mở issue bên kia |
| `CHO_CONG_BO_A` | Biết số hiệu kết quả nhưng cổng A chưa đăng | Theo dõi pvtm/moit tin vụ việc; không probe URL đoán |

**Bẫy đã gặp (04-10-2026):** QĐ CBPG `2105`/`3546` (trav không có file; TVXNK = C); QĐ BCA `6266`/`9981` (không Công báo; customs hay 404); nhóm 2 BKHCN `2711`/`366`/`367` (NĐ 37/TT 36 không bãi tường minh QĐ); `45/2024/TT-BCT` (Công báo không có — có `45/2024/TT-BTC`).
