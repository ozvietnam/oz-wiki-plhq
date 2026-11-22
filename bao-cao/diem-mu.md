# Báo cáo điểm mù — 2026-11-22

Tổng 3143 điểm: **9 cao**, 139 vừa, 2995 thấp. Sinh bởi `node tools/diem-mu.mjs` (không dùng AI).

Nhận một dòng: mở issue theo mẫu "Điểm mù" hoặc PR ghi mã điểm mù trong mô tả.

| Nhóm | Mức | Số điểm | Luồng việc |
|---|---|---|---|
| Sắp hết hiệu lực (≤60 ngày) | Cao | 8 | `hieu-luc` |
| THIEU_VBHN | Cao | 1 | `nap-lam-sach` |
| Mã HS trong bảng không có trong biểu thuế | Vừa | 70 | `danh-muc-hs` |
| Văn bản nền tảng (có toàn văn) chưa có trang wiki/sources/ | Vừa | 57 | `doc-hieu` |
| Wiki nhắc văn bản chưa đăng ký | Vừa | 9 | `lien-ket-cheo` |
| Sắp có hiệu lực (≤60 ngày) | Vừa | 3 | `doc-hieu` |
| TB-TCHQ cá biệt chưa có nguồn chính thống | Thấp | 1367 | `tb-tchq` |
| TB-TCHQ cá biệt chưa đối chiếu nguồn A | Thấp | 1367 | `tb-tchq` |
| Mã HS AHTN cũ đã ánh xạ sang biểu thuế EN2022 | Thấp | 131 | `danh-muc-hs` |
| Tệp doc-hieu thiếu nghĩa vụ XNK (≥50% điều hợp lệ trống) | Thấp | 36 | `doc-hieu` |
| Tệp doc-hieu chứa dòng điều rác / placeholder | Thấp | 33 | `doc-hieu` |
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

## THIEU_VBHN (1)

- [ ] **26/2023/NĐ-CP đã bị sửa đổi 7 lần nhưng chưa có văn bản hợp nhất** — Tìm văn bản hợp nhất (VBHN) của 26/2023/NĐ-CP trên vanban.chinhphu.vn; nếu có, thêm vào sổ kèm quan_he.hop_nhat trỏ về 26/2023/NĐ-CP.

## Mã HS trong bảng không có trong biểu thuế (70)

