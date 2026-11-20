# Bảng tra CAS — NĐ 24/2026/NĐ-CP (PL I, II, III, IV) — quy tắc & trạng thái nạp

Kèm theo [`24-2026-nd-cp-cas.csv`](24-2026-nd-cp-cas.csv) — mỗi dòng: `cas · ten_chat · ma_hoa_chat · cong_thuc · phan_loai · phu_luc · muc · so_thu_tu · nguon · nhom · nguong_kg`.

**Văn bản:** Nghị định 24/2026/NĐ-CP ngày 17/01/2026 — Quy định các danh mục hoá chất thuộc phạm vi điều chỉnh của Luật Hoá chất 69/2025/QH15.
**Nguồn bậc A (toàn văn PDF bản ký, 88 trang):** <https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/4/24-ndcp.signed.pdf> (truy cập 2026-11-20); trang giới thiệu: <https://vanban.chinhphu.vn/?pageid=27160&docid=216671>.
**Nguồn bậc A (bản có lớp chữ, Công báo số 77):** <https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-24-2026-nd-cp-468796.htm> (truy cập 2026-11-20) — toàn văn lưu tại `raw/download/congbao.chinhphu.vn/24-2026-nd-cp-body.txt` (kèm `.docx` và `.pdf`), dùng làm nguồn nạp PL II (lượt OZV-1594) và PL III + PL IV (lượt OZV-1584).

## Cột dữ liệu

- `nhom` (thêm lượt OZV-1584, cuối header): nhóm 1/2 của PL III; **để trống** cho các dòng PL I/II/IV và 35 dòng nạp trước.
- `ma_hoa_chat`: với dòng PL II/III/IV từ Công báo số 77 giữ **tên khoa học (danh pháp IUPAC/tiếng Anh) in trong văn bản** (nguồn không có cột mã CHC như PL I cũ; khi văn bản in `---` như PL II STT 779 thì để trống); `ten_chat` là tên chất tiếng Việt đi kèm.
- `nguong_kg` (thêm lượt OZV-1584): ngưỡng khối lượng (kg) tại Bảng A PL IV; **để trống** khi văn bản in `---` ở cột ngưỡng hoặc chất thuộc phụ lục khác. Riêng Amoni nitrat (STT 8) văn bản cho **4 ngưỡng theo thành phần hỗn hợp** — ghi đủ cả 4 vào một ô, phân tách bằng dấu chấm phẩy.

## Cách trích xuất

- **PL I + khối p15–17 cũ (35 dòng, lượt OZV-1579):** trích khi chưa có bản lớp chữ Công báo 77. 35/35 dòng đạt checksum mod-10; tuy nhiên đối chứng chéo với bản Công báo số 77 (xem mục **Đối chứng chéo 35 dòng đầu** bên dưới) cho thấy 35 dòng này lệch cấu trúc và nội dung do lỗi đọc bảng scan ở giai đoạn đầu — **giữ nguyên không tự sửa theo yêu cầu thẻ OZV-1594**, báo cáo chi tiết để Giám đốc quyết định dọn và nạp 39 dòng PL I chuẩn từ Công báo 77.
- **PL II mục 1 (793 dòng = 786 STT, gồm 790 dòng có CAS + 3 dòng không-CAS, lượt OZV-1594):** trích bằng máy (`python3 -I + re`, script `/tmp/nd24/extract_pl2.py`) từ `raw/download/congbao.chinhphu.vn/24-2026-nd-cp-body.txt` (dòng 364–6797, ký tự 4.428–52.530, trước mục 2 quy tắc hỗn hợp 5%) và đối chứng khớp 100% (786/786 hàng, 0 sai khác) với bảng XML số 3 của `24-2026-nd-cp-congbao77.docx`:
  - 779 STT có 1 mã CAS (779 dòng);
  - 4 STT đa-CAS tách thành 11 dòng kế thừa cùng STT, tên chất, tên IUPAC và công thức: STT 381 (`Hexabromo cyclododecane`, 3 CAS: `134237-50-6`, `134237-51-7`, `134237-52-8`), STT 395 (`Hexahydromethyl phthalic anhydride`, 3 CAS: `25550-51-0`, `48122-14-1`, `57110-29-9`), STT 544 (`Nonylphenol`, 3 CAS: `25154-52-3`, `104-40-5`, `84852-15-3`), STT 622 (`Phosphorus (White, yellow, red)`, 2 CAS: `12185-10-3`, `7723-14-0`);
  - 3 STT không có CAS (văn bản in `---` ở cột CAS, nạp với `cas` để trống để giữ liền mạch STT 1–786): STT 23 (`Amalgam` / `Hỗn hống kim loại kiềm, kiềm thổ`), STT 741 (`Triorganostannic compounds other than tributyltin compounds` / `Hợp chất Triorganostannic khác với tributyl thiếc`), STT 779 (`Các hợp chất của Niken dạng bột có thể phát tán rộng trong không khí...`);
  - Checksum mod-10: **788/790 dòng CAS đạt checksum mod-10**; 2 dòng (`10037-74-3` ở STT 135 và `7746-08-4` ở STT 634) là lỗi in trong văn bản gốc Công báo số 77 lẫn PDF bản ký — giữ nguyên số in theo quy tắc nguồn bậc A và ghi rõ ở bảng Cờ bên dưới.
