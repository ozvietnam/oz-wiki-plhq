# Báo cáo điểm mù — 2026-10-10

Tổng 543 điểm: **34 cao**, 207 vừa, 302 thấp. Sinh bởi `node tools/diem-mu.mjs` (không dùng AI).

Nhận một dòng: mở issue theo mẫu "Điểm mù" hoặc PR ghi mã điểm mù trong mô tả.

| Nhóm | Mức | Số điểm | Luồng việc |
|---|---|---|---|
| Cảnh báo nguồn | Cao | 24 | `truy-vet-nguon` |
| Được nhắc nhưng chưa có trong sổ | Cao | 3 | `he-thong-hoa` |
| THIEU_NGUON_AHTN | Cao | 1 | `truy-vet-nguon` |
| THIEU_NGUON_WCO_COMPENDIUM | Cao | 1 | `truy-vet-nguon` |
| Mâu thuẫn hiệu lực | Cao | 1 | `hieu-luc` |
| Sắp hết hiệu lực (≤60 ngày) | Cao | 1 | `hieu-luc` |
| Mã HS trong bảng không có trong biểu thuế | Vừa | 128 | `danh-muc-hs` |
| Wiki nhắc văn bản chưa đăng ký | Vừa | 18 | `lien-ket-cheo` |
| Văn bản danh mục chưa trích bảng mã HS | Vừa | 13 | `danh-muc-hs` |
| Thư viện hs-code-api ghi khác sổ | Vừa | 13 | `hieu-luc` |
| Văn bản khung thiếu thông tin | Vừa | 10 | `he-thong-hoa` |
| Bảng dẫn chiếu mã HS sang văn bản chưa có bảng | Vừa | 7 | `danh-muc-hs` |
| Sắp có hiệu lực (≤60 ngày) | Vừa | 3 | `doc-hieu` |
| Mã HS có hàng thật chưa đối chiếu KTCN 2026 (hs-code-api /api/demand) | Vừa | 2 | `danh-muc-hs` |
| Bảng dẫn chiếu mã HS sang văn bản chưa có bảng | Vừa | 1 | `danh-muc-hs` |
| Ưu tiên đối chiếu — theo số mã HS đang dẫn (hs-code-api) | Vừa | 1 | `hieu-luc` |
| Hiệu lực chưa đối chiếu nguồn A | Thấp | 140 | `hieu-luc` |
| Chưa có toàn văn | Thấp | 92 | `nap-lam-sach` |
| Chưa xếp vào cây | Thấp | 43 | `cay-du-lieu` |
| Chưa có nguồn chính thống | Thấp | 23 | `truy-vet-nguon` |
| Văn bản của cơ quan đã sáp nhập | Thấp | 11 | `do-tham` |
| HS_API đã chặn săn — chờ nguồn A / số hiệu đúng (không săn lặp) | Thấp | 8 | `hieu-luc` |

## Cảnh báo nguồn (24)