- [ ] **08/2023/TT-BCT: mã 40151900 không có trong biểu thuế** — danh-muc/08-2023-tt-bct.csv dòng 222 ("Sản phẩm may mặc và đồ phụ trợ may mặc (kể cả găng tay, găng"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 36030010 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 7 ("Các loại kíp nổ điện dùng trong công nghiệp"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 36030010 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 8 ("Kíp nổ đốt số 8 dùng trong công nghiệp"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 36030020 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 9 ("Dây cháy chậm công nghiệp"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 36030090 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 10 ("Dây nổ chịu nước dùng trong công nghiệp"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 36030090 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 11 ("Mồi nổ dùng cho thuốc nổ công nghiệp"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 84798939 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 37 ("Trạm nạp LPG cho chai, xe bồn, xe ô tô"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 84798940 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 38 ("Trạm nạp LPG cho chai, xe bồn, xe ô tô"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 84798939 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 39 ("Trạm cấp LPG"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 84798940 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 40 ("Trạm cấp LPG"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 85013222 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 48 ("Động cơ điện phòng nổ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 85171200 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 88 ("Thiết bị thông tin phòng nổ (Điện thoại, Máy đàm thoại, Còi "). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 85318010 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 95 ("Thiết bị thông tin phòng nổ (Điện thoại, Máy đàm thoại, Còi "). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 85364190 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 110 ("Thiết bị phân phối, đóng cắt phòng nổ (Khởi động từ, Khởi độ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 85444298 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 131 ("Cáp điện phòng nổ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 94051091 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 142 ("Đèn chiếu sáng phòng nổ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 94051092 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 143 ("Đèn chiếu sáng phòng nổ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 94051099 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 144 ("Đèn chiếu sáng phòng nổ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 94054020 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 145 ("Đèn chiếu sáng phòng nổ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 94054040 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 146 ("Đèn chiếu sáng phòng nổ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 94054060 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 147 ("Đèn chiếu sáng phòng nổ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 94054099 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 148 ("Đèn chiếu sáng phòng nổ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **1182/QĐ-BCT: mã 94056090 không có trong biểu thuế** — danh-muc/1182-qd-bct-2021.csv dòng 149 ("Đèn chiếu sáng phòng nổ"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 48132000 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 86 ("Giấy cuốn thuốc lá, đã hoặc chưa cắt theo cỡ hoặc ở dạng tập"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 48139010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 87 ("Giấy cuốn thuốc lá, đã hoặc chưa cắt theo cỡ hoặc ở dạng tập"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 48139090 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 88 ("Giấy cuốn thuốc lá, đã hoặc chưa cắt theo cỡ hoặc ở dạng tập"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 90 ("1. Máy cắt đầu lá"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 91 ("2. Xy lanh làm ẩm"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 92 ("3. Hầm ủ lá (xy lô trữ và ủ lá)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 93 ("4. Máy sấy lá (sấy, làm nguội, làm dịu)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 94 ("5. Hệ thống cân và đóng (ép) kiện lá"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 95 ("1. Xy lanh làm ẩm cọng lần 1"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 96 ("2. Xy lanh làm ẩm cọng lần 2"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 97 ("3. Hệ thống tước cọng, tách lá"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 98 ("4. Máy sấy cọng (sấy, làm nguội, làm dịu)"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 99 ("5. Máy phân loại, làm sạch cọng"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 100 ("6. Hệ thống cân và đóng (ép) kiện cọng"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 102 ("1. Thiết bị hấp chân không"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 103 ("2. Máy cắt kiện lá"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- [ ] **41/2019/TT-BCT: mã 84789010 không có trong biểu thuế** — danh-muc/41-2019-tt-bct.csv dòng 104 ("3. Xy lanh làm ẩm lá"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.
- … và 30 điểm khác (xem bao-cao/diem-mu.json)

## Văn bản nền tảng (có toàn văn) chưa có trang wiki/sources/ (57)

- [ ] **05/2011/QH13: văn bản nền tảng chưa có trang wiki/sources/05-2011-qh13.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/05-2011-qh13.html) nhưng chưa có wiki/sources/05-2011-qh13.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **05/2017/QH14: văn bản nền tảng chưa có trang wiki/sources/05-2017-qh14.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/05-2017-qh14.pdf,raw/ocr/05-2017-qh14.ocr.txt) nhưng chưa có wiki/sources/05-2017-qh14.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **06/2019/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/06-2019-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/06-2019-nd-cp.pdf) nhưng chưa có wiki/sources/06-2019-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **101/2015/QH13: văn bản nền tảng chưa có trang wiki/sources/101-2015-qh13.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/101-2015-qh13.pdf) nhưng chưa có wiki/sources/101-2015-qh13.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **108/2016/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/108-2016-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/108-2016-nd-cp.pdf) nhưng chưa có wiki/sources/108-2016-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **116/2025/QH15: văn bản nền tảng chưa có trang wiki/sources/116-2025-qh15.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/116-2025-qh15.pdf,raw/ocr/116-2025-qh15.ocr.txt) nhưng chưa có wiki/sources/116-2025-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **117/2025/QH15: văn bản nền tảng chưa có trang wiki/sources/117-2025-qh15.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/117-2025-qh15.pdf,raw/ocr/117-2025-qh15.ocr.txt) nhưng chưa có wiki/sources/117-2025-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **118/2025/QH15: văn bản nền tảng chưa có trang wiki/sources/118-2025-qh15.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/118-2025-qh15.pdf,raw/ocr/118-2025-qh15.ocr.txt) nhưng chưa có wiki/sources/118-2025-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **127/2007/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/127-2007-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/127-2007-nd-cp.html) nhưng chưa có wiki/sources/127-2007-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **131/2013/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/131-2013-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/131-2013-nd-cp.pdf,raw/ocr/131-2013-nd-cp.ocr.txt) nhưng chưa có wiki/sources/131-2013-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **133/2025/QH15: văn bản nền tảng chưa có trang wiki/sources/133-2025-qh15.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/133-2025-qh15.pdf) nhưng chưa có wiki/sources/133-2025-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **146/2025/QH15: văn bản nền tảng chưa có trang wiki/sources/146-2025-qh15.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/146-2025-qh15.pdf) nhưng chưa có wiki/sources/146-2025-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **15/2012/QH13: văn bản nền tảng chưa có trang wiki/sources/15-2012-qh13.md** — Đã có toàn văn (raw/download/congbaocdn.chinhphu.vn/15-2012-qh13.pdf) nhưng chưa có wiki/sources/15-2012-qh13.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **165/2026/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/165-2026-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/165-2026-nd-cp.pdf) nhưng chưa có wiki/sources/165-2026-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **169/2026/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/169-2026-nd-cp.md** — Đã có toàn văn (raw/download/customs.gov.vn/169-2026-nd-cp.html) nhưng chưa có wiki/sources/169-2026-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **17/2023/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/17-2023-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/17-2023-nd-cp.pdf) nhưng chưa có wiki/sources/17-2023-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **195/2013/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/195-2013-nd-cp.md** — Đã có toàn văn (raw/download/congbaocdn.chinhphu.vn/195-2013-nd-cp.pdf) nhưng chưa có wiki/sources/195-2013-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **21/2011/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/21-2011-nd-cp.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/21-2011-nd-cp.html) nhưng chưa có wiki/sources/21-2011-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **217/2025/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/217-2025-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/217-2025-nd-cp.pdf,raw/ocr/217-2025-nd-cp.ocr.txt) nhưng chưa có wiki/sources/217-2025-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **252/2026/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/252-2026-nd-cp.md** — Đã có toàn văn (raw/download/files.customs.gov.vn/252-2026-nd-cp.docx) nhưng chưa có wiki/sources/252-2026-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **273/2026/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/273-2026-nd-cp.md** — Đã có toàn văn (raw/download/files.customs.gov.vn/273-2026-nd-cp.pdf) nhưng chưa có wiki/sources/273-2026-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **28/2017/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/28-2017-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/28-2017-nd-cp.pdf,raw/ocr/28-2017-nd-cp.ocr.txt) nhưng chưa có wiki/sources/28-2017-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **282/2025/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/282-2025-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/282-2025-nd-cp.pdf) nhưng chưa có wiki/sources/282-2025-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **285/2025/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/285-2025-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/285-2025-nd-cp.pdf) nhưng chưa có wiki/sources/285-2025-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **29/2012/QH12: văn bản nền tảng chưa có trang wiki/sources/29-2012-qh12.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/29-2012-qh12.html) nhưng chưa có wiki/sources/29-2012-qh12.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **293/2026/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/293-2026-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/293-2026-nd-cp.pdf) nhưng chưa có wiki/sources/293-2026-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **31/2018/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/31-2018-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/31-2018-nd-cp.pdf) nhưng chưa có wiki/sources/31-2018-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **31/2021/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/31-2021-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/31-2021-nd-cp.pdf) nhưng chưa có wiki/sources/31-2021-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **35/2018/QH14: văn bản nền tảng chưa có trang wiki/sources/35-2018-qh14.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/35-2018-qh14.pdf) nhưng chưa có wiki/sources/35-2018-qh14.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **35/2025/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/35-2025-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/35-2025-nd-cp.pdf,raw/ocr/35-2025-nd-cp.ocr.txt) nhưng chưa có wiki/sources/35-2025-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **36/2005/QH11: văn bản nền tảng chưa có trang wiki/sources/36-2005-qh11.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/36-2005-qh11.html) nhưng chưa có wiki/sources/36-2005-qh11.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **36/2009/QH12: văn bản nền tảng chưa có trang wiki/sources/36-2009-qh12.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/36-2009-qh12.html) nhưng chưa có wiki/sources/36-2009-qh12.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **365/2026/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/365-2026-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/365-2026-nd-cp.pdf,raw/ocr/365-2026-nd-cp.ocr.txt) nhưng chưa có wiki/sources/365-2026-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **42/2013/QH13: văn bản nền tảng chưa có trang wiki/sources/42-2013-qh13.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/42-2013-qh13.pdf) nhưng chưa có wiki/sources/42-2013-qh13.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **42/2019/QH14: văn bản nền tảng chưa có trang wiki/sources/42-2019-qh14.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/42-2019-qh14.pdf) nhưng chưa có wiki/sources/42-2019-qh14.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **42/2024/QH15: văn bản nền tảng chưa có trang wiki/sources/42-2024-qh15.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/42-2024-qh15.pdf) nhưng chưa có wiki/sources/42-2024-qh15.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **46/2020/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/46-2020-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/46-2020-nd-cp.pdf) nhưng chưa có wiki/sources/46-2020-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **46/2024/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/46-2024-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/46-2024-nd-cp.pdf) nhưng chưa có wiki/sources/46-2024-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **50/2005/QH11: văn bản nền tảng chưa có trang wiki/sources/50-2005-qh11.md** — Đã có toàn văn (raw/download/vanban.chinhphu.vn/50-2005-qh11.html) nhưng chưa có wiki/sources/50-2005-qh11.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- [ ] **60/2014/NĐ-CP: văn bản nền tảng chưa có trang wiki/sources/60-2014-nd-cp.md** — Đã có toàn văn (raw/download/datafiles.chinhphu.vn/60-2014-nd-cp.pdf) nhưng chưa có wiki/sources/60-2014-nd-cp.md. Tóm tắt và nạp vào wiki/sources/ theo wiki/chuan-mau-wiki-source.md.
- … và 17 điểm khác (xem bao-cao/diem-mu.json)

## Wiki nhắc văn bản chưa đăng ký (9)

- [ ] **Wiki nhắc 44/2023/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/101-2023-qh15.md).
- [ ] **Wiki nhắc 87/2010/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/134-2016-nd-cp.md).
- [ ] **Wiki nhắc 304/2016/TT-BTC nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/19-2019-tt-btc.md).
- [ ] **Wiki nhắc 20/2019/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/19-2019-tt-btc.md).
- [ ] **Wiki nhắc 1092/QĐ-BTC nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/19-2019-tt-btc.md).
- [ ] **Wiki nhắc 1254/QĐ-TTg nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/19-2019-tt-btc.md).
- [ ] **Wiki nhắc 140/2016/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/19-2019-tt-btc.md).
- [ ] **Wiki nhắc 112/2025/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/76-vbhn-vpqh.md).
- [ ] **Wiki nhắc 143/2025/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/76-vbhn-vpqh.md).