- **PL III + PL IV (545 dòng, lượt OZV-1584):** trích từ bản có lớp chữ Công báo số 77 bằng script `/tmp/nd24/extract_pl34_v3.py` (Python thuần, không mạng): quét từng dòng theo cấu trúc STT → tên IUPAC → tên Việt → CAS → mảnh công thức → ngưỡng; mọi CAS chạy checksum mod 10; đa-CAS một dòng tách thành nhiều hàng kế thừa STT; hàng in `---` ở cột CAS (không có CAS) vẫn nạp với `cas` để trống.

## Quy tắc hỗn hợp (trích NGUYÊN VĂN)

### Phụ lục I — hoá chất cơ bản theo ngành

KHÔNG có quy tắc hỗn hợp — PL I liệt kê hoá chất cơ bản theo ngành, không điều chỉnh hỗn hợp.

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

## Đối chứng chéo 35 dòng đầu đã nạp trước đó (OZV-1579) với bản Công báo số 77

Theo yêu cầu thẻ OZV-1594 (*"Đối chứng chéo 35 dòng đã nạp trước đó: khớp từng cặp CAS–tên–công thức với bản Công báo, sai lệch nào báo lại không tự sửa"*):

1. **10 dòng PL I cũ (dòng CSV 2–11, nguồn `24-ndcp.signed.pdf`):**
   - Trong bản Công báo số 77, Phụ lục I có **39 STT** (38 dòng có CAS + 1 dòng `Phosphoric acid, polyphosphoric acids` không-CAS, kết thúc bằng STT 39 `Xylene` / `Xylen` `1330-20-7`), không có cột mã `CHC-ĐM-01..10` và không có cột phân loại `"Hóa chất vô cơ"`.
   - Đối chiếu 10 dòng PL I cũ:
     - **7 mã CAS có trong PL I bản Công báo nhưng lệch STT, cột `ma_hoa_chat` ghi `CHC-ĐM-xx` thay vì tên IUPAC, và 3 dòng khác cách viết tên Việt:**
       - `7664-41-7`: CSV cũ ghi STT 1, `Amoniac`, `NH3` → Công báo PL I là **STT 4**, IUPAC `Ammonia (anhydrous)`, tên chất `Amoniac (khan)`, `NH3`.
       - `7697-37-2`: CSV cũ ghi STT 2, `Axit nitric`, `HNO3` → Công báo PL I là **STT 7**, IUPAC `Nitric acid`, tên chất `Axit nitric`, `HNO3`.
       - `7664-93-9`: CSV cũ ghi STT 3, `Axit sulfuric`, `H2SO4` → Công báo PL I là **STT 9**, IUPAC `Sulfuric acid`, tên chất `Axit Sulfuric`, `H2SO4`.
       - `1310-73-2`: CSV cũ ghi STT 4, `Natri hydroxit`, `NaOH` → Công báo PL I là **STT 24**, IUPAC `Sodium hydroxide`, tên chất `Natri hydroxit`, `NaOH`.
       - `7664-38-2`: CSV cũ ghi STT 5, `Axit photphoric`, `H3PO4` → Công báo PL I là **STT 8**, IUPAC `Phosphoric acid`, tên chất `Axit photphoric`, `H3PO4`.
       - `7647-01-0`: CSV cũ ghi STT 7, `Axit clohydric`, `HCl` → Công báo PL I là **STT 6**, IUPAC `Hydrochloric acid`, tên chất `Axit Hydrochloric`, `HCl`.
       - `7664-39-3`: CSV cũ ghi STT 10, `Axit fluorhydric`, `HF` → Công báo PL I là **STT 17**, IUPAC `Hydrogen fluoride`, tên chất `Hydro florua`, `HF`.
     - **3 mã CAS không có trong PL I bản Công báo:**
       - `7782-50-5` (`Clo`, CSV cũ ghi PL I STT 6): không thuộc PL I (nằm ở PL II STT 177 và PL IV STT 72).
       - `497-19-8` (`Natri carbonat`, CSV cũ ghi PL I STT 8): không có trong toàn văn NĐ 24/2026 (PL I STT 23 là `Sodium Bicarbonate` / `Natri bicarbonat` `144-55-8`, `CHNaO₃`).
       - `75-20-7` (`Canxi cacbua`, CSV cũ ghi PL I STT 9): không thuộc PL I (nằm ở PL II STT 134).

