# Báo cáo điểm mù — 2026-11-21

Tổng 3108 điểm: **8 cao**, 305 vừa, 2795 thấp. Sinh bởi `node tools/diem-mu.mjs` (không dùng AI).

Nhận một dòng: mở issue theo mẫu "Điểm mù" hoặc PR ghi mã điểm mù trong mô tả.

| Nhóm | Mức | Số điểm | Luồng việc |
|---|---|---|---|
| Sắp hết hiệu lực (≤60 ngày) | Cao | 8 | `hieu-luc` |
| Mã HS trong bảng không có trong biểu thuế | Vừa | 201 | `danh-muc-hs` |
| Văn bản nền tảng (có toàn văn) chưa có trang wiki/sources/ | Vừa | 90 | `doc-hieu` |
| Wiki nhắc văn bản chưa đăng ký | Vừa | 10 | `lien-ket-cheo` |
| Sắp có hiệu lực (≤60 ngày) | Vừa | 3 | `doc-hieu` |
| THIEU_VBHN | Vừa | 1 | `nap-lam-sach` |
| TB-TCHQ cá biệt chưa có nguồn chính thống | Thấp | 1367 | `tb-tchq` |
| TB-TCHQ cá biệt chưa đối chiếu nguồn A | Thấp | 1367 | `tb-tchq` |
| Biểu thuế Tổng cục còn coi là hiện hành nhưng sổ ghi hết/tạm ngưng — cần văn bản thay | Thấp | 18 | `hieu-luc` |
| Hiệu lực chưa đối chiếu nguồn A | Thấp | 15 | `hieu-luc` |
| Văn bản của cơ quan đã sáp nhập | Thấp | 12 | `do-tham` |
| Chưa có nguồn chính thống | Thấp | 12 | `truy-vet-nguon` |
| HS_API đã chặn săn — chờ nguồn A / số hiệu đúng (không săn lặp) | Thấp | 4 | `hieu-luc` |

## Sắp hết hiệu lực (≤60 ngày) (8)

- [ ] **08/2023/TT-BCT hết hiệu lực ngày 2026-12-31** — Tới ngày thì chuyển tinh_trang; rà mọi trang wiki và văn bản đang dẫn chiếu 08/2023/TT-BCT.
- [ ] **11/2018/TT-BTTTT hết hiệu lực ngày 2026-12-31** — Tới ngày thì chuyển tinh_trang; rà mọi trang wiki và văn bản đang dẫn chiếu 11/2018/TT-BTTTT.
- [ ] **12/2018/TT-BCT hết hiệu lực ngày 2026-12-31** — Tới ngày thì chuyển tinh_trang; rà mọi trang wiki và văn bản đang dẫn chiếu 12/2018/TT-BCT.
- [ ] **173/2018/TT-BQP hết hiệu lực ngày 2026-12-31** — Tới ngày thì chuyển tinh_trang; rà mọi trang wiki và văn bản đang dẫn chiếu 173/2018/TT-BQP.
- [ ] **174/2025/NĐ-CP hết hiệu lực ngày 2026-12-31** — Tới ngày thì chuyển tinh_trang; rà mọi trang wiki và văn bản đang dẫn chiếu 174/2025/NĐ-CP.
- [ ] **204/2025/QH15 hết hiệu lực ngày 2026-12-31** — Tới ngày thì chuyển tinh_trang; rà mọi trang wiki và văn bản đang dẫn chiếu 204/2025/QH15.
- [ ] **43/2026/NQ-CP hết hiệu lực ngày 2026-12-31** — Tới ngày thì chuyển tinh_trang; rà mọi trang wiki và văn bản đang dẫn chiếu 43/2026/NQ-CP.
- [ ] **72/2026/NĐ-CP hết hiệu lực ngày 2027-01-01** — Tới ngày thì chuyển tinh_trang; rà mọi trang wiki và văn bản đang dẫn chiếu 72/2026/NĐ-CP.

## Mã HS trong bảng không có trong biểu thuế (201)