- [ ] **01/2026/TT-BNNMT: Tệp toan_van là tệp đính kèm thẻ vanban.chinhphu.vn docid=216592 (datafiles …/2026/01/01-bnnmt.pdf) nhưng là bản KHÔNG điền số và ngày ("Số: /2026/TT-BNNMT", "Hà Nội, ngày tháng năm 2026"), không phải bản ký số/Công báo. Dùng để đọc nội dung (Điều 30 khoản 1 ghi hiệu lực 01-01-2026); cần thay bằng bản Công báo khi trích dẫn.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **105/2016/QH13: Chương VI Điều 73.3: Bộ Y tế giao hướng dẫn 'thuốc cổ truyền có dạng bào chế hiện đại' (bao gồm cao dán) — chưa có TT hướng dẫn cụ thể → vùng xám pháp lý** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **1182/QĐ-BCT: Phụ lục 1 còn mở — cần đối chiếu TT 33/2026/TT-BCT trước khi ghi HET_HIEU_LUC toàn bộ.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **125/2026/TT-BCA: PR #24 đặt hieu_luc_da_doi_chieu: true chỉ dựa trên Điều 5 khoản 1 của chính văn bản (chứng minh ngày bắt đầu 01-07-2026), không ghi đã kiểm tình trạng hiện tại (văn bản sửa đổi/thay thế sau) nên giữ false.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **142/2026/TT-BTC: Chưa đọc điều khoản thi hành — chưa biết sửa/thay văn bản nào cụ thể.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **163/2025/NĐ-CP: OCR bằng tesseract 5.5.3 + vie language model - chất lượng 90-95% (một số ký tự sai VD: cỗ/cổ, đuọc/dược, dạng/dạng). PDF gốc có digital signature nên đã strip bằng pikepdf trước khi OCR.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **1921/QĐ-TCHQ: Nguồn A là tài liệu nghiên cứu của cơ quan dẫn văn bản, không phải toàn văn quyết định ký gốc. PDF Vietnam Trade Portal mang nhãn THƯ VIỆN PHÁP LUẬT; chỉ dùng đối chiếu bổ sung, không tự gán bậc A cho tên miền này.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **2105/QĐ-BCT: Đã ghi xac_minh.chan (THIEU_DIEU_THI_HANH_A) — xem node tools/san-hieu-luc.mjs; không săn lặp URL đã 404.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **2284/QĐ-BKHCN: Đã ghi xac_minh.chan (THIEU_PDF_A) — xem node tools/san-hieu-luc.mjs; không săn lặp URL đã 404.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **2711/QĐ-BKHCN: Đã ghi xac_minh.chan (THIEU_BAI_TUONG_MINH) — xem node tools/san-hieu-luc.mjs; không săn lặp URL đã 404.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **28/2018/QH14: Ngày hiệu lực chính xác chưa verify (có thể là 01/07/2018 hoặc 01/01/2019). Cần rà lại bản gốc nếu cần chính xác.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **32/2020/TT-BYT: Có thể bị thay thế bởi NĐ 163/2025/NĐ-CP (Điều 73.3 Luật 105/2016) - cần đối chiếu khi BYT ban hành TT mới. Chưa tìm được nguồn bậc A (congbao/datafiles) trong lượt này.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **3546/QĐ-BCT: Đã ghi xac_minh.chan (CHO_CONG_BO_A) — xem node tools/san-hieu-luc.mjs; không săn lặp URL đã 404.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **366/QĐ-BKHCN: Đã ghi xac_minh.chan (THIEU_BAI_TUONG_MINH) — xem node tools/san-hieu-luc.mjs; không săn lặp URL đã 404.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **37/2013/TT-BCT: Chưa nạp toan_van TT 37/2013 (không tìm thấy PDF Công báo/datafiles ổn định trong lượt này); kết luận HET_HIEU_LUC_MOT_PHAN dựa trên điều khoản sửa/bãi trong TT 07/2026.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **41/2019/TT-BCT: Chưa nạp toan_van TT 41/2019 (không tìm thấy PDF Công báo/datafiles ổn định); kết luận HET_HIEU_LUC_MOT_PHAN dựa trên điều khoản bãi bỏ một phần trong TT 48/2026.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **45/2024/TT-BCT: Đã ghi xac_minh.chan (SO_HIEU_LECH) — xem node tools/san-hieu-luc.mjs; không săn lặp URL đã 404.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **4814/QĐ-BCA: Chưa có PDF bậc A. Bãi 8378 không tự hồi phục 6266 — cần PDF A để chốt chuỗi 6266→8378→4814 và quan hệ với TT 125/2026 (khung rủi ro từ 01-07-2026).** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **55/2025/TT-BYT: Chưa tìm được nguồn bậc A (congbao/datafiles) trong lượt này.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **6266/QĐ-BCA: Đã ghi xac_minh.chan (THIEU_PDF_A) — xem node tools/san-hieu-luc.mjs; không săn lặp URL đã 404.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **72/2026/NĐ-CP: Văn bản có thời hạn: hết hiệu lực sau 31-12-2026 nếu không có nghị quyết kéo dài tiếp. Không phải mọi dòng về 0% (xăng có chì 20%, loại khác 10%).** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **765/QĐ-BCT: datafiles.chinhphu.vn/cpp/files/vbpq/2019/06/765.signed.pdf (đã nạp nhầm vào raw/download/datafiles.chinhphu.vn/765-qd-bct.pdf) thực chất là 765/QĐ-TTg về Hội đồng Quốc gia Giáo dục — không dùng làm toàn văn 765/QĐ-BCT.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **8378/QĐ-BCA: Chưa có PDF bậc A (datafiles/congbao/bocongan media — dò 04-10-2026). QĐ 4814/QĐ-BCA (28-07-2026, nguồn B) bãi bỏ chính 8378 — chuỗi hiệu lực cần PDF A trước khi đánh true. TT 125/2026 không liệt kê bãi 8378/6266.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **9981/QĐ-BCA: Đã ghi xac_minh.chan (THIEU_PDF_A) — xem node tools/san-hieu-luc.mjs; không săn lặp URL đã 404.** — Xác minh với cơ quan ban hành hoặc Công báo.

