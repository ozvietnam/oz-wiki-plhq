# Bảng tra CAS — NĐ 24/2026/NĐ-CP (PL I, II, III, IV) — quy tắc & trạng thái nạp

Kèm theo [`24-2026-nd-cp-cas.csv`](24-2026-nd-cp-cas.csv) — mỗi dòng: `cas · ten_chat · ma_hoa_chat · cong_thuc · phan_loai · phu_luc · muc · so_thu_tu · nguon · nhom · nguong_kg`.

**Văn bản:** Nghị định 24/2026/NĐ-CP ngày 17/01/2026 — Quy định các danh mục hoá chất thuộc phạm vi điều chỉnh của Luật Hoá chất 69/2025/QH15.
**Nguồn bậc A (toàn văn PDF bản ký, 88 trang):** <https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/4/24-ndcp.signed.pdf> (truy cập 2026-11-20); trang giới thiệu: <https://vanban.chinhphu.vn/?pageid=27160&docid=216671>.
**Nguồn bậc A (bản có lớp chữ, Công báo số 77):** <https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-24-2026-nd-cp-468796.htm> (truy cập 2026-11-20) — toàn văn lưu tại `raw/download/congbao.chinhphu.vn/24-2026-nd-cp-body.txt` (kèm `.docx` và `.pdf`), dùng làm nguồn chuẩn đồng nhất 100% cho cả 4 Phụ lục: PL I (lượt OZV-1663), PL II (lượt OZV-1594), PL III + PL IV (lượt OZV-1584).

## Cột dữ liệu

- `nhom` (thêm lượt OZV-1584, cuối header): nhóm 1/2 của PL III; **để trống** cho các dòng PL I, PL II, PL IV.
- `muc`: **để trống** cho PL I (chỉ có một bảng duy nhất, không chia mục); `1` cho PL II mục 1; `A`/`B`/`C` cho PL III; `Bảng A` cho PL IV.
- `ma_hoa_chat`: với mọi dòng PL I, PL II, PL III, PL IV từ Công báo số 77 giữ **tên khoa học (danh pháp IUPAC/tiếng Anh) in trong văn bản** (nguồn không có cột mã `CHC-ĐM-xx` như bản nạp tạm PL I cũ; khi văn bản in `---` như PL II STT 779 thì để trống); `ten_chat` là tên chất tiếng Việt đi kèm.
- `nguong_kg` (thêm lượt OZV-1584): ngưỡng khối lượng (kg) tại Bảng A PL IV; **để trống** khi văn bản in `---` ở cột ngưỡng hoặc chất thuộc phụ lục khác. Riêng Amoni nitrat (STT 8) văn bản cho **4 ngưỡng theo thành phần hỗn hợp** — ghi đủ cả 4 vào một ô, phân tách bằng dấu chấm phẩy.

## Cách trích xuất

- **PL I (39 dòng = 39 STT, gồm 38 dòng có CAS + 1 dòng không-CAS, lượt OZV-1663):** trích bằng máy (`python3 -I + re`, script `/tmp/nd24/extract_pl1.py`) từ `raw/download/congbao.chinhphu.vn/24-2026-nd-cp-body.txt` (dòng 92–363, trước tiêu đề `Phụ lục II`) và đối chứng khớp 100% (39/39 hàng, 0 sai khác) với bảng XML số 2 (`Table 2`) của `24-2026-nd-cp-congbao77.docx`, đồng thời dọn bỏ hoàn toàn 35 dòng nạp tạm đầu bảng từ lượt OZV-1579:
  - 38 STT có 1 mã CAS (38 dòng); **38/38 mã CAS đạt checksum mod-10 (100%)**;
  - 1 STT không có CAS và không có công thức cố định (văn bản in `---` ở cả cột CAS và cột Công thức hóa học, nạp với `cas` và `cong_thuc` để trống để giữ liền mạch STT 1–39): STT 12 (`Diisocyanate (TDI, MDI, HDI…)`);
  - STT 23 (`Sodium Bicarbonate` / `Natri bicarbonat`, CAS `144-55-8`) giữ nguyên công thức `CHNaO₃` (ký tự chỉ số dưới Unicode `₃`) theo đúng lớp chữ gốc Công báo số 77.