2. **25 dòng PL II cũ (dòng CSV 12–36, STT 1–37 rời rạc, nguồn `24-ndcp.signed.pdf`):**
   - Trong bản Công báo số 77, PL II STT 1–37 thực tế là dãy vần A (`Acetaldehyde` STT 1 → `Ammonium hydrogen difluoride` STT 37).
   - Đối chiếu 25 dòng PL II cũ với toàn bộ 786 STT của PL II bản Công báo số 77:
     - **5/25 dòng có mã CAS thuộc PL II bản Công báo nhưng lệch STT, trống `ma_hoa_chat` (tên IUPAC), trống `phan_loai`, và 3 dòng khác tên/thiếu công thức** (cả 5 chất này nay đã có thêm dòng chuẩn đầy đủ trong khối 793 dòng PL II Công báo số 77):
       - `7429-90-5`: CSV cũ ghi **STT 20**, `ten_chat=Bột nhôm`, `ma_hoa_chat=""`, `cong_thuc=Al` → Công báo PL II là **STT 21**, `ma_hoa_chat=Aluminium powder`, `ten_chat=Bột nhôm`, `cong_thuc=Al`.
       - `74-83-9`: CSV cũ ghi **STT 19**, `ten_chat=Bromua metyl`, `ma_hoa_chat=""`, `cong_thuc=CH3Br` → Công báo PL II là **STT 93**, `ma_hoa_chat=Bromom ethane`, `ten_chat=Metyl bromit`, `cong_thuc=CH3Br`.
       - `63-25-2`: CSV cũ ghi **STT 25**, `ten_chat=Carbaryl`, `ma_hoa_chat=""`, `cong_thuc=C12H11NO2` → Công báo PL II là **STT 521**, `ma_hoa_chat=1-naphthyl methylcarbamate`, `ten_chat=1-naphtyl metyl cacbamat`, `cong_thuc=C12H11NO2`.
       - `107-02-8`: CSV cũ ghi **STT 3**, `ten_chat=Acrolein`, `ma_hoa_chat=""`, `cong_thuc=C3H4O` → Công báo PL II là **STT 595**, `ma_hoa_chat=Acrolein (2-Propenal)`, `ten_chat=Acrolein`, `cong_thuc=C3H4O`.
       - `93-72-1`: CSV cũ ghi **STT 2**, `ten_chat=2,4,5-TP`, `ma_hoa_chat=""`, `cong_thuc=""` → Công báo PL II là **STT 641**, `ma_hoa_chat=Silvex`, `ten_chat=Silvex`, `cong_thuc=C9H7Cl3O3`.
     - **20/25 dòng còn lại không thuộc PL II bản Công báo:**
       - 9 mã thuộc PL III nhóm 2 mục C (Rotterdam/Stockholm): `93-76-5` (2,4,5-T), `116-06-3` (Aldicarb), `86-50-0` (Azinphos-methyl), `485-31-4` (Binapacryl), `8001-35-2` (Camphechlor/Toxaphene), `2425-06-1` (Captafol), `1563-66-2` (Carbofuran), `6164-98-3` (Chlordimeform), `17804-35-2` (Benomyl).
       - 2 mã thuộc PL IV Bảng A: `2642-71-9` (Azinphos-ethyl, PL IV STT 16), `470-90-6` (Chlorfenvinphos, PL IV STT 70).
       - 9 mã không có trong toàn văn NĐ 24/2026: `61-82-5` (Aminotriazol), `101-27-9` (Barban), `25057-89-0` (Bentazon), `10605-21-7` (Carbendazim), `5234-68-4` (Carboxin), `999-81-5` (Chlormequat), `28772-56-7` (Bromadiolone), `1689-84-5` (Bromoxynil), `1689-99-2` (Bromoxynil octanoat).