## Được nhắc nhưng chưa có trong sổ (3)

- [ ] **Chưa có trong sổ: 76-VBHN/VPQH** — Tạo registry/van-ban/ cho 76-VBHN/VPQH (được nhắc bởi 105/2016/QH13 (hop_nhat)). Dùng: node tools/them-van-ban.mjs "76-VBHN/VPQH"
- [ ] **Chưa có trong sổ: 14/2018/TT-BYT** — Tạo registry/van-ban/ cho 14/2018/TT-BYT (được nhắc bởi 19/2024/TT-BYT (thay_the)). Dùng: node tools/them-van-ban.mjs "14/2018/TT-BYT"
- [ ] **Chưa có trong sổ: 59/2025/TT-BYT** — Tạo registry/van-ban/ cho 59/2025/TT-BYT (được nhắc bởi 24/2026/TT-BYT (bai_bo)). Dùng: node tools/them-van-ban.mjs "59/2025/TT-BYT"

## THIEU_NGUON_AHTN (1)

- [ ] **AHTN 2022 (ASEAN Harmonized Tariff Nomenclature): chưa có toàn văn trong raw/download/asean.org/ — TT 85/2026/TT-BTC Điều 6.1(c) yêu cầu dùng SEN (Chú giải bổ sung) AHTN khi không xác định được mã. Hiện dùng tạm tax.json (mã 8 số VN = AHTN 8 số) thay thế.** — Sếp chỉ định: (a) mua bản PDF chính thức, (b) screenshot từ atr.asean.org bằng session browser, hoặc (c) chấp nhận dùng tax.json làm nguồn tạm thời.

## THIEU_NGUON_WCO_COMPENDIUM (1)

- [ ] **WCO Compendium of Classification Opinions: chưa có toàn văn trong raw/download/wco.org/ — TT 85/2026/TT-BTC Điều 6.1(b) yêu cầu dùng Tuyển tập ý kiến WCO làm nguồn ưu tiên thứ 2. Bản chính thức bán qua WCO Bookshop (~500 EUR). Hiện dùng tạm TB-TCHQ VN (LV=313) làm "Compendium VN" thay thế.** — Sếp chỉ định: (a) mua bản chính thức, (b) tải từng Classification Opinion mới nhất từ wcoomd.org (~50 opinions/session, 2 session/năm), hoặc (c) chấp nhận dùng TB-TCHQ thay thế.

## Mâu thuẫn hiệu lực (1)

- [ ] **2105/QĐ-BCT còn ghi "còn hiệu lực" nhưng đã bị bãi bỏ bởi 1309/QĐ-BCT** — Đối chiếu nguồn A rồi sửa tinh_trang/het_hieu_luc_tu trong registry/van-ban/2105-qd-bct-2025.yaml, hoặc sửa quan hệ ở văn bản 1309/QĐ-BCT nếu sai.

## Sắp hết hiệu lực (≤60 ngày) (1)

- [ ] **85/2019/NĐ-CP hết hiệu lực ngày 2026-10-15** — Tới ngày thì chuyển tinh_trang; rà mọi trang wiki và văn bản đang dẫn chiếu 85/2019/NĐ-CP.

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

## Wiki nhắc văn bản chưa đăng ký (18)