- **PL II mục 1 (793 dòng = 786 STT, gồm 790 dòng có CAS + 3 dòng không-CAS, lượt OZV-1594):** trích bằng máy (`python3 -I + re`, script `/tmp/nd24/extract_pl2.py`) từ `raw/download/congbao.chinhphu.vn/24-2026-nd-cp-body.txt` (dòng 364–6797, ký tự 4.428–52.530, trước mục 2 quy tắc hỗn hợp 5%) và đối chứng khớp 100% (786/786 hàng, 0 sai khác) với bảng XML số 3 (`Table 3`) của `24-2026-nd-cp-congbao77.docx`:
  - 779 STT có 1 mã CAS (779 dòng);
  - 4 STT đa-CAS tách thành 11 dòng kế thừa cùng STT, tên chất, tên IUPAC và công thức: STT 381 (`Hexabromo cyclododecane`, 3 CAS: `134237-50-6`, `134237-51-7`, `134237-52-8`), STT 395 (`Hexahydromethyl phthalic anhydride`, 3 CAS: `25550-51-0`, `48122-14-1`, `57110-29-9`), STT 544 (`Nonylphenol`, 3 CAS: `25154-52-3`, `104-40-5`, `84852-15-3`), STT 622 (`Phosphorus (White, yellow, red)`, 2 CAS: `12185-10-3`, `7723-14-0`);
  - 3 STT không có CAS (văn bản in `---` ở cột CAS, nạp với `cas` để trống để giữ liền mạch STT 1–786): STT 23 (`Amalgam` / `Hỗn hống kim loại kiềm, kiềm thổ`), STT 741 (`Triorganostannic compounds other than tributyltin compounds` / `Hợp chất Triorganostannic khác với tributyl thiếc`), STT 779 (`Các hợp chất của Niken dạng bột có thể phát tán rộng trong không khí...`);
  - Checksum mod-10: **788/790 dòng CAS đạt checksum mod-10**; 2 dòng (`10037-74-3` ở STT 135 và `7746-08-4` ở STT 634) là lỗi in trong văn bản gốc Công báo số 77 lẫn PDF bản ký — giữ nguyên số in theo quy tắc nguồn bậc A và ghi rõ ở bảng Cờ bên dưới.
- **PL III + PL IV (545 dòng, lượt OZV-1584):** trích từ bản có lớp chữ Công báo số 77 bằng script `/tmp/nd24/extract_pl34_v3.py` (Python thuần, không mạng): quét từng dòng theo cấu trúc STT → tên IUPAC → tên Việt → CAS → mảnh công thức → ngưỡng; mọi CAS chạy checksum mod 10; đa-CAS một dòng tách thành nhiều hàng kế thừa STT; hàng in `---` ở cột CAS (không có CAS) vẫn nạp với `cas` để trống.

## Quy tắc hỗn hợp (trích NGUYÊN VĂN)

### Phụ lục I — hoá chất cơ bản theo ngành

KHÔNG có quy tắc hỗn hợp — PL I liệt kê hoá chất cơ bản thuộc lĩnh vực công nghiệp hoá chất trọng điểm, không điều chỉnh hỗn hợp.

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

## Hồ sơ đối chứng & dọn 35 dòng nạp tạm đầu bảng (OZV-1579 → OZV-1594 → OZV-1663)

Theo kết quả đối chứng ở thẻ OZV-1594 và thực thi dọn ở thẻ OZV-1663, 35 dòng nạp tạm đầu bảng từ lượt OZV-1579 (khi chưa có bản lớp chữ Công báo số 77) đã được **xoá bỏ hoàn toàn** và thay bằng **39 STT Phụ lục I chuẩn** từ Công báo số 77:

