# Báo cáo điểm mù — 2026-11-16

Tổng 3615 điểm: **9 cao**, 163 vừa, 3443 thấp. Sinh bởi `node tools/diem-mu.mjs` (không dùng AI).

Nhận một dòng: mở issue theo mẫu "Điểm mù" hoặc PR ghi mã điểm mù trong mô tả.

| Nhóm | Mức | Số điểm | Luồng việc |
|---|---|---|---|
| Sắp hết hiệu lực (≤60 ngày) | Cao | 8 | `hieu-luc` |
| Mã HS trong bảng không có trong biểu thuế | Vừa | 128 | `danh-muc-hs` |
| Văn bản danh mục chưa trích bảng mã HS | Vừa | 15 | `danh-muc-hs` |
| Mã HS có hàng thật chưa đối chiếu KTCN 2026 (hs-code-api /api/demand) | Vừa | 3 | `danh-muc-hs` |
| Thư viện hs-code-api ghi khác sổ | Vừa | 3 | `hieu-luc` |
| Sắp có hiệu lực (≤60 ngày) | Vừa | 2 | `doc-hieu` |
| THIEU_VBHN | Vừa | 1 | `nap-lam-sach` |
| Văn bản khung thiếu thông tin | Vừa | 1 | `he-thong-hoa` |
| Bảng dẫn chiếu mã HS sang văn bản chưa có bảng | Vừa | 1 | `danh-muc-hs` |
| Hiệu lực chưa đối chiếu nguồn A | Thấp | 1412 | `hieu-luc` |
| Chưa có nguồn chính thống | Thấp | 1411 | `truy-vet-nguon` |
| Văn bản của cơ quan đã sáp nhập | Thấp | 587 | `do-tham` |
| Chưa có toàn văn | Thấp | 24 | `nap-lam-sach` |
| Biểu thuế Tổng cục còn coi là hiện hành nhưng sổ ghi hết/tạm ngưng — cần văn bản thay | Thấp | 15 | `hieu-luc` |
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

## Mã HS trong bảng không có trong biểu thuế (128)