- [ ] **01/2024/TT-BNNPTNT: mã 03034900 không có trong biểu thuế** — danh-muc/01-2024-tt-bnnptnt.csv dòng 441 ("Cá, đông lạnh, trừ phi-lê cá (fillets) và các loại thịt cá k"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **01/2024/TT-BNNPTNT: mã 44129990 không có trong biểu thuế** — danh-muc/01-2024-tt-bnnptnt.csv dòng 3035 ("Gỗ dán, tấm gỗ dán veneer và các loại gỗ ghép tương tự: - Lo"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **01/2024/TT-BNNPTNT: mã 44140000 không có trong biểu thuế** — danh-muc/01-2024-tt-bnnptnt.csv dòng 3037 ("Khung tranh, khung ảnh, khung gương bằng gỗ hoặc các sản phẩ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **08/2023/TT-BCT: mã 40199999 không có trong biểu thuế** — danh-muc/08-2023-tt-bct.csv dòng 12 ("Các sản phẩm khác bằng cao su lưu hóa trừ cao su cứng: - Loạ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **08/2023/TT-BCT: mã 85392292 không có trong biểu thuế** — danh-muc/08-2023-tt-bct.csv dòng 156 ("Bóng đèn dây tóc hoặc bóng đèn phóng điện, kể cả đèn pha gắn"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **08/2023/TT-BCT: mã 40151900 không có trong biểu thuế** — danh-muc/08-2023-tt-bct.csv dòng 222 ("Sản phẩm may mặc và đồ phụ trợ may mặc (kể cả găng tay, găng"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29230090 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 51 ("Hydroxyurea"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33043900 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 401 ("19 Nor-testosterone (tên gọi khác là Nandrolone)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33042091 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 402 ("Amifloxacin (Dạng uống hoặc dạng mỡ)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33042099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 403 ("Amifloxacin (Các dạng khác)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33049099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 404 ("Azathioprine"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33049099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 437 ("Nifuratel"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 39042099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 446 ("Norvancomycin (Các dạng khác)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29339090 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 810 ("Fluconazole"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 35101090 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 877 ("Hydroxyethyl Starch"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29329990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 904 ("Isosorbide"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29329990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 905 ("Isosorbide 5 Mononitrate"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29329990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 906 ("Isosorbide Dinitrate"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29224990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 939 ("L-ornithin L-aspartat"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29224990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 943 ("L-Phenylalanine"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29224990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 950 ("Mefenamic Acid"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352100 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 997 ("Retinyl acetat"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352300 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 999 ("Riboflavin"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 28389000 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1030 ("Sennosides"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29329990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1035 ("Silymarin"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29339900 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1057 ("Sulbutiamine"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29239990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1106 ("Tofisopam"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352800 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1151 ("Vitamin E (tocoferol)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352900 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1152 ("Vitamin H (Biotine)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352900 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1153 ("Vitamin K"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352900 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1154 ("Vitamin PP (Nicotinamid)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30349099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1224 ("Alcal polyvinyl"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30022090 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1256 ("Aminosalicylate natri"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30349099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1316 ("Benzyl benzoate"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30344951 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1317 ("Berberin (Dạng uống)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30344959 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1318 ("Berberin (Dạng khác)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30349099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1319 ("Betahistine"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30343290 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1320 ("Betamethasone"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33045099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1389 ("Calcifediol"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33045099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1390 ("Calcipotriol"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- … và 161 điểm khác (xem bao-cao/diem-mu.json)

## Văn bản nền tảng (có toàn văn) chưa có trang wiki/sources/ (90)

- [ ] **01/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/01-2022-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/01-2022-nd-cp.html) nhưng chưa có wiki/sources/01-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **05/2011/QH13: văn bản nền tảng chưa có trang wiki/sources/05-2011-qh13.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/05-2011-qh13.html) nhưng chưa có wiki/sources/05-2011-qh13.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **05/2017/QH14: văn bản nền tảng chưa có trang wiki/sources/05-2017-qh14.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/05-2017-qh14.pdf) nhưng chưa có wiki/sources/05-2017-qh14.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **06/2019/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/06-2019-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/06-2019-nd-cp.html) nhưng chưa có wiki/sources/06-2019-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **101/2015/QH13: văn bản nền tảng chưa có trang wiki/sources/101-2015-qh13.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/101-2015-qh13.html) nhưng chưa có wiki/sources/101-2015-qh13.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **102/2021/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/102-2021-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/102-2021-nd-cp.html) nhưng chưa có wiki/sources/102-2021-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **108/2016/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/108-2016-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/108-2016-nd-cp.html) nhưng chưa có wiki/sources/108-2016-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **112/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/112-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/112-2022-nd-cp.pdf) nhưng chưa có wiki/sources/112-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **113/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/113-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/113-2022-nd-cp.pdf) nhưng chưa có wiki/sources/113-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **114/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/114-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/114-2022-nd-cp.pdf) nhưng chưa có wiki/sources/114-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **116/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/116-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/116-2022-nd-cp.pdf) nhưng chưa có wiki/sources/116-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **116/2025/QH15: văn bản nền tảng chưa có trang wiki/sources/116-2025-qh15.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/116-2025-qh15.pdf) nhưng chưa có wiki/sources/116-2025-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **117/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/117-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/117-2022-nd-cp.pdf) nhưng chưa có wiki/sources/117-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **117/2025/QH15: văn bản nền tảng chưa có trang wiki/sources/117-2025-qh15.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/117-2025-qh15.pdf) nhưng chưa có wiki/sources/117-2025-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **118/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/118-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/118-2022-nd-cp.pdf) nhưng chưa có wiki/sources/118-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **118/2025/QH15: văn bản nền tảng chưa có trang wiki/sources/118-2025-qh15.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/118-2025-qh15.pdf) nhưng chưa có wiki/sources/118-2025-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **119/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/119-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/119-2022-nd-cp.pdf) nhưng chưa có wiki/sources/119-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **120/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/120-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/120-2022-nd-cp.pdf) nhưng chưa có wiki/sources/120-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **121/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/121-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/121-2022-nd-cp.pdf) nhưng chưa có wiki/sources/121-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **122/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/122-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/122-2022-nd-cp.pdf) nhưng chưa có wiki/sources/122-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **122/2024/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/122-2024-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/122-2024-nd-cp.html) nhưng chưa có wiki/sources/122-2024-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **123/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/123-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/123-2022-nd-cp.pdf) nhưng chưa có wiki/sources/123-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **124/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/124-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/124-2022-nd-cp.pdf) nhưng chưa có wiki/sources/124-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **125/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/125-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/125-2022-nd-cp.pdf) nhưng chưa có wiki/sources/125-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **126/2021/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/126-2021-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/126-2021-nd-cp.html) nhưng chưa có wiki/sources/126-2021-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **126/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/126-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/126-2022-nd-cp.pdf) nhưng chưa có wiki/sources/126-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **127/2007/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/127-2007-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/127-2007-nd-cp.html) nhưng chưa có wiki/sources/127-2007-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **129/2022/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/129-2022-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/129-2022-nd-cp.pdf) nhưng chưa có wiki/sources/129-2022-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **131/2013/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/131-2013-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/131-2013-nd-cp.html) nhưng chưa có wiki/sources/131-2013-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **133/2025/QH15: văn bản nền tảng chưa có trang wiki/sources/133-2025-qh15.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/133-2025-qh15.pdf) nhưng chưa có wiki/sources/133-2025-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **137/2020/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/137-2020-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/137-2020-nd-cp.html) nhưng chưa có wiki/sources/137-2020-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **143/2026/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/143-2026-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/143-2026-nd-cp.pdf) nhưng chưa có wiki/sources/143-2026-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **144/2024/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/144-2024-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/144-2024-nd-cp.pdf) nhưng chưa có wiki/sources/144-2024-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **146/2025/QH15: văn bản nền tảng chưa có trang wiki/sources/146-2025-qh15.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/146-2025-qh15.html) nhưng chưa có wiki/sources/146-2025-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **15/2012/QH13: văn bản nền tảng chưa có trang wiki/sources/15-2012-qh13.md** — Đã có toàn văn (raw/download/congbao.chinhphu.vn/15-2012-qh13.html) nhưng chưa có wiki/sources/15-2012-qh13.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **155/2018/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/155-2018-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/155-2018-nd-cp.pdf) nhưng chưa có wiki/sources/155-2018-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **165/2026/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/165-2026-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/165-2026-nd-cp.html) nhưng chưa có wiki/sources/165-2026-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **169/2026/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/169-2026-nd-cp.md** — Đã có toàn văn (raw/download/customs.gov.vn/169-2026-nd-cp.html) nhưng chưa có wiki/sources/169-2026-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **17/2023/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/17-2023-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/17-2023-nd-cp.html) nhưng chưa có wiki/sources/17-2023-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **186/2026/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/186-2026-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/186-2026-nd-cp.pdf) nhưng chưa có wiki/sources/186-2026-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- … và 50 điểm khác (xem bao-cao/diem-mu.json)