1. **10 dòng PL I tạm cũ (đã thay bằng 39 STT PL I chuẩn từ Công báo số 77 ở lượt OZV-1663):**
   - Trong bản Công báo số 77, Phụ lục I có **39 STT** (38 dòng có CAS + 1 dòng STT 12 `Diisocyanate (TDI, MDI, HDI…)` không-CAS, kết thúc bằng STT 39 `Xylene` / `Xylen` `1330-20-7`), không có cột mã `CHC-ĐM-01..10` và không có cột phân loại `"Hóa chất vô cơ"`.
   - Đối chiếu 10 dòng PL I tạm cũ trước khi dọn:
     - **7 mã CAS có trong PL I bản Công báo nhưng lệch STT, cột `ma_hoa_chat` ghi `CHC-ĐM-xx` thay vì tên IUPAC, và 3 dòng khác cách viết tên Việt** (nay đã chuẩn hoá theo đúng STT và tên trong 39 dòng PL I Công báo số 77):
       - `7664-41-7`: bản tạm cũ STT 1 (`Amoniac`, `NH3`) → Công báo PL I **STT 4**, IUPAC `Ammonia (anhydrous)`, tên chất `Amoniac (khan)`, `NH3`.
       - `7697-37-2`: bản tạm cũ STT 2 (`Axit nitric`, `HNO3`) → Công báo PL I **STT 7**, IUPAC `Nitric acid`, tên chất `Axit nitric`, `HNO3`.
       - `7664-93-9`: bản tạm cũ STT 3 (`Axit sulfuric`, `H2SO4`) → Công báo PL I **STT 9**, IUPAC `Sulfuric acid`, tên chất `Axit Sulfuric`, `H2SO4`.
       - `1310-73-2`: bản tạm cũ STT 4 (`Natri hydroxit`, `NaOH`) → Công báo PL I **STT 24**, IUPAC `Sodium hydroxide`, tên chất `Natri hydroxit`, `NaOH`.
       - `7664-38-2`: bản tạm cũ STT 5 (`Axit photphoric`, `H3PO4`) → Công báo PL I **STT 8**, IUPAC `Phosphoric acid`, tên chất `Axit photphoric`, `H3PO4`.
       - `7647-01-0`: bản tạm cũ STT 7 (`Axit clohydric`, `HCl`) → Công báo PL I **STT 6**, IUPAC `Hydrochloric acid`, tên chất `Axit Hydrochloric`, `HCl`.
       - `7664-39-3`: bản tạm cũ STT 10 (`Axit fluorhydric`, `HF`) → Công báo PL I **STT 17**, IUPAC `Hydrogen fluoride`, tên chất `Hydro florua`, `HF`.
     - **3 mã CAS không có trong PL I bản Công báo (đã loại khỏi khối PL I):**
       - `7782-50-5` (`Clo`, bản tạm cũ ghi PL I STT 6): không thuộc PL I (đã có đúng ở PL II STT 177 và PL IV STT 72).
       - `497-19-8` (`Natri carbonat`, bản tạm cũ ghi PL I STT 8): không có trong toàn văn NĐ 24/2026 (PL I STT 23 là `Sodium Bicarbonate` / `Natri bicarbonat` `144-55-8`, `CHNaO₃`).
       - `75-20-7` (`Canxi cacbua`, bản tạm cũ ghi PL I STT 9): không thuộc PL I (đã có đúng ở PL II STT 134).

2. **25 dòng PL II tạm cũ (đã dọn bỏ ở lượt OZV-1663):**
   - **5/25 dòng có mã CAS thuộc PL II bản Công báo nhưng lệch STT, trống `ma_hoa_chat` (tên IUPAC), trống `phan_loai`** — đã có dòng chuẩn đầy đủ trong khối 793 dòng PL II Công báo số 77:
     - `7429-90-5` (PL II **STT 21**, `Aluminium powder` / `Bột nhôm`, `Al`), `74-83-9` (PL II **STT 93**, `Bromom ethane` / `Metyl bromit`, `CH3Br`), `63-25-2` (PL II **STT 521**, `1-naphthyl methylcarbamate` / `1-naphtyl metyl cacbamat`, `C12H11NO2`), `107-02-8` (PL II **STT 595**, `Acrolein (2-Propenal)` / `Acrolein`, `C3H4O`), `93-72-1` (PL II **STT 641**, `Silvex` / `Silvex`, `C9H7Cl3O3`).
   - **20/25 dòng còn lại không thuộc PL II bản Công báo:**
     - 9 mã thuộc PL III nhóm 2 mục C (Rotterdam/Stockholm, đã có đủ trong khối PL III): `93-76-5`, `116-06-3`, `86-50-0`, `485-31-4`, `8001-35-2`, `2425-06-1`, `1563-66-2`, `6164-98-3`, `17804-35-2`.
     - 2 mã thuộc PL IV Bảng A (đã có đủ trong khối PL IV): `2642-71-9` (PL IV STT 16), `470-90-6` (PL IV STT 70).
     - 9 mã không có trong toàn văn NĐ 24/2026 (đã loại bỏ): `61-82-5`, `101-27-9`, `25057-89-0`, `10605-21-7`, `5234-68-4`, `999-81-5`, `28772-56-7`, `1689-84-5`, `1689-99-2`.

