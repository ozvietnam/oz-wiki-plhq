# Bảng tra CAS — NĐ 24/2026/NĐ-CP (PL I, II, III, IV) — quy tắc & trạng thái nạp

Kèm theo [`24-2026-nd-cp-cas.csv`](24-2026-nd-cp-cas.csv) — mỗi dòng: `cas · ten_chat · ma_hoa_chat · cong_thuc · phan_loai · phu_luc · muc · so_thu_tu · nguon · nhom · nguong_kg`.

**Văn bản:** Nghị định 24/2026/NĐ-CP ngày 17/01/2026 — Quy định các danh mục hoá chất thuộc phạm vi điều chỉnh của Luật Hoá chất 69/2025/QH15.
**Nguồn bậc A (toàn văn PDF bản ký, 88 trang):** <https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/4/24-ndcp.signed.pdf> (truy cập 2026-11-20); trang giới thiệu: <https://vanban.chinhphu.vn/?pageid=27160&docid=216671>.
**Nguồn bậc A (bản có lớp chữ, Công báo số 77):** <https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-24-2026-nd-cp-468796.htm> (truy cập 2026-11-20) — dùng làm nguồn nạp PL III + PL IV lượt này (nhánh `tu-lieu/nd24-cong-bao-77`).

## Cột dữ liệu

- `nhom` (thêm lượt OZV-1584, cuối header): nhóm 1/2 của PL III; **để trống** cho các dòng PL I/II/IV và 35 dòng nạp trước.
- `ma_hoa_chat`: với dòng PL III/IV giữ **tên IUPAC/tiếng Anh in trong văn bản** (nguồn không có cột mã CHC như PL I); `ten_chat` là tên Việt đi kèm.
- `nguong_kg` (thêm lượt OZV-1584): ngưỡng khối lượng (kg) tại Bảng A PL IV; **để trống** khi văn bản in "---" ở cột ngưỡng hoặc chất thuộc phụ lục khác. Riêng Amoni nitrat (STT 8) văn bản cho **4 ngưỡng theo thành phần hỗn hợp** — ghi đủ cả 4 vào một ô, phân tách bằng dấu chấm phẩy.

## Cách trích xuất

- **PL I + khối p15–17 (35 dòng):** PDF scan không lớp chữ — render trang ở scale 8 (pdfjs-dist) → **đọc mắt từng dòng từ ảnh gốc** → kiểm checksum CAS bằng máy (`node /tmp/nd24/cascheck.js`; chữ số kiểm = (Σ chữ số × vị trí từ phải, bắt đầu 1) mod 10). 35/35 dòng đạt checksum. **CẢNH BÁO:** mô hình thị giác GLM (analyze_image) **bịa hàng loạt** trên bảng scan dày — không dùng làm nguồn.
- **PL III + PL IV (545 dòng, lượt OZV-1584):** trích từ **bản có lớp chữ** Công báo số 77 (URL trên) bằng script `/tmp/nd24/extract_pl34_v3.py` (Python thuần, không mạng): quét từng dòng theo cấu trục STT → tên IUPAC → tên Việt → CAS → mảnh công thức → ngưỡng; mọi CAS chạy checksum mod 10; đa-CAS một dòng tách thành nhiều hàng kế thừa STT; hàng in "---" ở cột CAS (không có CAS) vẫn nạp với `cas` để trống; STT thiếu dấu chấm do OCR được nhận theo dòng kế là tên.

## Quy tắc hỗn hợp (trích NGUYÊN VĂN)

### Phụ lục I — hoá chất cơ bản theo ngành

KHÔNG có quy tắc hỗn hợp — PL I liệt kê hoá chất cơ bản theo ngành (cột "Phân loại"), không điều chỉnh hỗn hợp.

### Phụ lục II — hoá chất sản xuất, kinh doanh CÓ ĐIỀU KIỆN (mục 2 cuối PL II)

> "Hỗn hợp chất sản xuất, kinh doanh có điều kiện là hỗn hợp chất chứa ít nhất một thành phần trong Danh mục hóa chất sản xuất, kinh doanh có điều kiện của Nghị định này có hàm lượng lớn hơn 5% khối lượng."

### Phụ lục III — hóa chất cần kiểm soát đặc biệt (mục II, cuối PL III)

> "Hỗn hợp chất cần kiểm soát đặc biệt là hỗn hợp chứa ít nhất một thành phần quy định tại Phụ lục này với các trường hợp sau:
> a) Hỗn hợp có chứa thành phần thuộc nhóm 1 của Phụ lục này có hàm lượng lớn hơn 1% khối lượng;
> b) Hỗn hợp có chứa thành phần là hóa chất thuộc công ước quốc tế mà việc phát triển, sản xuất, tàng trữ, sử dụng và chuyển giao bị cấm trong phạm vi phụ lục của công ước về vũ khí hóa học, thuộc nhóm 2 của Phụ lục này có hàm lượng lớn hơn 1% khối lượng;
> c) Hỗn hợp có chứa thành phần là tiền chất công nghiệp thuộc nhóm 2 của Phụ lục này có hàm lượng lớn hơn 5% khối lượng."

> "Trường hợp hỗn hợp chất chứa đồng thời thành phần thuộc Danh mục hóa chất sản xuất, kinh doanh có điều kiện tại Phụ lục II của Nghị định này và thành phần quy định tại Phụ lục này thì hỗn hợp chất đó được coi là hỗn hợp chất cần kiểm soát đặc biệt quy định tại Phụ lục này."