- [ ] **Wiki nhắc 31/2025/TT-BYT nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/duoc-lieu-theo-luat-duoc-2016.md, wiki/summary/luat-duoc-va-phan-loai-hs.md).
- [ ] **Wiki nhắc 98/2021/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/thuoc-theo-luat-duoc-2016.md).
- [ ] **Wiki nhắc 14/2024/TT-BYT nhưng sổ chưa có** — Thêm vào sổ (wiki/readings/105-2016-qh13/03-chuong-iii-quan-ly-thuoc.md).
- [ ] **Wiki nhắc 12/2025/TT-BYT nhưng sổ chưa có** — Thêm vào sổ (wiki/readings/105-2016-qh13/03-chuong-iii-quan-ly-thuoc.md).
- [ ] **Wiki nhắc 50/2005/QH11 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/11-2026-qh16.md).
- [ ] **Wiki nhắc 99/2015/QH13 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/11-2026-qh16.md).
- [ ] **Wiki nhắc 101/2015/QH13 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/11-2026-qh16.md).
- [ ] **Wiki nhắc 117/2025/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/11-2026-qh16.md).
- [ ] **Wiki nhắc 31/2021/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/163-2025-nd-cp.md).
- [ ] **Wiki nhắc 486/QĐ-BYT nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/32-2020-tt-byt.md).
- [ ] **Wiki nhắc 71/2014/QH13 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/54-2014-qh13.md, wiki/sources/54-vbhn-vpqh.md).
- [ ] **Wiki nhắc 35/2018/QH14 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/54-2014-qh13.md, wiki/sources/54-vbhn-vpqh.md).
- [ ] **Wiki nhắc 07/2022/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/54-2014-qh13.md, wiki/sources/54-vbhn-vpqh.md).
- [ ] **Wiki nhắc 90/2025/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/54-2014-qh13.md, wiki/sources/54-vbhn-vpqh.md).
- [ ] **Wiki nhắc 133/2025/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/54-2014-qh13.md, wiki/sources/54-vbhn-vpqh.md).
- [ ] **Wiki nhắc 107/2016/QH14 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/85-2026-tt-btc.md).
- [ ] **Wiki nhắc 167/2025/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/85-2026-tt-btc.md).
- [ ] **Wiki nhắc 20/2017/TT-BYT nhưng sổ chưa có** — Thêm vào sổ (wiki/summary/luat-duoc-va-phan-loai-hs.md).

## Văn bản danh mục chưa trích bảng mã HS (13)

- [ ] **Chưa trích bảng mã HS: 4814/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/4814-qd-bca-2026.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 1182/QĐ-BCT** — Văn bản danh mục chưa có danh-muc/1182-qd-bct-2021.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 496 mã.
- [ ] **Chưa trích bảng mã HS: 1725/QĐ-BCT** — Văn bản danh mục chưa có danh-muc/1725-qd-bct-2024.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 61 mã.
- [ ] **Chưa trích bảng mã HS: 173/2018/TT-BQP** — Văn bản danh mục chưa có danh-muc/173-2018-tt-bqp.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 41 mã.
- [ ] **Chưa trích bảng mã HS: 41/2019/TT-BCT** — Văn bản danh mục chưa có danh-muc/41-2019-tt-bct.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 32 mã.
- [ ] **Chưa trích bảng mã HS: 6266/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/6266-qd-bca-2023.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 19 mã.
- [ ] **Chưa trích bảng mã HS: 45/2023/TT-BCT** — Văn bản danh mục chưa có danh-muc/45-2023-tt-bct.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 15 mã.
- [ ] **Chưa trích bảng mã HS: 9981/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/9981-qd-bca-2019.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 12 mã.
- [ ] **Chưa trích bảng mã HS: 125/2021/TT-BCA** — Văn bản danh mục chưa có danh-muc/125-2021-tt-bca.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 1 mã.
- [ ] **Chưa trích bảng mã HS: 11/2022/TT-BCT** — Văn bản danh mục chưa có danh-muc/11-2022-tt-bct.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 11/2026/TT-BXD** — Văn bản danh mục chưa có danh-muc/11-2026-tt-bxd.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 30/2014/TT-BNNPTNT** — Văn bản danh mục chưa có danh-muc/30-2014-tt-bnnptnt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 8378/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/8378-qd-bca-2025.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.