## Cấu trúc 4 Phụ lục đã nạp từ Công báo số 77

- **PL I** ("Hóa chất cơ bản thuộc lĩnh vực công nghiệp hóa chất trọng điểm"): **39 STT (39 dòng CSV = 38 dòng có CAS + 1 dòng không-CAS)**.
- **PL II mục 1** ("Chất sản xuất, kinh doanh có điều kiện"): **786 STT (793 dòng CSV = 790 dòng có CAS + 3 dòng không-CAS)**.
- **PL III nhóm 1** — mục A "Các tiền chất công nghiệp" (22 chất); mục B "Các hóa chất thuộc phạm vi điều chỉnh của công ước về vũ khí hóa học": mã **2A** (2 chất), **2A\*** (BZ, 1 chất), **2B** tiền chất (10 dòng CAS); mục C "Hóa chất khác" (113 dòng CAS).
- **PL III nhóm 2** — mục A tiền chất công nghiệp (20 chất); mục B công ước vũ khí hóa học: **3A** (4 chất), **3B** tiền chất (13); mục C Rotterdam/Stockholm (84 dòng CAS, gồm nhóm POP nhiều CAS cùng tên).
- **PL III không in cột số thứ tự** → `so_thu_tu` để trống (không tự đánh số).
- **PL IV Bảng A**: **271 STT (276 dòng CSV = 266 dòng có CAS + 10 dòng không-CAS)**; **Bảng B** là bảng phân loại GHS (không có CAS) — không nạp vào CSV này.

## Cờ lỗi in trong văn bản gốc (CAS / công thức bất thường đã ghi nhận)

| CAS | Vị trí | Vấn đề | Xử lý |
|---|---|---|---|
| `144-55-8` | PL I STT 23 (Sodium Bicarbonate / Natri bicarbonat) | Lớp chữ Công báo 77 (cả `.docx` lẫn `.txt`) gõ trực tiếp ký tự chỉ số dưới Unicode `₃` (`CHNaO₃`) thay vì thẻ subscript XML trên chữ số ASCII `3` | **Giữ nguyên văn nguồn `CHNaO₃`** |
| `10037-74-3` | PL II STT 135 (Calcium chlorate / Canxi clorat, `Ca(ClO3)2`) | Không đạt checksum mod 10 (checksum = 8 ≠ 3; mã CAS chuẩn quốc tế của Calcium chlorate là `10137-74-3`, lỗi in chữ số thứ 3 `1→0` trong cả Công báo 77 lẫn PDF bản ký) | **Giữ nguyên số in `10037-74-3`** theo quy tắc nguồn bậc A |
| `7746-08-4` | PL II STT 634 (Selenium dioxide / Selen dioxit, `SeO2`) | Không đạt checksum mod 10 (checksum = 9 ≠ 4; mã CAS chuẩn quốc tế của Selenium dioxide là `7446-08-4`, lỗi in chữ số thứ 2 `4→7` trong cả Công báo 77 lẫn PDF bản ký) | **Giữ nguyên số in `7746-08-4`** theo quy tắc nguồn bậc A |
| `305-03-3` | PL II STT 175 (Chlo rambucil / Clo rambucil) | Bản gốc Công báo 77 lẫn PDF bản ký (trang 14) in công thức `C14H19CI2NO2` (chữ `I` hoa thay vì chữ `l` thường của `Cl2`) | **Giữ nguyên văn nguồn `C14H19CI2NO2`** |
| `79-44-7` | PL II STT 285 (Dimethyl carbamoyl chloride / Dimetyl amin carbonyl clorua) | Bản gốc Công báo 77 in công thức `C3H6CINO` (chữ `I` hoa thay vì chữ `l` thường của `Cl`) | **Giữ nguyên văn nguồn `C3H6CINO`** |
| `142-62-1` | PL II STT 335 (Ethyl chlorothioformate / Etyl clo thioformat) | Bản gốc Công báo 77 in CAS `142-62-1` và công thức `C6H12O2` (trùng với STT 401 Hexanoic acid; CAS chuẩn của Ethyl chlorothioformate là `2941-64-2`, `C3H5ClOS`) | **Giữ nguyên văn nguồn** |
| `50-00-00` | PL IV STT 112 (Formaldehit > 90%) | Thừa 1 chữ số do lỗi in/OCR | **Đã vá thành `50-00-0`** theo tiền lệ OZV-1579 (50-00-0 cũng có mặt trong PL II STT 374 và PL III cùng văn bản) |
| `10118-77-6` | PL IV STT 207 (1-Propen-2-clo-1,3-diol diacetat) | Không đạt checksum mod 10 | **Giữ nguyên số in**, cần đối chiếu bản scan PDF bản ký trước khi sửa |
| `460-19-5` | PL IV STT 261 (Xyanogen/Etandinitril) | Lớp chữ Công báo 77 (docx lẫn txt) ghi công thức `C2H2`; công thức hoá học chuẩn của etandinitril là **C2N2** (N≡C–C≡N) | **Giữ nguyên văn nguồn `C2H2`**, chờ đối chiếu bản scan bản ký |
| `80-12-6` | PL IV STT 227 (Tetrametylen disunphotetramin) | Lớp chữ Công báo 77 ghi công thức `C4H8N4O4S12`; công thức chuẩn của TETS là **C4H8N4O4S2** | **Giữ nguyên văn nguồn**, chờ đối chiếu bản scan bản ký |
| `22397-33-7` | PL IV STT 116 (tetroxacyclononat >75%) | Lớp chữ ghi số đầu tên EN thành `33.6.6.9.9-`; tên Việt cùng dòng in đúng `3,3,6,6,9,9-` | **Đã vá theo tên Việt cùng dòng** thành `3,3,6,6,9,9-Hexamethyl-1,2,4,5-tetroxacyclononate (>75%)` |