### Phụ lục IV — kế hoạch phòng ngừa, ứng phó sự cố hóa chất (đầu PL IV)

> "Các hóa chất phải xây dựng Kế hoạch phòng ngừa, ứng phó sự cố hóa chất bao gồm các chất quy định tại Bảng A của Phụ lục này và hỗn hợp chứa các chất quy định tại Bảng A khi phân loại theo GHS thuộc trường hợp quy định tại Bảng B của Phụ lục này."

## Cấu trúc PL III + PL IV đã nạp

- **PL III nhóm 1** — mục A "Các tiền chất công nghiệp" (22 chất); mục B "Các hóa chất thuộc phạm vi điều chỉnh của công ước về vũ khí hóa học": mã **2A** (2 chất), **2A\*** (BZ, 1 chất), **2B** tiền chất (10 dòng CAS); mục C "Hóa chất khác" (113 dòng CAS).
- **PL III nhóm 2** — mục A tiền chất công nghiệp (20 chất); mục B công ước vũ khí hóa học: **3A** (4 chất), **3B** tiền chất (13); mục C Rotterdam/Stockholm (84 dòng CAS, gồm nhóm POP nhiều CAS cùng tên).
- **PL III không in cột số thứ tự** → `so_thu_tu` để trống (không tự đánh số).
- **PL IV Bảng A**: 271 STT (không-CAS vẫn nạp đủ hàng); **Bảng B** là bảng phân loại GHS (không có CAS) — không nạp vào CSV này.

## Cờ cần đối chiếu bản scan (CAS bất thường đã ghi nhận)

| CAS | Vị trí | Vấn đề | Xử lý |
|---|---|---|---|
| `50-00-00` | PL IV STT 112 (Formaldehit > 90%) | Thừa 1 chữ số do lỗi in/OCR | **Đã vá thành `50-00-0`** theo tiền lệ OZV-1579 (CAS tra từ cơ sở CAS công khai khi văn bản garble; 50-00-0 cũng có mặt trong PL III cùng văn bản) |
| `10118-77-6` | PL IV STT 207 (1-Propen-2-clo-1,3-diol diacetat) | Không đạt checksum mod 10 | **Giữ nguyên số in**, cần đối chiếu bản scan PDF bản ký trước khi sửa |
| `460-19-5` | PL IV STT 261 (Xyanogen/Etandinitril) | Lớp chữ Công báo 77 (docx lẫn txt) ghi công thức `C2H2`; công thức hoá học chuẩn của etandinitril là **C2N2** (N≡C–C≡N) — nghi lỗi OCR chữ N thành H | **Giữ nguyên văn nguồn `C2H2`**, chờ đối chiếu bản scan bản ký |
| `80-12-6` | PL IV STT 227 (Tetrametylen disunphotetramin) | Lớp chữ Công báo 77 ghi công thức `C4H8N4O4S12`; công thức chuẩn của TETS là **C4H8N4O4S2** — nghi lỗi OCR chỉ số phụ | **Giữ nguyên văn nguồn**, chờ đối chiếu bản scan bản ký |
| `22397-33-7` | PL IV STT 116 (tetroxacyclononat >75%) | Lớp chữ ghi số đầu tên EN thành `33.6.6.9.9-`; tên Việt cùng dòng in đúng `3,3,6,6,9,9-` | **Đã vá theo tên Việt cùng dòng** thành `3,3,6,6,9,9-Hexamethyl-1,2,4,5-tetroxacyclononate (>75%)` |

## Trạng thái nạp dữ liệu (tổng 580 dòng)

- **PL III nhóm 1–2: 269 dòng — HOÀN TẤT** (nguồn: bản lớp chữ Công báo 77).
- **PL IV Bảng A: 276 hàng (STT 1–271, gồm hàng không-CAS) — HOÀN TẤT.**
- PL I: **10/10 dòng — HOÀN TẤT** (bảng in PL I không có cột CAS, số CAS tra từ cơ sở dữ liệu CAS công khai, đã checksum).
- Khối p15–17 (tạm ghi `phu_luc=II, muc=1`): **25 dòng** (21 + 4 STT 34–37). Cờ tạm: ranh giới mục chưa xác minh, xem lịch sử git lượt 3.
- Bảng B PL IV (phân loại GHS) và các phần thân Nghị định 1–12: không thuộc phạm vi bảng CAS.

## Kết quả tra thử cho ca OZV-1575 (cập nhật lượt OZV-1584)

- **7429-90-5 (Bột nhôm):** có — STT 20, tạm PL II (xem quy tắc nạp p15–17).
- **103-79-7 (Phenylacetone/P2P):** có — PL III nhóm 1, mục A (tiền chất công nghiệp).
- **7732-18-5 (Nước):** KHÔNG có trong cả 4 phụ lục (đúng kỳ vọng — chất không thuộc danh mục).
- **64742-94-5 (Solvent naphtha) và 1330-20-7 (Xylene):** **KHÔNG có trong PL III nhóm 1–2 và PL IV Bảng A** (đã quét toàn bộ 544 dòng lượt này); 1330-20-7 cũng chưa thấy trong phần PL I/II đã nạp (STT 1–37) — đóng điểm 4 ca OZV-1575.