## Thư viện hs-code-api ghi khác sổ (13)

- [ ] **12/2022/TT-BGTVT: hs-code-api ghi AMENDED, sổ ghi HET_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (12/2022/TT-BGTVT) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **62/2024/TT-BGTVT: hs-code-api ghi ACTIVE, sổ ghi HET_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (62/2024/TT-BGTVT) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **23/2019/QĐ-TTg: hs-code-api ghi ACTIVE, sổ ghi HET_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (23/2019/QD-TTG) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **113/2017/NĐ-CP: hs-code-api ghi AMENDED, sổ ghi HET_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (113/2017/ND-CP) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **82/2022/NĐ-CP: hs-code-api ghi ACTIVE, sổ ghi HET_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (82/2022/ND-CP) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **1182/QĐ-BCT: hs-code-api ghi EXPIRED, sổ ghi HET_HIEU_LUC_MOT_PHAN** — Thư viện /api/legal-docs của hs-code-api (1182/QD-BCT-PL2-2021) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **01/2021/TT-BLĐTBXH: hs-code-api ghi ACTIVE, sổ ghi HET_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (01/2021/TT-BLDTBXH) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **29/2025/TT-BKHCN: hs-code-api ghi ACTIVE, sổ ghi HET_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (29/2025/TT-BKHCN, 29/2025/TT-BKHCN-PL2, 29/2025/TT-BKHCN-PL1) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **04/2021/TT-BXD: hs-code-api ghi AMENDED, sổ ghi HET_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (04/2021/TT-BXD) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **69/2018/NĐ-CP: hs-code-api ghi ACTIVE, sổ ghi HET_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (69/2018/ND-CP) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **2333/QĐ-BCT: hs-code-api ghi REPLACED, sổ ghi CON_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (2333/QD-BCT-2025) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **1978/QĐ-BCT: hs-code-api ghi EXPIRED, sổ ghi CON_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (1978/QD-BCT, 1978/QD-BCT-2025) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
- [ ] **2093/QĐ-BCT: hs-code-api ghi REPLACED, sổ ghi CON_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (2093/QD-BCT-2025) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.

## Văn bản khung thiếu thông tin (10)

- [ ] **121/QĐ-BCT: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.
- [ ] **1400/QĐ-BCT: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.
- [ ] **2174/QĐ-BCT: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.
- [ ] **26/2011/NĐ-CP: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.
- [ ] **31/2015/TT-BTTTT: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.
- [ ] **38/2018/TT-NHNN: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.
- [ ] **45/2024/TT-BCT: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.
- [ ] **49/2015/TT-BCT: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.
- [ ] **915/QĐ-BCT: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.
- [ ] **924/QĐ-BNN-TCLN: chưa có tiêu đề, ngày, nguồn** — Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.

## Bảng dẫn chiếu mã HS sang văn bản chưa có bảng (7)

- [ ] **16/2024/TT-BYT dẫn mã HS sang 3 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 3. Thêm 3 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **16/2024/TT-BYT dẫn mã HS sang 4 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 4. Thêm 4 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **16/2024/TT-BYT dẫn mã HS sang 5 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 5. Thêm 5 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **16/2024/TT-BYT dẫn mã HS sang 6 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 6. Thêm 6 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **16/2024/TT-BYT dẫn mã HS sang 7 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 7. Thêm 7 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **16/2024/TT-BYT dẫn mã HS sang 8 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 8. Thêm 8 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **22/2018/TT-BTTTT dẫn mã HS sang trừ đơn sắc (đen trắng) — chưa có trong sổ** — danh-muc/22-2018-tt-btttt.csv có dòng không ghi mã mà dẫn chiếu trừ đơn sắc (đen trắng). Thêm trừ đơn sắc (đen trắng) vào sổ rồi trích bảng để mã HS của các dòng này tra được.

## Sắp có hiệu lực (≤60 ngày) (3)

- [ ] **128/2026/TT-BTC có hiệu lực ngày 2026-10-15** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.
- [ ] **142/2026/TT-BTC có hiệu lực ngày 2026-11-16** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.
- [ ] **336/2026/NĐ-CP có hiệu lực ngày 2026-10-15** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.