- [ ] **01/2024/TT-BNNPTNT: mã 03034900 không có trong biểu thuế** — danh-muc/01-2024-tt-bnnptnt.csv dòng 441 ("- - Loại khác - Cá trích nước lạnh (Clupea harengus, Clupea "). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **01/2024/TT-BNNPTNT: mã 44129990 không có trong biểu thuế** — danh-muc/01-2024-tt-bnnptnt.csv dòng 3008 ("kg/m3 loài cây lá kim Gỗ đã được làm tăng độ rắn, ở dạng khố"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **01/2024/TT-BNNPTNT: mã 44140000 không có trong biểu thuế** — danh-muc/01-2024-tt-bnnptnt.csv dòng 3010 ("kg/chiếc hoặc các sản phẩm bằng gỗ tương tự Hòm, hộp, thùng "). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **08/2023/TT-BCT: mã 40199999 không có trong biểu thuế** — danh-muc/08-2023-tt-bct.csv dòng 12 ("- - - - Loại khác"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **08/2023/TT-BCT: mã 85392292 không có trong biểu thuế** — danh-muc/08-2023-tt-bct.csv dòng 156 ("- - - - Loại dùng trong chiếu sáng trang trí, công suất trên"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **08/2023/TT-BCT: mã 84501200 không có trong biểu thuế** — danh-muc/08-2023-tt-bct.csv dòng 305 ("hoặc 8450.19"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29230090 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 51 ("Hydroxyurea"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33043900 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 401 ("19 Nor-testosterone (tên gọi khác là Nandrolone)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33042091 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 402 ("Amifloxacin (Dạng uống hoặc dạng mỡ)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33042099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 403 ("Các dạng khác"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33049099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 404 ("Azathioprine"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33049099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 437 ("Nifuratel"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 39042099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 446 ("Các dạng khác"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29339090 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 731 ("Fluconazole"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 35101090 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 798 ("Hydroxyethyl Starch"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29329990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 825 ("Isosorbide"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29329990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 826 ("Isosorbide 5 Mononitrate"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29329990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 827 ("Isosorbide Dinitrate"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29224990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 860 ("L-ornithin L-aspartat"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29224990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 864 ("L-Phenylalanine"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29224990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 871 ("Mefenamic Acid"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352100 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 918 ("Retinyl acetat"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352300 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 920 ("Riboflavin"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 28389000 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 951 ("Sennosides"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29329990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 956 ("Silymarin"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29339900 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 978 ("Sulbutiamine"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29239990 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1027 ("Tofisopam"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352800 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1072 ("Vitamin E (tocoferol)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352900 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1073 ("Vitamin H (Biotine)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352900 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1074 ("Vitamin K"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 29352900 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1075 ("Vitamin PP (Nicotinamid)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30349099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1129 ("Alcal polyvinyl"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30022090 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1155 ("Aminosalicylate natri"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30349099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1215 ("Benzyl benzoate"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30344951 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1216 ("Berberin (Dạng uống)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30344959 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1217 ("Dạng khác"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30349099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1218 ("Betahistine"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 30343290 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1219 ("Betamethasone"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33045099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1288 ("Calcifediol"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **09/2024/TT-BYT: mã 33045099 không có trong biểu thuế** — danh-muc/09-2024-tt-byt.csv dòng 1289 ("Calcipotriol"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- … và 88 điểm khác (xem bao-cao/diem-mu.json)

## Văn bản danh mục chưa trích bảng mã HS (15)

- [ ] **Chưa trích bảng mã HS: 1182/QĐ-BCT** — Văn bản danh mục chưa có danh-muc/1182-qd-bct-2021.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 496 mã.
- [ ] **Chưa trích bảng mã HS: 41/2019/TT-BCT** — Văn bản danh mục chưa có danh-muc/41-2019-tt-bct.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 32 mã.
- [ ] **Chưa trích bảng mã HS: 11/2024/TT-BTTTT** — Văn bản danh mục chưa có danh-muc/11-2024-tt-btttt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 23 mã.
- [ ] **Chưa trích bảng mã HS: 6266/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/6266-qd-bca-2023.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 19 mã.
- [ ] **Chưa trích bảng mã HS: 45/2023/TT-BCT** — Văn bản danh mục chưa có danh-muc/45-2023-tt-bct.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 15 mã.
- [ ] **Chưa trích bảng mã HS: 9981/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/9981-qd-bca.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 12 mã.
- [ ] **Chưa trích bảng mã HS: 125/2021/TT-BCA** — Văn bản danh mục chưa có danh-muc/125-2021-tt-bca.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 1 mã.
- [ ] **Chưa trích bảng mã HS: 09/2013/TT-BTTTT** — Văn bản danh mục chưa có danh-muc/09-2013-tt-btttt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 13/2018/TT-BTTTT** — Văn bản danh mục chưa có danh-muc/13-2018-tt-btttt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 14/2024/TT-BNNPTNT** — Văn bản danh mục chưa có danh-muc/14-2024-tt-bnnptnt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 23/2021/TT-BCT** — Văn bản danh mục chưa có danh-muc/23-2021-tt-bct.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 28/2026/NĐ-CP** — Văn bản danh mục chưa có danh-muc/28-2026-nd-cp.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 44/2026/TT-BNNMT** — Văn bản danh mục chưa có danh-muc/44-2026-tt-bnnmt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 63/2026/TT-BKHCN** — Văn bản danh mục chưa có danh-muc/63-2026-tt-bkhcn.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 8378/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/8378-qd-bca-2025.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.

## Mã HS có hàng thật chưa đối chiếu KTCN 2026 (hs-code-api /api/demand) (3)

- [ ] **Hàng thật mã 39261000 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-11-09) mang mã 39261000 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 08/2023/TT-BCT. Chưa bảng KTCN 2026 nào có dòng nhóm 3926 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 36069010 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-11-09) mang mã 36069010 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Chưa bảng KTCN 2026 nào có dòng nhóm 3606 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 56081990 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-11-09) mang mã 56081990 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 01/2024/TT-BNNPTNT, 42/2019/TT-BCT, 33/2025/TT-BCT. Chưa bảng KTCN 2026 nào có dòng nhóm 5608 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.

## Thư viện hs-code-api ghi khác sổ (3)

- [ ] **2333/QĐ-BCT: hs-code-api ghi REPLACED, sổ ghi CON_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (2333/QD-BCT-2025) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **1978/QĐ-BCT: hs-code-api ghi EXPIRED, sổ ghi CON_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (1978/QD-BCT, 1978/QD-BCT-2025) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **2093/QĐ-BCT: hs-code-api ghi REPLACED, sổ ghi CON_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (2093/QD-BCT-2025) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.

## Sắp có hiệu lực (≤60 ngày) (2)

- [ ] **154/2026/TT-BTC có hiệu lực ngày 2027-01-01** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.
- [ ] **372/2026/NĐ-CP có hiệu lực ngày 2027-01-01** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.

## THIEU_VBHN (1)

- [ ] **2711/QĐ-BKHCN đã bị sửa đổi 3 lần nhưng chưa có văn bản hợp nhất** — Tìm văn bản hợp nhất (VBHN) của 2711/QĐ-BKHCN trên vanban.chinhphu.vn; nếu có, thêm vào sổ kèm quan_he.hop_nhat trỏ về 2711/QĐ-BKHCN.

## Văn bản khung thiếu thông tin (1)

- [ ] **45/2024/TT-BCT: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.

## Bảng dẫn chiếu mã HS sang văn bản chưa có bảng (1)

- [ ] **292/2026/NĐ-CP dẫn mã HS sang 33/2024/NĐ-CP — văn bản đó chưa có bảng** — danh-muc/292-2026-nd-cp.csv có dòng không ghi mã mà dẫn chiếu 33/2024/NĐ-CP. Trích danh-muc/33-2024-nd-cp.csv để mã HS của các dòng này tra được.

## Hiệu lực chưa đối chiếu nguồn A (1412)

- [ ] **08/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **10/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **100/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **100/TB-TCHQ/2021: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **101/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1010/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1011/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1012/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1013/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1014/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1014/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1015/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1016/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1018/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1019/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **102/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1020/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1021/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1022/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1023/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1024/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1024/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1025/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1025/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1026/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1026/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1027/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1027/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1028/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1028/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1029/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1029/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **103/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **103/TB-TCHQ/2021: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1030/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1031/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1032/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1039/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **104/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1049/TB-TCHQ/2019: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- … và 1372 điểm khác (xem bao-cao/diem-mu.json)

## Chưa có nguồn chính thống (1411)

- [ ] **2169/QĐ-CHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2284/QĐ-BKHCN: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2538/QĐ-TCHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **293/2026/NĐ-CP: chưa có nguồn chính thống (đang dựa vào nguồn thứ cấp)** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **3366/CHQ-GSQL: chưa có nguồn chính thống (đang dựa vào nguồn thứ cấp)** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **365/2026/NĐ-CP: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **44/2026/TT-BYT: chưa có nguồn chính thống (đang dựa vào nguồn thứ cấp)** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **5133/BCT-HC: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **63/2026/TT-BKHCN: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **67/2026/VBHN-BNNMT: chưa có nguồn chính thống (đang dựa vào nguồn thứ cấp)** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **Công ước Viên 1980 (CISG): chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **08/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **10/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **100/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **100/TB-TCHQ/2021: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **101/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1010/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1011/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1012/TB-TCHQ/2019: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1013/TB-TCHQ/2019: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1014/TB-TCHQ/2019: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1014/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1015/TB-TCHQ/2019: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1016/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1018/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1019/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **102/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1020/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1021/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1022/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1023/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1024/TB-TCHQ/2019: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1024/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1025/TB-TCHQ/2019: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1025/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1026/TB-TCHQ/2019: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1026/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1027/TB-TCHQ/2019: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1027/TB-TCHQ/2020: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1028/TB-TCHQ/2019: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- … và 1371 điểm khác (xem bao-cao/diem-mu.json)

## Văn bản của cơ quan đã sáp nhập (587)

- [ ] **01/2024/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **03/2024/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **10/2022/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **1005/TB-TCHQ/2025 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1015/TB-TCHQ/2022 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1049/TB-TCHQ/2024 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1061/TB-TCHQ/2022 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1062/TB-TCHQ/2022 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **11/2018/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **11/2024/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **1107/TB-TCHQ/2023 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1113/TB-TCHQ/2024 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1133/TB-TCHQ/2022 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1166/TB-TCHQ/2020 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **118/TB-TCHQ/2023 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **119/TB-TCHQ/2025 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1196/TB-TCHQ/2020 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1217/TB-TCHQ/2020 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1220/TB-TCHQ/2020 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1220/TB-TCHQ/2023 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1257/TB-TCHQ/2023 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1258/TB-TCHQ/2018 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1258/TB-TCHQ/2023 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1261/TB-TCHQ/2022 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1283/TB-TCHQ/2018 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1293/TB-TCHQ/2023 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1294/TB-TCHQ/2023 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1311/TB-TCHQ/2023 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1322/TB-TCHQ/2023 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1327/TB-TCHQ/2024 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1330/TB-TCHQ/2018 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1357/QĐ-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1372/TB-TCHQ/2018 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1377/TB-TCHQ/2018 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **139/TB-TCHQ/2019 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1395/TB-TCHQ/2024 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1405/TB-TCHQ/2018 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1406/TB-TCHQ/2018 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1407/TB-TCHQ/2018 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **1408/TB-TCHQ/2018 (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- … và 547 điểm khác (xem bao-cao/diem-mu.json)

## Chưa có toàn văn (24)

- [ ] **09/2014/NĐ-CP: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "09/2014/NĐ-CP" --ghi
- [ ] **1536/QĐ-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "1536/QĐ-BYT" --ghi
- [ ] **18/NQ-CP: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "18/NQ-CP" --ghi
- [ ] **1920/QĐ-TCHQ: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "1920/QĐ-TCHQ" --ghi
- [ ] **1925/QĐ-TCHQ: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "1925/QĐ-TCHQ" --ghi
- [ ] **2079/QĐ-TCHQ: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "2079/QĐ-TCHQ" --ghi
- [ ] **2284/QĐ-BKHCN: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "2284/QĐ-BKHCN" --ghi
- [ ] **2393/QĐ-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "2393/QĐ-BYT" --ghi
- [ ] **2538/QĐ-TCHQ: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "2538/QĐ-TCHQ" --ghi
- [ ] **293/2026/NĐ-CP: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "293/2026/NĐ-CP" --ghi
- [ ] **3366/CHQ-GSQL: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "3366/CHQ-GSQL" --ghi
- [ ] **365/2026/NĐ-CP: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "365/2026/NĐ-CP" --ghi
- [ ] **44/2026/TT-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "44/2026/TT-BYT" --ghi
- [ ] **45/2024/TT-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "45/2024/TT-BCT" --ghi
- [ ] **4814/QĐ-BCA: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "4814/QĐ-BCA" --ghi
- [ ] **49/QĐ-CTN: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "49/QĐ-CTN" --ghi
- [ ] **5133/BCT-HC: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "5133/BCT-HC" --ghi
- [ ] **6266/QĐ-BCA: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "6266/QĐ-BCA" --ghi
- [ ] **63/2026/TT-BKHCN: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "63/2026/TT-BKHCN" --ghi
- [ ] **67/2026/VBHN-BNNMT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "67/2026/VBHN-BNNMT" --ghi
- [ ] **7866/QĐ-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "7866/QĐ-BYT" --ghi
- [ ] **8378/QĐ-BCA: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "8378/QĐ-BCA" --ghi
- [ ] **9981/QĐ-BCA: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "9981/QĐ-BCA" --ghi
- [ ] **Công ước Viên 1980 (CISG): chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "Công ước Viên 1980 (CISG)" --ghi

## Biểu thuế Tổng cục còn coi là hiện hành nhưng sổ ghi hết/tạm ngưng — cần văn bản thay (15)

- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 2105/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (6 mã HS) — Áp thuế chống bán phá giá và chống trợ cấp đối với Đường (TH). Sổ ghi bị bãi bỏ bởi 1309/QĐ-BCT — hs-code-api sẽ báo người khai dùng văn bản mới; kiểm lại đối chiếu nguồn A.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 12/2022/TT-BGTVT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (1315 mã HS) — HHNK phải chứng nhận chất lượng an toàn kỹ thuật và bảo vệ môi trường trước khi thông quan / Sản phẩm, hàng hóa phải chứng nhận công bố hợp quy. Sổ ghi bị bãi bỏ bởi 49/2026/TT-BXD (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 62/2024/TT-BGTVT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (1315 mã HS) — HHNK phải chứng nhận chất lượng an toàn kỹ thuật và bảo vệ môi trường trước khi thông quan / Sản phẩm, hàng hóa phải chứng nhận công bố hợp quy. Sổ ghi bị bãi bỏ bởi 49/2026/TT-BXD (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 23/2019/QĐ-TTg nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (749 mã HS) — HH NK phải làm thủ tục hải quan tại cửa khẩu nhập. Sổ ghi bị thay bởi 31/2026/QĐ-TTg (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 01/2021/TT-BLĐTBXH nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (123 mã HS) — DM sản phẩm, HH nhóm 2 thuộc trách nhiệm QLNN của Bộ LĐTBXH. Sổ ghi bị thay bởi 16/2026/TT-BNV (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 10/2024/TT-BXD nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (80 mã HS) — DM sản phẩm, hàng hóa vật liệu xây dựng có khả năng gây mất an toàn (nhóm 2). Sổ ghi bị bãi bỏ bởi 41/2026/TT-BXD (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 29/2025/TT-BKHCN nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (62 mã HS) — SPHH lĩnh vực CNTT và VT bắt buộc phải chứng nhận hợp quy và công bố hợp quy / SPHH lĩnh vực CNTT và VT bắt buộc phải công bố hợp quy. Sổ ghi bị thay bởi 36/2026/TT-BKHCN (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 04/2021/TT-BXD nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (34 mã HS) — DM, quy cách và chỉ tiêu kỹ thuật khoáng sản làm vật liệu xây dựng XK. Sổ ghi bị thay bởi 11/2026/TT-BXD (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 69/2018/NĐ-CP nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (21 mã HS) — DM HH cấm kinh doanh TNTX, CK. Sổ ghi bị thay bởi 292/2026/NĐ-CP (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 691/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (14 mã HS) — Áp thuế tự vệ đối với Phôi thép và thép dài (Nhiều nước). Sổ ghi HET_HIEU_LUC từ 2026-03-22 (đã đối chiếu nguồn A), không có văn bản thay/bãi trong sổ — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 715/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (8 mã HS) — Áp thuế tự vệ đối với Phân bón (Nhiều nước). Sổ ghi HET_HIEU_LUC từ 2022-09-07 (đã đối chiếu nguồn A), không có văn bản thay/bãi trong sổ — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 3546/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (6 mã HS) — Áp thuế chống bán phá giá đối với Sợi dài làm từ polyester (IN, ID, MA, CN). Sổ ghi HET_HIEU_LUC từ 2026-10-16 (đã đối chiếu nguồn A), không có văn bản thay/bãi trong sổ — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 693/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (4 mã HS) — Áp dụng biện pháp chống lẩn tránh PVTM đối với Thép cuộn, thép dây (Nhiều nước). Sổ ghi HET_HIEU_LUC từ 2026-03-22 (đã đối chiếu nguồn A), không có văn bản thay/bãi trong sổ — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 228/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (2 mã HS) — Áp thuế chống bán phá giá đối với Một số sản phẩm kính nổi không màu (ID, MA). Sổ ghi bị thay bởi 1400/QĐ-BCT (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 2491/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục — Áp thuế chống bán phá giá đối với Một số sản phẩm ván sợi gỗ (TH, CN). Sổ ghi bị thay bởi 121/QĐ-BCT (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.

## HS_API đã chặn săn — chờ nguồn A / số hiệu đúng (không săn lặp) (4)

- [ ] **Chờ mở chặn 6266/QĐ-BCA (THIEU_PDF_A) — 19 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-04). Việc tiếp: Chờ PDF A của 6266 hoặc của QĐ 8378/4814 (nguồn B nói 8378 thay 6266 rồi 4814 bãi 8378). Theo dõi bocongan.gov.vn/media.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 2284/QĐ-BKHCN (THIEU_PDF_A) — 19 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-04). Việc tiếp: Chờ PDF A trên datafiles/most/mst; chicuctdc chỉ tóm tắt (không bậc A).. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 9981/QĐ-BCA (THIEU_PDF_A) — 12 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-09). Việc tiếp: customs Attachments/12857 đã 404; chờ bản ký số trên datafiles/bocongan. Không nạp từ TVXNK (C) để đánh true. Ngoài ra, 6266/QĐ-BCA (2023) thay TT 08/2019/TT-BCA, KHÔNG thay QĐ 9981. 125/2026/TT-BCA Điều 5 quy định chuyển tiếp nhưng không ghi rõ thay 9981 — cần đối chiếu thêm khi có nguồn A.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 45/2024/TT-BCT (SO_HIEU_LECH) — 1 mã HS** — Đã ghi xac_minh.chan: SO_HIEU_LECH (2026-10-04). Việc tiếp: Đối chiếu mã HS bên hs-code-api — Công báo không có 45/2024/TT-BCT (có 45/2024/TT-BTC, 45/2025/TT-BCT). Mở issue hs-code-api nếu lệch số hiệu.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