## Trạng thái nạp dữ liệu (tổng 1.377 dòng dữ liệu — HOÀN TẤT 100% theo Công báo số 77)

- **PL I (nguồn Công báo số 77): 39 dòng (STT 1–39, gồm 38 dòng có CAS + 1 dòng không-CAS) — HOÀN TẤT** (lượt OZV-1663; đã dọn bỏ 35 dòng nạp tạm lượt OZV-1579).
- **PL II mục 1 (nguồn Công báo số 77): 793 dòng (STT 1–786, gồm 790 dòng có CAS + 3 dòng không-CAS) — HOÀN TẤT** (lượt OZV-1594).
- **PL III nhóm 1–2 (nguồn Công báo số 77): 269 dòng (gồm 268 dòng có CAS + 1 dòng không-CAS) — HOÀN TẤT** (lượt OZV-1584).
- **PL IV Bảng A (nguồn Công báo số 77): 276 dòng (STT 1–271, gồm 266 dòng có CAS + 10 dòng không-CAS) — HOÀN TẤT** (lượt OZV-1584).
- Bảng B PL IV (phân loại GHS) và các phần thân Nghị định 1–12: không thuộc phạm vi bảng CAS.

## Kết quả tra thử cho ca OZV-1575 (cập nhật đồng nhất 4 Phụ lục lượt OZV-1663)

- **7429-90-5 (Bột nhôm / Aluminium powder):** CÓ — **PL II mục 1, STT 21** (bản Công báo số 77).
- **103-79-7 (Phenylacetone / P2P):** CÓ — **PL III nhóm 1, mục A** (tiền chất công nghiệp).
- **7732-18-5 (Nước):** KHÔNG có trong cả 4 phụ lục (đúng kỳ vọng — chất không thuộc danh mục).
- **64742-94-5 (Solvent naphtha):** **KHÔNG có trong toàn văn 4 phụ lục NĐ 24/2026/NĐ-CP** (0/1.362 dòng CAS toàn bảng Công báo số 77).
- **1330-20-7 (Xylene / Xylen):** CÓ — **PL I STT 39** (`Xylene` / `Xylen`, `C8H10`, hoá chất cơ bản thuộc lĩnh vực công nghiệp hoá chất trọng điểm); **KHÔNG có trong PL II, PL III, PL IV**.