## Mã HS có hàng thật chưa đối chiếu KTCN 2026 (hs-code-api /api/demand) (2)

- [ ] **Hàng thật mã 85366932 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-05) mang mã 85366932 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 42/2019/TT-BCT, 34/2025/TT-BCT. Bảng KTCN 2026 có dòng cùng nhóm 8536: 33/2026/TT-BCT, 36/2026/TT-BKHCN — mở bản gốc đối chiếu xem mã 85366932 có bị trích sót không. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 39264000 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-05) mang mã 39264000 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 08/2023/TT-BCT. Chưa bảng KTCN 2026 nào có dòng nhóm 3926 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.

## Bảng dẫn chiếu mã HS sang văn bản chưa có bảng (1)

- [ ] **22/2018/TT-BTTTT dẫn mã HS sang trừ đơn sắc (đen trắng) — chưa có trong sổ** — danh-muc/22-2018-tt-btttt.csv có dòng không ghi mã mà dẫn chiếu trừ đơn sắc (đen trắng). Thêm trừ đơn sắc (đen trắng) vào sổ rồi trích bảng để mã HS của các dòng này tra được.

## Ưu tiên đối chiếu — theo số mã HS đang dẫn (hs-code-api) (1)

- [ ] **Đối chiếu hiệu lực 367/QĐ-BKHCN — 4 mã HS đang dẫn** — Sổ ghi CHUA_XAC_MINH nhưng chưa đối chiếu nguồn A; 4 mã HS của hs-code-api dựa vào dòng này để báo căn cứ còn/hết hiệu lực. Mở điều khoản hiệu lực, ghi hieu_luc_da_doi_chieu: true kèm nguồn. Kẹt cứng thì ghi xac_minh.chan (xem docs/huong-dan-agent.md) thay vì săn lặp.

## Hiệu lực chưa đối chiếu nguồn A (140)

- [ ] **2711/QĐ-BKHCN: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **01/2009/TT-BKHCN: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **01/2018/TT-BCT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **01/2022/TT-BNNPTNT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **01/2026/TT-BNNMT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **02/2018/TT-BCT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **02/2024/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **03/2015/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **03/2021/TT-BYT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **04/2014/TT-BCT: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **05/2007/QH12: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **05/2016/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **05/2017/QH14: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **05/2022/TT-BYT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **06/2018/TT-BYT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **06/2026/TT-BTC: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **08/2015/NĐ-CP: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/2013/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/2018/TT-BYT: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/2025/TT-BNV: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/2026/NQ-CP: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **10/2020/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **10/2024/TT-BKHCN: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **10/2024/TT-BXD: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **107/2016/QH13: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **108/2008/NĐ-CP: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **11/2017/TT-BCT: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **11/2021/TT-BNNPTNT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **11/2022/TT-BCT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **11/2026/QH16: tình trạng "CHUA_CO_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **111/2021/NĐ-CP: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **114/2025/QH15: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **121/2025/TT-BTC: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **121/QĐ-BCT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **124/2026/TT-BTC: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **125/2026/TT-BCA: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **128/2020/NĐ-CP: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **128/2026/TT-BTC: tình trạng "CHUA_CO_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **13/2015/TT-BTC: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **13/2018/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- … và 100 điểm khác (xem bao-cao/diem-mu.json)

## Chưa có toàn văn (92)

