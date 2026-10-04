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

- Ưu tiên PDF trên `congbaocdn.chinhphu.vn` (thường có lớp chữ). Trích điều khoản thi hành bằng `pypdf`/`pdftotext`; đừng chỉ dựa thẻ HTML.
- `hieu_luc_da_doi_chieu: true` cần **cả** ngày bắt đầu (điều khoản thi hành) **và** tình trạng hiện tại (văn bản sau thay/bãi, hoặc ghi rõ đã kiểm sổ + văn bản khung liên quan như TT 48/2026 không liệt kê).
- Bãi một phần (vd Điều 20 khoản 3 TT 48/2026) → `HET_HIEU_LUC_MOT_PHAN`, không `HET_HIEU_LUC`. Có chuyển tiếp đến ngày X (vd Phụ lục I đến 31-12-2026) thì ghi `het_hieu_luc_tu` như mẫu TT 12/2018.
- Chuỗi thay danh mục cửa khẩu: QĐ 31/2026/QĐ-TTg (Công báo số 393) thay QĐ 23/2019 từ 14-08-2026 — ngày ký trên PDF là 29-06-2026, không nhầm với ngày Công báo.
- Form tìm trên congbao.chinhphu.vn đôi khi trả cùng trang mới nhất bất kể từ khóa — đừng coi đó là “không có văn bản thay”.