## Wiki nhắc văn bản chưa đăng ký (10)

- [ ] **Wiki nhắc 63/2025/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/28-2026-nd-cp.md, wiki/sources/342-2026-nd-cp.md).
- [ ] **Wiki nhắc 100/2015/QH13 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/28-2026-nd-cp.md).
- [ ] **Wiki nhắc 12/2017/QH14 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/28-2026-nd-cp.md).
- [ ] **Wiki nhắc 86/2025/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/28-2026-nd-cp.md).
- [ ] **Wiki nhắc 146/2025/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/342-2026-nd-cp.md).
- [ ] **Wiki nhắc 143/2025/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/342-2026-nd-cp.md).
- [ ] **Wiki nhắc 157/2013/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/35-2019-nd-cp.md).
- [ ] **Wiki nhắc 41/2017/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/35-2019-nd-cp.md).
- [ ] **Wiki nhắc 07/2022/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/35-2019-nd-cp.md).
- [ ] **Wiki nhắc 16/2017/QH14 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/35-2019-nd-cp.md).

## Sắp có hiệu lực (≤60 ngày) (3)

- [ ] **154/2026/TT-BTC có hiệu lực ngày 2027-01-01** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.
- [ ] **372/2026/NĐ-CP có hiệu lực ngày 2027-01-01** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.
- [ ] **63/2026/TT-BKHCN có hiệu lực ngày 2027-01-01** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.