## Cấu trúc PL II + PL III + PL IV đã nạp từ Công báo số 77

- **PL II mục 1** ("Chất sản xuất, kinh doanh có điều kiện"): **786 STT (793 dòng CSV = 790 dòng có CAS + 3 dòng không-CAS)**.
- **PL III nhóm 1** — mục A "Các tiền chất công nghiệp" (22 chất); mục B "Các hóa chất thuộc phạm vi điều chỉnh của công ước về vũ khí hóa học": mã **2A** (2 chất), **2A\*** (BZ, 1 chất), **2B** tiền chất (10 dòng CAS); mục C "Hóa chất khác" (113 dòng CAS).
- **PL III nhóm 2** — mục A tiền chất công nghiệp (20 chất); mục B công ước vũ khí hóa học: **3A** (4 chất), **3B** tiền chất (13); mục C Rotterdam/Stockholm (84 dòng CAS, gồm nhóm POP nhiều CAS cùng tên).
- **PL III không in cột số thứ tự** → `so_thu_tu` để trống (không tự đánh số).
- **PL IV Bảng A**: 271 STT (276 hàng, không-CAS vẫn nạp đủ hàng); **Bảng B** là bảng phân loại GHS (không có CAS) — không nạp vào CSV này.

## Cờ lỗi in trong văn bản gốc (CAS / công thức bất thường đã ghi nhận)

| CAS | Vị trí | Vấn đề | Xử lý |
|---|---|---|---|
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

## Trạng thái nạp dữ liệu (tổng 1.373 dòng dữ liệu)

- **PL II mục 1 (nguồn Công báo số 77): 793 dòng (STT 1–786, gồm 790 dòng có CAS + 3 dòng không-CAS) — HOÀN TẤT** (lượt OZV-1594).
- **PL III nhóm 1–2 (nguồn Công báo số 77): 269 dòng — HOÀN TẤT** (lượt OZV-1584).
- **PL IV Bảng A (nguồn Công báo số 77): 276 hàng (STT 1–271, gồm 10 hàng không-CAS) — HOÀN TẤT** (lượt OZV-1584).
- **35 dòng cũ lượt OZV-1579 (10 dòng PL I + 25 dòng PL II tạm):** giữ nguyên theo yêu cầu thẻ OZV-1594; chờ thẻ riêng dọn 35 dòng cũ và nạp 39 dòng PL I chuẩn từ Công báo số 77.
- Bảng B PL IV (phân loại GHS) và các phần thân Nghị định 1–12: không thuộc phạm vi bảng CAS.

## Kết quả tra thử cho ca OZV-1575 (cập nhật lượt OZV-1594)

- **7429-90-5 (Bột nhôm / Aluminium powder):** CÓ — **PL II mục 1, STT 21** (bản Công báo số 77; bản cũ OZV-1579 ghi STT 20).
- **103-79-7 (Phenylacetone / P2P):** CÓ — **PL III nhóm 1, mục A** (tiền chất công nghiệp).
- **7732-18-5 (Nước):** KHÔNG có trong cả 4 phụ lục (đúng kỳ vọng — chất không thuộc danh mục).
- **64742-94-5 (Solvent naphtha):** **KHÔNG có trong toàn văn 4 phụ lục NĐ 24/2026/NĐ-CP** (0/1.361 mã CAS toàn văn Công báo số 77).
- **1330-20-7 (Xylene / Xylen):** chỉ nằm ở **PL I STT 39** (hoá chất cơ bản thuộc lĩnh vực công nghiệp hoá chất trọng điểm, vị trí ký tự ~4.409 ngay trước tiêu đề Phụ lục II); **KHÔNG có trong PL II, PL III, PL IV**.