## Sắp có hiệu lực (≤60 ngày) (3)

- [ ] **154/2026/TT-BTC có hiệu lực ngày 2027-01-01** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.
- [ ] **372/2026/NĐ-CP có hiệu lực ngày 2027-01-01** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.
- [ ] **63/2026/TT-BKHCN có hiệu lực ngày 2027-01-01** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.

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

## Mã HS AHTN cũ đã ánh xạ sang biểu thuế EN2022 (131)

- [ ] **01/2024/TT-BNNPTNT: mã 03034900 (AHTN cũ) → đã ánh xạ sang 03034910 (tu_dong_6s)** — danh-muc/01-2024-tt-bnnptnt.csv dòng 441 ("Cá, đông lạnh, trừ phi-lê cá (fillets) và các loại thịt cá k"). Đã ánh xạ sang hs_moi: 03034910 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **01/2024/TT-BNNPTNT: mã 44129990 (AHTN cũ) → đã ánh xạ sang 44129900 (tu_dong_6s)** — danh-muc/01-2024-tt-bnnptnt.csv dòng 3035 ("Gỗ dán, tấm gỗ dán veneer và các loại gỗ ghép tương tự: - Lo"). Đã ánh xạ sang hs_moi: 44129900 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **01/2024/TT-BNNPTNT: mã 44140000 (AHTN cũ) → đã ánh xạ sang 44141000 (don_le)** — danh-muc/01-2024-tt-bnnptnt.csv dòng 3037 ("Khung tranh, khung ảnh, khung gương bằng gỗ hoặc các sản phẩ"). Đã ánh xạ sang hs_moi: 44141000 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **08/2023/TT-BCT: mã 40199999 (AHTN cũ) → đã ánh xạ sang 40169999 (don_le)** — danh-muc/08-2023-tt-bct.csv dòng 12 ("Các sản phẩm khác bằng cao su lưu hóa trừ cao su cứng: - Loạ"). Đã ánh xạ sang hs_moi: 40169999 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **08/2023/TT-BCT: mã 85392292 (AHTN cũ) → đã ánh xạ sang 85392299 (tu_dong_6s)** — danh-muc/08-2023-tt-bct.csv dòng 156 ("Bóng đèn dây tóc hoặc bóng đèn phóng điện, kể cả đèn pha gắn"). Đã ánh xạ sang hs_moi: 85392299 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29230090 (AHTN cũ) → đã ánh xạ sang 29224900 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 51 ("Hydroxyurea"). Đã ánh xạ sang hs_moi: 29224900 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 33043900 (AHTN cũ) → đã ánh xạ sang 33049990 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 401 ("19 Nor-testosterone (tên gọi khác là Nandrolone)"). Đã ánh xạ sang hs_moi: 33049990 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 33042091 (AHTN cũ) → đã ánh xạ sang 33042000 (tu_dong_6s)** — danh-muc/09-2024-tt-byt.csv dòng 402 ("Amifloxacin (Dạng uống hoặc dạng mỡ)"). Đã ánh xạ sang hs_moi: 33042000 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 33042099 (AHTN cũ) → đã ánh xạ sang 33042000 (tu_dong_6s)** — danh-muc/09-2024-tt-byt.csv dòng 403 ("Amifloxacin (Các dạng khác)"). Đã ánh xạ sang hs_moi: 33042000 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 33049099 (AHTN cũ) → đã ánh xạ sang 33049990 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 404 ("Azathioprine"). Đã ánh xạ sang hs_moi: 33049990 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 33049099 (AHTN cũ) → đã ánh xạ sang 33049990 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 437 ("Nifuratel"). Đã ánh xạ sang hs_moi: 33049990 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 39042099 (AHTN cũ) → đã ánh xạ sang 39041099 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 446 ("Norvancomycin (Các dạng khác)"). Đã ánh xạ sang hs_moi: 39041099 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29339090 (AHTN cũ) → đã ánh xạ sang 29331100 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 810 ("Fluconazole"). Đã ánh xạ sang hs_moi: 29331100 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 35101090 (AHTN cũ) → đã ánh xạ sang 35069900 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 877 ("Hydroxyethyl Starch"). Đã ánh xạ sang hs_moi: 35069900 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29329990 (AHTN cũ) → đã ánh xạ sang 29329900 (tu_dong_6s)** — danh-muc/09-2024-tt-byt.csv dòng 904 ("Isosorbide"). Đã ánh xạ sang hs_moi: 29329900 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29329990 (AHTN cũ) → đã ánh xạ sang 29329900 (tu_dong_6s)** — danh-muc/09-2024-tt-byt.csv dòng 905 ("Isosorbide 5 Mononitrate"). Đã ánh xạ sang hs_moi: 29329900 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29329990 (AHTN cũ) → đã ánh xạ sang 29329900 (tu_dong_6s)** — danh-muc/09-2024-tt-byt.csv dòng 906 ("Isosorbide Dinitrate"). Đã ánh xạ sang hs_moi: 29329900 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29224990 (AHTN cũ) → đã ánh xạ sang 29224900 (tu_dong_6s)** — danh-muc/09-2024-tt-byt.csv dòng 939 ("L-ornithin L-aspartat"). Đã ánh xạ sang hs_moi: 29224900 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29224990 (AHTN cũ) → đã ánh xạ sang 29224900 (tu_dong_6s)** — danh-muc/09-2024-tt-byt.csv dòng 943 ("L-Phenylalanine"). Đã ánh xạ sang hs_moi: 29224900 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29224990 (AHTN cũ) → đã ánh xạ sang 29224900 (tu_dong_6s)** — danh-muc/09-2024-tt-byt.csv dòng 950 ("Mefenamic Acid"). Đã ánh xạ sang hs_moi: 29224900 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29352100 (AHTN cũ) → đã ánh xạ sang 29351000 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 997 ("Retinyl acetat"). Đã ánh xạ sang hs_moi: 29351000 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29352300 (AHTN cũ) → đã ánh xạ sang 29351000 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 999 ("Riboflavin"). Đã ánh xạ sang hs_moi: 29351000 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 28389000 (AHTN cũ) → đã ánh xạ sang 29389000 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 1030 ("Sennosides"). Đã ánh xạ sang hs_moi: 29389000 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29329990 (AHTN cũ) → đã ánh xạ sang 29329900 (tu_dong_6s)** — danh-muc/09-2024-tt-byt.csv dòng 1035 ("Silymarin"). Đã ánh xạ sang hs_moi: 29329900 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29339900 (AHTN cũ) → đã ánh xạ sang 29339910 (tu_dong_6s)** — danh-muc/09-2024-tt-byt.csv dòng 1057 ("Sulbutiamine"). Đã ánh xạ sang hs_moi: 29339910 (loai: tu_dong_6s) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29239990 (AHTN cũ) → đã ánh xạ sang 29224900 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 1106 ("Tofisopam"). Đã ánh xạ sang hs_moi: 29224900 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29352800 (AHTN cũ) → đã ánh xạ sang 29351000 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 1151 ("Vitamin E (tocoferol)"). Đã ánh xạ sang hs_moi: 29351000 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29352900 (AHTN cũ) → đã ánh xạ sang 29351000 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 1152 ("Vitamin H (Biotine)"). Đã ánh xạ sang hs_moi: 29351000 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29352900 (AHTN cũ) → đã ánh xạ sang 29351000 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 1153 ("Vitamin K"). Đã ánh xạ sang hs_moi: 29351000 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 29352900 (AHTN cũ) → đã ánh xạ sang 29351000 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 1154 ("Vitamin PP (Nicotinamid)"). Đã ánh xạ sang hs_moi: 29351000 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 30349099 (AHTN cũ) → đã ánh xạ sang 30049099 (loi_danh_may_3034)** — danh-muc/09-2024-tt-byt.csv dòng 1224 ("Alcal polyvinyl"). Đã ánh xạ sang hs_moi: 30049099 (loai: loi_danh_may_3034) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 30022090 (AHTN cũ) → đã ánh xạ sang 30021210 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 1256 ("Aminosalicylate natri"). Đã ánh xạ sang hs_moi: 30021210 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 30349099 (AHTN cũ) → đã ánh xạ sang 30049099 (loi_danh_may_3034)** — danh-muc/09-2024-tt-byt.csv dòng 1316 ("Benzyl benzoate"). Đã ánh xạ sang hs_moi: 30049099 (loai: loi_danh_may_3034) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 30344951 (AHTN cũ) → đã ánh xạ sang 30044919 (loi_danh_may_3034)** — danh-muc/09-2024-tt-byt.csv dòng 1317 ("Berberin (Dạng uống)"). Đã ánh xạ sang hs_moi: 30044919 (loai: loi_danh_may_3034) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 30344959 (AHTN cũ) → đã ánh xạ sang 30044919 (loi_danh_may_3034)** — danh-muc/09-2024-tt-byt.csv dòng 1318 ("Berberin (Dạng khác)"). Đã ánh xạ sang hs_moi: 30044919 (loai: loi_danh_may_3034) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 30349099 (AHTN cũ) → đã ánh xạ sang 30049099 (loi_danh_may_3034)** — danh-muc/09-2024-tt-byt.csv dòng 1319 ("Betahistine"). Đã ánh xạ sang hs_moi: 30049099 (loai: loi_danh_may_3034) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 30343290 (AHTN cũ) → đã ánh xạ sang 30043210 (loi_danh_may_3034)** — danh-muc/09-2024-tt-byt.csv dòng 1320 ("Betamethasone"). Đã ánh xạ sang hs_moi: 30043210 (loai: loi_danh_may_3034) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 33045099 (AHTN cũ) → đã ánh xạ sang 33049990 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 1389 ("Calcifediol"). Đã ánh xạ sang hs_moi: 33049990 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 33045099 (AHTN cũ) → đã ánh xạ sang 33049990 (don_le)** — danh-muc/09-2024-tt-byt.csv dòng 1390 ("Calcipotriol"). Đã ánh xạ sang hs_moi: 33049990 (loai: don_le) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- [ ] **09/2024/TT-BYT: mã 30942091 (AHTN cũ) → đã ánh xạ sang 30042099 (loi_danh_may_3094)** — danh-muc/09-2024-tt-byt.csv dòng 1418 ("Cefalotin (Dạng uống hoặc dạng mỡ)"). Đã ánh xạ sang hs_moi: 30042099 (loai: loi_danh_may_3094) trong registry/phien-ban-bieu-thue-mapping.yaml; đối chiếu bản gốc khi cập nhật danh-muc/.
- … và 91 điểm khác (xem bao-cao/diem-mu.json)