- [ ] **11/2026/QH16: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "11/2026/QH16" --ghi
- [ ] **114/2025/QH15: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "114/2025/QH15" --ghi
- [ ] **15/2012/QH13: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "15/2012/QH13" --ghi
- [ ] **41/2013/QH13: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "41/2013/QH13" --ghi
- [ ] **78/2025/QH15: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "78/2025/QH15" --ghi
- [ ] **79/2015/QH13: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "79/2015/QH13" --ghi
- [ ] **01/2018/TT-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "01/2018/TT-BCT" --ghi
- [ ] **01/2022/TT-BNNPTNT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "01/2022/TT-BNNPTNT" --ghi
- [ ] **02/2018/TT-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "02/2018/TT-BCT" --ghi
- [ ] **02/2024/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "02/2024/TT-BTTTT" --ghi
- [ ] **03/2015/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "03/2015/TT-BTTTT" --ghi
- [ ] **03/2021/TT-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "03/2021/TT-BYT" --ghi
- [ ] **05/2016/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "05/2016/TT-BTTTT" --ghi
- [ ] **05/2022/TT-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "05/2022/TT-BYT" --ghi
- [ ] **06/2018/TT-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "06/2018/TT-BYT" --ghi
- [ ] **06/2026/TT-BTC: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "06/2026/TT-BTC" --ghi
- [ ] **09/2013/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "09/2013/TT-BTTTT" --ghi
- [ ] **09/2025/TT-BNV: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "09/2025/TT-BNV" --ghi
- [ ] **10/2020/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "10/2020/TT-BTTTT" --ghi
- [ ] **102/2020/QH14: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "102/2020/QH14" --ghi
- [ ] **11/2021/TT-BNNPTNT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "11/2021/TT-BNNPTNT" --ghi
- [ ] **11/2022/TT-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "11/2022/TT-BCT" --ghi
- [ ] **121/2025/TT-BTC: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "121/2025/TT-BTC" --ghi
- [ ] **121/QĐ-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "121/QĐ-BCT" --ghi
- [ ] **124/2026/TT-BTC: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "124/2026/TT-BTC" --ghi
- [ ] **128/2026/TT-BTC: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "128/2026/TT-BTC" --ghi
- [ ] **13/2015/TT-BTC: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "13/2015/TT-BTC" --ghi
- [ ] **13/2018/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "13/2018/TT-BTTTT" --ghi
- [ ] **13/2024/TT-BLĐTBXH: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "13/2024/TT-BLĐTBXH" --ghi
- [ ] **1357/QĐ-TCHQ: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "1357/QĐ-TCHQ" --ghi
- [ ] **1400/QĐ-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "1400/QĐ-BCT" --ghi
- [ ] **142/2026/TT-BTC: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "142/2026/TT-BTC" --ghi
- [ ] **15/2018/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "15/2018/TT-BTTTT" --ghi
- [ ] **154/2018/NĐ-CP: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "154/2018/NĐ-CP" --ghi
- [ ] **1578/QĐ-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "1578/QĐ-BCT" --ghi
- [ ] **16/2015/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "16/2015/TT-BTTTT" --ghi
- [ ] **16/2021/TT-BNNPTNT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "16/2021/TT-BNNPTNT" --ghi
- [ ] **1921/QĐ-TCHQ: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "1921/QĐ-TCHQ" --ghi
- [ ] **1966/QĐ-TCHQ: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "1966/QĐ-TCHQ" --ghi
- [ ] **1989/QĐ-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "1989/QĐ-BCT" --ghi
- … và 52 điểm khác (xem bao-cao/diem-mu.json)

## Chưa xếp vào cây (43)

- [ ] **01/2018/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **01/2022/TT-BNNPTNT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **02/2018/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **02/2024/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **03/2015/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **03/2021/TT-BYT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **04/2014/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **05/2016/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **06/2018/TT-BYT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **09/2013/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **09/2018/TT-BYT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **09/2025/TT-BNV: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **10/2020/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **108/2008/NĐ-CP: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **11/2017/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **11/2021/TT-BNNPTNT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **13/2015/TT-BTC: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **13/2018/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **13/2024/TT-BLĐTBXH: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **15/2018/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **1578/QĐ-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **16/2015/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **16/2021/TT-BNNPTNT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **1989/QĐ-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **26/2011/NĐ-CP: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **26/2018/TT-BLĐTBXH: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **28/2020/QĐ-TTg: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **28/2021/TT-BYT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **2961/QĐ-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **30/2011/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **31/2015/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **31/2018/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **33/2016/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **38/2018/TT-NHNN: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **40/2017/TT-BQP: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **41/2016/TT-BTTTT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **43/2013/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **45/2024/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **48/2018/TT-BYT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **49/2015/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- … và 3 điểm khác (xem bao-cao/diem-mu.json)

## Chưa có nguồn chính thống (23)