## THIEU_VBHN (1)

- [ ] **26/2023/NĐ-CP đã bị sửa đổi 3 lần nhưng chưa có văn bản hợp nhất** — Tìm văn bản hợp nhất (VBHN) của 26/2023/NĐ-CP trên vanban.chinhphu.vn; nếu có, thêm vào sổ kèm quan_he.hop_nhat trỏ về 26/2023/NĐ-CP.

## TB-TCHQ cá biệt chưa có nguồn chính thống (1367)

- [ ] **08/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **10/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **100/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **100/TB-TCHQ/2021: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **101/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1010/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1011/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1012/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1013/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1014/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1014/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1015/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1016/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1018/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1019/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **102/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1020/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1021/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1022/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1023/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1024/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1024/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1025/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1025/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1026/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1026/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1027/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1027/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1028/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1028/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1029/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1029/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **103/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **103/TB-TCHQ/2021: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1030/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1031/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1032/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1039/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **104/TB-TCHQ/2020: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1049/TB-TCHQ/2019: TB-TCHQ chưa có nguồn chính thống** — Tìm thông báo phân loại trên customs.gov.vn, thêm vào nguon, ghi truy_cap.
- … và 1327 điểm khác (xem bao-cao/diem-mu.json)

## TB-TCHQ cá biệt chưa đối chiếu nguồn A (1367)

- [ ] **08/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **10/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **100/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **100/TB-TCHQ/2021: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **101/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1010/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1011/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1012/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1013/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1014/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1014/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1015/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1016/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1018/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1019/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **102/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1020/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1021/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1022/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1023/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1024/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1024/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1025/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1025/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1026/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1026/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1027/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1027/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1028/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1028/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1029/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1029/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **103/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **103/TB-TCHQ/2021: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1030/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1031/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1032/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1039/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **104/TB-TCHQ/2020: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1049/TB-TCHQ/2019: TB-TCHQ tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Đối chiếu thông báo trên customs.gov.vn hoặc hồ sơ nguồn, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- … và 1327 điểm khác (xem bao-cao/diem-mu.json)