## Tệp doc-hieu thiếu nghĩa vụ XNK (≥50% điều hợp lệ trống) (36)

- [ ] **07/2023/TT-NHNN (data/doc-hieu/07-2023-tt-nhnn-body.dieu.jsonl): 3/4 (75%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/07-2023-tt-nhnn-body.dieu.jsonl: 3/4 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **09/2025/TT-BNV (data/doc-hieu/09-2025-tt-bnv.dieu.jsonl): 27/37 (73%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/09-2025-tt-bnv.dieu.jsonl: 27/37 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **10/2020/TT-BTTTT (data/doc-hieu/10-2020-tt-btttt.dieu.jsonl): 9/11 (82%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/10-2020-tt-btttt.dieu.jsonl: 9/11 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **107/2016/QH13 (data/doc-hieu/107-2016-qh13.dieu.jsonl): 49/66 (74%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/107-2016-qh13.dieu.jsonl: 49/66 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **11/2017/TT-BCT (data/doc-hieu/11-2017-tt-bct.dieu.jsonl): 46/56 (82%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/11-2017-tt-bct.dieu.jsonl: 46/56 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **11/2018/TT-BTTTT (data/doc-hieu/11-2018-tt-btttt-body.dieu.jsonl): 4/4 (100%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/11-2018-tt-btttt-body.dieu.jsonl: 4/4 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **11/2021/TT-BNNPTNT (data/doc-hieu/11-2021-tt-bnnptnt.dieu.jsonl): 313/323 (97%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/11-2021-tt-bnnptnt.dieu.jsonl: 313/323 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **11/2026/TT-BXD (data/doc-hieu/11-2026-tt-bxd-body.dieu.jsonl): 3/5 (60%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/11-2026-tt-bxd-body.dieu.jsonl: 3/5 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **125/2026/TT-BCA (data/doc-hieu/125-2026-tt-bca-body.dieu.jsonl): 5/7 (71%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/125-2026-tt-bca-body.dieu.jsonl: 5/7 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **13/2022/NĐ-CP (data/doc-hieu/13-2022-nd-cp.dieu.jsonl): 2/3 (67%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/13-2022-nd-cp.dieu.jsonl: 2/3 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **13/2024/TT-BLĐTBXH (data/doc-hieu/13-2024-tt-bldtbxh.dieu.jsonl): 3/6 (50%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/13-2024-tt-bldtbxh.dieu.jsonl: 3/6 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **154/2018/NĐ-CP (data/doc-hieu/154-2018-nd-cp.dieu.jsonl): 7/10 (70%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/154-2018-nd-cp.dieu.jsonl: 7/10 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **16/2021/TT-BNNPTNT (data/doc-hieu/16-2021-tt-bnnptnt.dieu.jsonl): 2/4 (50%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/16-2021-tt-bnnptnt.dieu.jsonl: 2/4 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **16/2024/TT-BYT (data/doc-hieu/16-2024-tt-byt.dieu.jsonl): 5/6 (83%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/16-2024-tt-byt.dieu.jsonl: 5/6 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **1725/QĐ-BCT (data/doc-hieu/1725-qd-bct.dieu.jsonl): 3/4 (75%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/1725-qd-bct.dieu.jsonl: 3/4 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **19/2024/TT-BYT (data/doc-hieu/19-2024-tt-byt.dieu.jsonl): 3/5 (60%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/19-2024-tt-byt.dieu.jsonl: 3/5 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **22/2018/TT-BLĐTBXH (data/doc-hieu/22-2018-tt-bldtbxh.dieu.jsonl): 3/4 (75%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/22-2018-tt-bldtbxh.dieu.jsonl: 3/4 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **26/2018/TT-BLĐTBXH (data/doc-hieu/26-2018-tt-bldtbxh.dieu.jsonl): 8/16 (50%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/26-2018-tt-bldtbxh.dieu.jsonl: 8/16 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **27/2026/TT-BNNMT (data/doc-hieu/27-2026-tt-bnnmt-body.dieu.jsonl): 100/115 (87%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/27-2026-tt-bnnmt-body.dieu.jsonl: 100/115 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **27/2026/TT-BYT (data/doc-hieu/27-2026-tt-byt.dieu.jsonl): 2/4 (50%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/27-2026-tt-byt.dieu.jsonl: 2/4 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **28/2026/TT-BCT (data/doc-hieu/28-2026-tt-bct.dieu.jsonl): 24/26 (92%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/28-2026-tt-bct.dieu.jsonl: 24/26 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **31/2015/TT-BTTTT (data/doc-hieu/31-2015-tt-btttt.dieu.jsonl): 4/7 (57%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/31-2015-tt-btttt.dieu.jsonl: 4/7 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **31/2018/TT-BCT (data/doc-hieu/31-2018-tt-bct.dieu.jsonl): 47/69 (68%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/31-2018-tt-bct.dieu.jsonl: 47/69 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **328/QĐ-TTg (data/doc-hieu/328-qd-ttg.dieu.jsonl): 4/4 (100%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/328-qd-ttg.dieu.jsonl: 4/4 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **367/QĐ-BKHCN (data/doc-hieu/367-qd-bkhcn-2024.dieu.jsonl): 2/3 (67%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/367-qd-bkhcn-2024.dieu.jsonl: 2/3 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **41/2013/QH13 (data/doc-hieu/41-2013-qh13.dieu.jsonl): 17/29 (59%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/41-2013-qh13.dieu.jsonl: 17/29 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **41/2023/TT-BCT (data/doc-hieu/41-2023-tt-bct.dieu.jsonl): 6/6 (100%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/41-2023-tt-bct.dieu.jsonl: 6/6 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **43/2017/NĐ-CP (data/doc-hieu/43-2017-nd-cp.dieu.jsonl): 14/23 (61%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/43-2017-nd-cp.dieu.jsonl: 14/23 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **48/2026/TT-BCT (data/doc-hieu/48-2026-tt-bct-body.dieu.jsonl): 61/93 (66%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/48-2026-tt-bct-body.dieu.jsonl: 61/93 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **51/2018/TT-BCT (data/doc-hieu/51-2018-tt-bct.dieu.jsonl): 3/5 (60%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/51-2018-tt-bct.dieu.jsonl: 3/5 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **58/2015/TTLT-BCT-BKHCN (data/doc-hieu/58-2015-ttlt-bct-bkhcn.dieu.jsonl): 67/80 (84%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/58-2015-ttlt-bct-bkhcn.dieu.jsonl: 67/80 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **715/QĐ-BCT (data/doc-hieu/715-qd-bct.dieu.jsonl): 2/2 (100%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/715-qd-bct.dieu.jsonl: 2/2 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **data/doc-hieu/tt-31-2022-cb-523-524.dieu.jsonl: 353/359 (98%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/tt-31-2022-cb-523-524.dieu.jsonl: 353/359 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **data/doc-hieu/tt-31-2022-cb-545-546.dieu.jsonl: 144/156 (92%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/tt-31-2022-cb-545-546.dieu.jsonl: 144/156 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **data/doc-hieu/tt-31-2022-cb-549-550.dieu.jsonl: 384/384 (100%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/tt-31-2022-cb-549-550.dieu.jsonl: 384/384 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.
- [ ] **data/doc-hieu/tt-31-2022-cb-557-558.dieu.jsonl: 135/159 (85%) điều hợp lệ trống nghia_vu_xnk** — Soát tay data/doc-hieu/tt-31-2022-cb-557-558.dieu.jsonl: 135/159 điều hợp lệ đang để trống nghia_vu_xnk (≥50%), bổ sung nghĩa vụ XNK nếu điều có tác động.

## Tệp doc-hieu chứa dòng điều rác / placeholder (33)

- [ ] **01/2026/TT-BNNMT (data/doc-hieu/01-2026-tt-bnnmt.dieu.jsonl): có 48 dòng điều rác / placeholder** — Rà lại data/doc-hieu/01-2026-tt-bnnmt.dieu.jsonl: loại bỏ 48 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **02/2024/TT-BTTTT (data/doc-hieu/02-2024-tt-btttt.dieu.jsonl): có 68 dòng điều rác / placeholder** — Rà lại data/doc-hieu/02-2024-tt-btttt.dieu.jsonl: loại bỏ 68 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **09/2025/TT-BNV (data/doc-hieu/09-2025-tt-bnv.dieu.jsonl): có 1 dòng điều rác / placeholder** — Rà lại data/doc-hieu/09-2025-tt-bnv.dieu.jsonl: loại bỏ 1 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **10/2022/TT-BTTTT (data/doc-hieu/10-2022-tt-btttt-body.dieu.jsonl): có 17 dòng điều rác / placeholder** — Rà lại data/doc-hieu/10-2022-tt-btttt-body.dieu.jsonl: loại bỏ 17 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **10/2022/TT-BTTTT (data/doc-hieu/10-2022-tt-btttt.dieu.jsonl): có 49 dòng điều rác / placeholder** — Rà lại data/doc-hieu/10-2022-tt-btttt.dieu.jsonl: loại bỏ 49 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **10/2024/TT-BKHCN (data/doc-hieu/10-2024-tt-bkhcn.dieu.jsonl): có 5 dòng điều rác / placeholder** — Rà lại data/doc-hieu/10-2024-tt-bkhcn.dieu.jsonl: loại bỏ 5 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **107/2016/QH13 (data/doc-hieu/107-2016-qh13.dieu.jsonl): có 2 dòng điều rác / placeholder** — Rà lại data/doc-hieu/107-2016-qh13.dieu.jsonl: loại bỏ 2 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **11/2017/TT-BCT (data/doc-hieu/11-2017-tt-bct.dieu.jsonl): có 13 dòng điều rác / placeholder** — Rà lại data/doc-hieu/11-2017-tt-bct.dieu.jsonl: loại bỏ 13 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **11/2021/TT-BNNPTNT (data/doc-hieu/11-2021-tt-bnnptnt.dieu.jsonl): có 279 dòng điều rác / placeholder** — Rà lại data/doc-hieu/11-2021-tt-bnnptnt.dieu.jsonl: loại bỏ 279 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **125/2021/TT-BCA (data/doc-hieu/125-2021-tt-bca-body.dieu.jsonl): có 32 dòng điều rác / placeholder** — Rà lại data/doc-hieu/125-2021-tt-bca-body.dieu.jsonl: loại bỏ 32 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **125/2021/TT-BCA (data/doc-hieu/125-2021-tt-bca.dieu.jsonl): có 34 dòng điều rác / placeholder** — Rà lại data/doc-hieu/125-2021-tt-bca.dieu.jsonl: loại bỏ 34 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **15/2018/NĐ-CP (data/doc-hieu/15-2018-nd-cp.dieu.jsonl): có 1 dòng điều rác / placeholder** — Rà lại data/doc-hieu/15-2018-nd-cp.dieu.jsonl: loại bỏ 1 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **15/2024/TT-BYT (data/doc-hieu/15-2024-tt-byt-body.dieu.jsonl): có 1 dòng điều rác / placeholder** — Rà lại data/doc-hieu/15-2024-tt-byt-body.dieu.jsonl: loại bỏ 1 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **17/2023/TT-BNNPTNT (data/doc-hieu/17-2023-tt-bnnptnt-body.dieu.jsonl): có 111 dòng điều rác / placeholder** — Rà lại data/doc-hieu/17-2023-tt-bnnptnt-body.dieu.jsonl: loại bỏ 111 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **174/2025/NĐ-CP (data/doc-hieu/174-2025-nd-cp.dieu.jsonl): có 25 dòng điều rác / placeholder** — Rà lại data/doc-hieu/174-2025-nd-cp.dieu.jsonl: loại bỏ 25 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **26/2018/TT-BLĐTBXH (data/doc-hieu/26-2018-tt-bldtbxh.dieu.jsonl): có 9 dòng điều rác / placeholder** — Rà lại data/doc-hieu/26-2018-tt-bldtbxh.dieu.jsonl: loại bỏ 9 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **27/2026/TT-BNNMT (data/doc-hieu/27-2026-tt-bnnmt-body.dieu.jsonl): có 58 dòng điều rác / placeholder** — Rà lại data/doc-hieu/27-2026-tt-bnnmt-body.dieu.jsonl: loại bỏ 58 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **2711/QĐ-BKHCN (data/doc-hieu/2711-qd-bkhcn.dieu.jsonl): có 1 dòng điều rác / placeholder** — Rà lại data/doc-hieu/2711-qd-bkhcn.dieu.jsonl: loại bỏ 1 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **28/2021/TT-BYT (data/doc-hieu/28-2021-tt-byt.dieu.jsonl): có 47 dòng điều rác / placeholder** — Rà lại data/doc-hieu/28-2021-tt-byt.dieu.jsonl: loại bỏ 47 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **28/2026/TT-BCT (data/doc-hieu/28-2026-tt-bct.dieu.jsonl): có 1 dòng điều rác / placeholder** — Rà lại data/doc-hieu/28-2026-tt-bct.dieu.jsonl: loại bỏ 1 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **31/2018/TT-BCT (data/doc-hieu/31-2018-tt-bct.dieu.jsonl): có 11 dòng điều rác / placeholder** — Rà lại data/doc-hieu/31-2018-tt-bct.dieu.jsonl: loại bỏ 11 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **33/2014/TT-BNNPTNT (data/doc-hieu/33-2014-tt-bnnptnt.dieu.jsonl): có 7 dòng điều rác / placeholder** — Rà lại data/doc-hieu/33-2014-tt-bnnptnt.dieu.jsonl: loại bỏ 7 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **37/2026/NĐ-CP (data/doc-hieu/37-2026-nd-cp.dieu.jsonl): có 1 dòng điều rác / placeholder** — Rà lại data/doc-hieu/37-2026-nd-cp.dieu.jsonl: loại bỏ 1 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **45/2023/TT-BCT (data/doc-hieu/45-2023-tt-bct-body.dieu.jsonl): có 2 dòng điều rác / placeholder** — Rà lại data/doc-hieu/45-2023-tt-bct-body.dieu.jsonl: loại bỏ 2 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **48/2026/TT-BCT (data/doc-hieu/48-2026-tt-bct-body.dieu.jsonl): có 10 dòng điều rác / placeholder** — Rà lại data/doc-hieu/48-2026-tt-bct-body.dieu.jsonl: loại bỏ 10 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **58/2015/TTLT-BCT-BKHCN (data/doc-hieu/58-2015-ttlt-bct-bkhcn.dieu.jsonl): có 1 dòng điều rác / placeholder** — Rà lại data/doc-hieu/58-2015-ttlt-bct-bkhcn.dieu.jsonl: loại bỏ 1 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **74/2018/NĐ-CP (data/doc-hieu/74-2018-nd-cp.dieu.jsonl): có 2 dòng điều rác / placeholder** — Rà lại data/doc-hieu/74-2018-nd-cp.dieu.jsonl: loại bỏ 2 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **81/2019/TT-BTC (data/doc-hieu/81-2019-tt-btc.dieu.jsonl): có 2 dòng điều rác / placeholder** — Rà lại data/doc-hieu/81-2019-tt-btc.dieu.jsonl: loại bỏ 2 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **89/2018/NĐ-CP (data/doc-hieu/89-2018-nd-cp.dieu.jsonl): có 1 dòng điều rác / placeholder** — Rà lại data/doc-hieu/89-2018-nd-cp.dieu.jsonl: loại bỏ 1 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **data/doc-hieu/tt-31-2022-cb-523-524.dieu.jsonl: có 89 dòng điều rác / placeholder** — Rà lại data/doc-hieu/tt-31-2022-cb-523-524.dieu.jsonl: loại bỏ 89 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **data/doc-hieu/tt-31-2022-cb-545-546.dieu.jsonl: có 49 dòng điều rác / placeholder** — Rà lại data/doc-hieu/tt-31-2022-cb-545-546.dieu.jsonl: loại bỏ 49 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **data/doc-hieu/tt-31-2022-cb-549-550.dieu.jsonl: có 42 dòng điều rác / placeholder** — Rà lại data/doc-hieu/tt-31-2022-cb-549-550.dieu.jsonl: loại bỏ 42 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.
- [ ] **data/doc-hieu/tt-31-2022-cb-557-558.dieu.jsonl: có 29 dòng điều rác / placeholder** — Rà lại data/doc-hieu/tt-31-2022-cb-557-558.dieu.jsonl: loại bỏ 29 dòng không có số điều thực (dieu rỗng / "-" / placeholder) hoặc trích lại phần điều khoản.

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