- [ ] **05/2022/TT-BYT: chưa có nguồn chính thống (đang dựa vào nguồn thứ cấp)** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1357/QĐ-TCHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1966/QĐ-TCHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2105/QĐ-BCT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2284/QĐ-BKHCN: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **32/2020/TT-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **3546/QĐ-BCT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **55/2025/TT-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **6735/TB-TCHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **03/2021/TT-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **11/2022/TT-BCT: chưa có nguồn chính thống (đang dựa vào nguồn thứ cấp)** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **121/QĐ-BCT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1400/QĐ-BCT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **15/2018/TT-BTTTT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2174/QĐ-BCT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2961/QĐ-BCT: chưa có nguồn chính thống (đang dựa vào nguồn thứ cấp)** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **48/2018/TT-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **4814/QĐ-BCA: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **6266/QĐ-BCA: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **8378/QĐ-BCA: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **915/QĐ-BCT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **924/QĐ-BNN-TCLN: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **9981/QĐ-BCA: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.

## Văn bản của cơ quan đã sáp nhập (11)

- [ ] **01/2024/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **10/2022/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **11/2018/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **11/2024/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **1357/QĐ-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **17/2023/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **1966/QĐ-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **22/2018/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **30/2014/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **33/2014/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **6735/TB-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.

## HS_API đã chặn săn — chờ nguồn A / số hiệu đúng (không săn lặp) (8)

- [ ] **Chờ mở chặn 2711/QĐ-BKHCN (THIEU_BAI_TUONG_MINH) — 263 mã HS** — Đã ghi xac_minh.chan: THIEU_BAI_TUONG_MINH (2026-10-04). Việc tiếp: Chờ QĐ/TT-BKHCN hoặc vbpl ghi rõ hết/còn 2711; không suy ra HET từ NĐ 37 hết khung 132/74 hay TT 36 danh mục rủi ro mới.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 6266/QĐ-BCA (THIEU_PDF_A) — 19 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-04). Việc tiếp: Chờ PDF A của 6266 hoặc của QĐ 8378/4814 (nguồn B nói 8378 thay 6266 rồi 4814 bãi 8378). Theo dõi bocongan.gov.vn/media.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 2284/QĐ-BKHCN (THIEU_PDF_A) — 19 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-04). Việc tiếp: Chờ PDF A trên datafiles/most/mst; chicuctdc chỉ tóm tắt (không bậc A).. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 9981/QĐ-BCA (THIEU_PDF_A) — 12 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-04). Việc tiếp: customs Attachments/12857 đã 404; chờ bản ký số trên datafiles/bocongan. Không nạp từ TVXNK (C) để đánh true.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 2105/QĐ-BCT (THIEU_DIEU_THI_HANH_A) — 6 mã HS** — Đã ghi xac_minh.chan: THIEU_DIEU_THI_HANH_A (2026-10-04). Việc tiếp: Chờ PDF A của chính 2105 trên moit/pvtm (Điều 3 thi hành). Hết HL theo 1309 chỉ chốt được khi đã có cả hai vế trên A.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 3546/QĐ-BCT (CHO_CONG_BO_A) — 6 mã HS** — Đã ghi xac_minh.chan: CHO_CONG_BO_A (2026-10-04). Việc tiếp: Theo dõi pvtm/moit đăng PDF kết quả AR02.AD10; trav AD10 chưa có file 3546 (đến 04-10-2026).. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 366/QĐ-BKHCN (THIEU_BAI_TUONG_MINH) — 6 mã HS** — Đã ghi xac_minh.chan: THIEU_BAI_TUONG_MINH (2026-10-04). Việc tiếp: Cùng khung 2711 — chờ bãi tường minh; xem canh_bao/chan của 2711/QĐ-BKHCN.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 45/2024/TT-BCT (SO_HIEU_LECH) — 1 mã HS** — Đã ghi xac_minh.chan: SO_HIEU_LECH (2026-10-04). Việc tiếp: Đối chiếu mã HS bên hs-code-api — Công báo không có 45/2024/TT-BCT (có 45/2024/TT-BTC, 45/2025/TT-BCT). Mở issue hs-code-api nếu lệch số hiệu.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