## Biểu thuế Tổng cục còn coi là hiện hành nhưng sổ ghi hết/tạm ngưng — cần văn bản thay (18)

- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 12/2022/TT-BGTVT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (1315 mã HS) — HHNK phải chứng nhận chất lượng an toàn kỹ thuật và bảo vệ môi trường trước khi thông quan / Sản phẩm, hàng hóa phải chứng nhận công bố hợp quy. Sổ ghi bị bãi bỏ bởi 49/2026/TT-BXD (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 62/2024/TT-BGTVT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (1315 mã HS) — HHNK phải chứng nhận chất lượng an toàn kỹ thuật và bảo vệ môi trường trước khi thông quan / Sản phẩm, hàng hóa phải chứng nhận công bố hợp quy. Sổ ghi bị bãi bỏ bởi 49/2026/TT-BXD (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 23/2019/QĐ-TTg nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (749 mã HS) — HH NK phải làm thủ tục hải quan tại cửa khẩu nhập. Sổ ghi bị thay bởi 31/2026/QĐ-TTg (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 01/2021/TT-BLĐTBXH nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (123 mã HS) — DM sản phẩm, HH nhóm 2 thuộc trách nhiệm QLNN của Bộ LĐTBXH. Sổ ghi bị thay bởi 16/2026/TT-BNV (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 10/2024/TT-BXD nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (80 mã HS) — DM sản phẩm, hàng hóa vật liệu xây dựng có khả năng gây mất an toàn (nhóm 2). Sổ ghi bị bãi bỏ bởi 41/2026/TT-BXD (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 29/2025/TT-BKHCN nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (62 mã HS) — SPHH lĩnh vực CNTT và VT bắt buộc phải chứng nhận hợp quy và công bố hợp quy / SPHH lĩnh vực CNTT và VT bắt buộc phải công bố hợp quy. Sổ ghi bị thay bởi 36/2026/TT-BKHCN (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 04/2021/TT-BXD nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (34 mã HS) — DM, quy cách và chỉ tiêu kỹ thuật khoáng sản làm vật liệu xây dựng XK. Sổ ghi bị thay bởi 11/2026/TT-BXD (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 69/2018/NĐ-CP nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (21 mã HS) — DM HH cấm kinh doanh TNTX, CK. Sổ ghi bị thay bởi 292/2026/NĐ-CP (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 691/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (14 mã HS) — Áp thuế tự vệ đối với Phôi thép và thép dài (Nhiều nước). Sổ ghi HET_HIEU_LUC từ 2026-03-22 (đã đối chiếu nguồn A), không có văn bản thay/bãi trong sổ — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 2333/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (8 mã HS) — Áp thuế chống bán phá giá đối với Gạch ốp lát (IN). Sổ ghi bị thay bởi 2174/QĐ-BCT (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 715/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (8 mã HS) — Áp thuế tự vệ đối với Phân bón (Nhiều nước). Sổ ghi HET_HIEU_LUC từ 2022-09-07 (đã đối chiếu nguồn A), không có văn bản thay/bãi trong sổ — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 2105/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (6 mã HS) — Áp thuế chống bán phá giá và chống trợ cấp đối với Đường (TH). Sổ ghi bị bãi bỏ bởi 1309/QĐ-BCT (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 3546/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (6 mã HS) — Áp thuế chống bán phá giá đối với Sợi dài làm từ polyester (IN, ID, MA, CN). Sổ ghi bị thay bởi 2652/QĐ-BCT (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 1978/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (5 mã HS) — Áp thuế chống bán phá giá đối với Thép hình chữ H (MA). Sổ ghi bị thay bởi 915/QĐ-BCT (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 693/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (4 mã HS) — Áp dụng biện pháp chống lẩn tránh PVTM đối với Thép cuộn, thép dây (Nhiều nước). Sổ ghi HET_HIEU_LUC từ 2026-03-22 (đã đối chiếu nguồn A), không có văn bản thay/bãi trong sổ — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 228/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (2 mã HS) — Áp thuế chống bán phá giá đối với Một số sản phẩm kính nổi không màu (ID, MA). Sổ ghi bị thay bởi 1400/QĐ-BCT (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 2093/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục — Áp thuế chống bán phá giá đối với Một số sản phẩm kính nổi không màu (ID, MA). Sổ ghi HET_HIEU_LUC từ 2026-06-14 (đã đối chiếu nguồn A), không có văn bản thay/bãi trong sổ — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 2491/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục — Áp thuế chống bán phá giá đối với Một số sản phẩm ván sợi gỗ (TH, CN). Sổ ghi bị thay bởi 121/QĐ-BCT (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.

## Hiệu lực chưa đối chiếu nguồn A (15)

- [ ] **117/QĐ-CHQ: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1920/QĐ-TCHQ: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1925/QĐ-TCHQ: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **2123/QĐ-CHQ: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **2169/QĐ-CHQ: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **2284/QĐ-BKHCN: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **2538/QĐ-TCHQ: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **3366/CHQ-GSQL: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **45/2024/TT-BCT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **4814/QĐ-BCA: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **5133/BCT-HC: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **6266/QĐ-BCA: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **8378/QĐ-BCA: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **910/2026/SPS-BNNMT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **9981/QĐ-BCA: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.

## Văn bản của cơ quan đã sáp nhập (12)

- [ ] **01/2024/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **03/2024/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **07/VBHN-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **08/VBHN-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **09/VBHN-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **10/2022/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **11/2018/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **11/2024/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **1357/QĐ-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **17/2023/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **2079/QĐ-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **2538/QĐ-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.

## Chưa có nguồn chính thống (12)

- [ ] **117/QĐ-CHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1920/QĐ-TCHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1925/QĐ-TCHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2123/QĐ-CHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2169/QĐ-CHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2538/QĐ-TCHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **3366/CHQ-GSQL: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **4814/QĐ-BCA: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **5133/BCT-HC: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **6266/QĐ-BCA: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **8378/QĐ-BCA: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **9981/QĐ-BCA: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.

## HS_API đã chặn săn — chờ nguồn A / số hiệu đúng (không săn lặp) (4)

- [ ] **Chờ mở chặn 6266/QĐ-BCA (THIEU_PDF_A) — 19 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-04). Việc tiếp: Chờ PDF A của 6266 hoặc của QĐ 8378/4814 (nguồn B nói 8378 thay 6266 rồi 4814 bãi 8378). Theo dõi bocongan.gov.vn/media.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 2284/QĐ-BKHCN (THIEU_PDF_A) — 19 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-04). Việc tiếp: Đã có toàn văn trên vntr.moit.gov.vn (bản đánh máy lại của Bộ Công Thương, không phải bản gốc BKHCN); vẫn chờ bản gốc có chữ ký trên datafiles/most/mst và nguồn A xác nhận tình trạng hiệu lực (danh mục nhóm 2 đã được TT 03/2024/TT-BKHCN cập nhật).. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 9981/QĐ-BCA (THIEU_PDF_A) — 12 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-09). Việc tiếp: customs Attachments/12857 đã 404; chờ bản ký số trên datafiles/bocongan. Không nạp từ TVXNK (C) để đánh true. Ngoài ra, 6266/QĐ-BCA (2023) thay TT 08/2019/TT-BCA, KHÔNG thay QĐ 9981. 125/2026/TT-BCA Điều 5 quy định chuyển tiếp nhưng không ghi rõ thay 9981 — cần đối chiếu thêm khi có nguồn A.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 45/2024/TT-BCT (SO_HIEU_LECH) — 1 mã HS** — Đã ghi xac_minh.chan: SO_HIEU_LECH (2026-10-04). Việc tiếp: Đối chiếu mã HS bên hs-code-api — Công báo không có 45/2024/TT-BCT (có 45/2024/TT-BTC, 45/2025/TT-BCT). Mở issue hs-code-api nếu lệch số hiệu.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
