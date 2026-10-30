# Báo cáo điểm mù — 2026-10-30

Tổng 4992 điểm: **37 cao**, 440 vừa, 4515 thấp. Sinh bởi `node tools/diem-mu.mjs` (không dùng AI).

Nhận một dòng: mở issue theo mẫu "Điểm mù" hoặc PR ghi mã điểm mù trong mô tả.

| Nhóm | Mức | Số điểm | Luồng việc |
|---|---|---|---|
| Được nhắc nhưng chưa có trong sổ | Cao | 19 | `he-thong-hoa` |
| Cảnh báo nguồn | Cao | 6 | `truy-vet-nguon` |
| Ưu tiên đối chiếu — theo số mã HS đang dẫn (hs-code-api) | Cao | 6 | `hieu-luc` |
| Mâu thuẫn hiệu lực | Cao | 1 | `hieu-luc` |
| Văn bản hướng dẫn mất gốc | Cao | 1 | `hieu-luc` |
| Biểu thuế (hs-code-api) dẫn nhưng sổ chưa có | Cao | 1 | `he-thong-hoa` |
| Chưa có nguồn chính thống | Vừa | 2091 | `truy-vet-nguon` |
| Wiki nhắc văn bản chưa đăng ký | Vừa | 157 | `lien-ket-cheo` |
| Mã HS trong bảng không có trong biểu thuế | Vừa | 123 | `danh-muc-hs` |
| Biểu thuế XNK Tổng cục nêu nhưng sổ chưa có (hs-code-api skill bieu-thue-xnk) | Vừa | 29 | `he-thong-hoa` |
| Văn bản danh mục chưa trích bảng mã HS | Vừa | 27 | `danh-muc-hs` |
| Mã HS có hàng thật chưa đối chiếu KTCN 2026 (hs-code-api /api/demand) | Vừa | 17 | `danh-muc-hs` |
| Thư viện hs-code-api ghi khác sổ | Vừa | 14 | `hieu-luc` |
| Văn bản khung thiếu thông tin | Vừa | 10 | `he-thong-hoa` |
| Bảng dẫn chiếu mã HS sang văn bản chưa có bảng | Vừa | 6 | `danh-muc-hs` |
| Sắp có hiệu lực (≤60 ngày) | Vừa | 1 | `doc-hieu` |
| THIEU_VBHN | Vừa | 1 | `nap-lam-sach` |
| Hiệu lực chưa đối chiếu nguồn A | Thấp | 2271 | `hieu-luc` |
| Chưa có toàn văn | Thấp | 160 | `nap-lam-sach` |
| Văn bản của cơ quan đã sáp nhập | Thấp | 21 | `do-tham` |
| Biểu thuế Tổng cục còn coi là hiện hành nhưng sổ ghi hết/tạm ngưng — cần văn bản thay | Thấp | 13 | `hieu-luc` |
| Chưa xếp vào cây | Thấp | 9 | `cay-du-lieu` |
| HS_API đã chặn săn — chờ nguồn A / số hiệu đúng (không săn lặp) | Thấp | 8 | `hieu-luc` |

## Được nhắc nhưng chưa có trong sổ (19)

- [ ] **Chưa có trong sổ: 32/2006/NĐ-CP** — Tạo registry/van-ban/ cho 32/2006/NĐ-CP (được nhắc bởi 06/2019/NĐ-CP (thay_the)). Dùng: node tools/them-van-ban.mjs "32/2006/NĐ-CP"
- [ ] **Chưa có trong sổ: 56/2024/QH15** — Tạo registry/van-ban/ cho 56/2024/QH15 (được nhắc bởi 108/2025/QH15 (thay_the)). Dùng: node tools/them-van-ban.mjs "56/2024/QH15"
- [ ] **Chưa có trong sổ: 81/2013/NĐ-CP** — Tạo registry/van-ban/ cho 81/2013/NĐ-CP (được nhắc bởi 124/2020/NĐ-CP (thay_the)). Dùng: node tools/them-van-ban.mjs "81/2013/NĐ-CP"
- [ ] **Chưa có trong sổ: 91/2016/NĐ-CP** — Tạo registry/van-ban/ cho 91/2016/NĐ-CP (được nhắc bởi 129/2024/NĐ-CP (sua_doi)). Dùng: node tools/them-van-ban.mjs "91/2016/NĐ-CP"
- [ ] **Chưa có trong sổ: 47/2009/NĐ-CP** — Tạo registry/van-ban/ cho 47/2009/NĐ-CP (được nhắc bởi 131/2013/NĐ-CP (thay_the)). Dùng: node tools/them-van-ban.mjs "47/2009/NĐ-CP"
- [ ] **Chưa có trong sổ: 109/2011/NĐ-CP** — Tạo registry/van-ban/ cho 109/2011/NĐ-CP (được nhắc bởi 131/2013/NĐ-CP (thay_the)). Dùng: node tools/them-van-ban.mjs "109/2011/NĐ-CP"
- [ ] **Chưa có trong sổ: 1671/QĐ-TCHQ** — Tạo registry/van-ban/ cho 1671/QĐ-TCHQ (được nhắc bởi 1628/QĐ-TCHQ (thay_the)). Dùng: node tools/them-van-ban.mjs "1671/QĐ-TCHQ"
- [ ] **Chưa có trong sổ: 583/QĐ-TCHQ** — Tạo registry/van-ban/ cho 583/QĐ-TCHQ (được nhắc bởi 2079/QĐ-TCHQ (thay_the)). Dùng: node tools/them-van-ban.mjs "583/QĐ-TCHQ"
- [ ] **Chưa có trong sổ: 12/2015/TT-BTC** — Tạo registry/van-ban/ cho 12/2015/TT-BTC (được nhắc bởi 25/2026/TT-BTC (sua_doi)). Dùng: node tools/them-van-ban.mjs "12/2015/TT-BTC"
- [ ] **Chưa có trong sổ: 29/2019/TT-BNN** — Tạo registry/van-ban/ cho 29/2019/TT-BNN (được nhắc bởi 26/2025/TT-BNNMT (bai_bo)). Dùng: node tools/them-van-ban.mjs "29/2019/TT-BNN"
- [ ] **Chưa có trong sổ: 158/2013/NĐ-CP** — Tạo registry/van-ban/ cho 158/2013/NĐ-CP (được nhắc bởi 28/2017/NĐ-CP (sua_doi)). Dùng: node tools/them-van-ban.mjs "158/2013/NĐ-CP"
- [ ] **Chưa có trong sổ: 65/2017/TT-BTC** — Tạo registry/van-ban/ cho 65/2017/TT-BTC (được nhắc bởi 31/2022/TT-BTC (thay_the)). Dùng: node tools/them-van-ban.mjs "65/2017/TT-BTC"
- [ ] **Chưa có trong sổ: 09/2019/TT-BTC** — Tạo registry/van-ban/ cho 09/2019/TT-BTC (được nhắc bởi 31/2022/TT-BTC (thay_the)). Dùng: node tools/them-van-ban.mjs "09/2019/TT-BTC"
- [ ] **Chưa có trong sổ: 12/2025/TT-BYT** — Tạo registry/van-ban/ cho 12/2025/TT-BYT (được nhắc bởi 32/2026/TT-BYT (thay_the)). Dùng: node tools/them-van-ban.mjs "12/2025/TT-BYT"
- [ ] **Chưa có trong sổ: 73/2018/NĐ-CP** — Tạo registry/van-ban/ cho 73/2018/NĐ-CP (được nhắc bởi 57/2022/NĐ-CP (thay_the)). Dùng: node tools/them-van-ban.mjs "73/2018/NĐ-CP"
- [ ] **Chưa có trong sổ: 23/2000/QH10** — Tạo registry/van-ban/ cho 23/2000/QH10 (được nhắc bởi 73/2021/QH14 (thay_the)). Dùng: node tools/them-van-ban.mjs "23/2000/QH10"
- [ ] **Chưa có trong sổ: 464/QĐ-BTC** — Tạo registry/van-ban/ cho 464/QĐ-BTC (được nhắc bởi 81/2019/TT-BTC (bai_bo)). Dùng: node tools/them-van-ban.mjs "464/QĐ-BTC"
- [ ] **Chưa có trong sổ: 465/QĐ-BTC** — Tạo registry/van-ban/ cho 465/QĐ-BTC (được nhắc bởi 81/2019/TT-BTC (bai_bo)). Dùng: node tools/them-van-ban.mjs "465/QĐ-BTC"
- [ ] **Chưa có trong sổ: 96/2023/NĐ-CP** — Tạo registry/van-ban/ cho 96/2023/NĐ-CP (được nhắc bởi 98/2021/NĐ-CP (sua_doi)). Dùng: node tools/them-van-ban.mjs "96/2023/NĐ-CP"

## Cảnh báo nguồn (6)

- [ ] **09/2015/TT-BYT: Chưa đối chiếu tình trạng trên nguồn bậc A (chế độ xác nhận quảng cáo thay nhiều lần sau 2015 — cần rà riêng).** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **103/2006/NĐ-CP: Ngày hiệu lực 08-10-2006 theo TVPL, chưa đọc nguyên văn điều khoản; bị thay thế toàn bộ bởi NĐ 65/2023/NĐ-CP từ 23-08-2023 (nguồn thứ cấp nhất quán).** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **14/2018/TT-BYT: CHUA_RO: ngày ban hành và ngày có hiệu lực chưa xác minh (để trống); tình trạng HET_HIEU_LUC suy ra từ quan hệ thay_the của 19/2024/TT-BYT (hiệu lực từ 2024-11-16), chưa đối chiếu trực tiếp nguồn bậc A về 14/2018/TT-BYT.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **29/2020/TT-BYT: Sửa/bãi bỏ nhiều văn bản BYT; phần đụng TT 06/2011 còn hiệu lực theo VBHN 25/7/2025 — chưa đối chiếu bậc A.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **65/2023/NĐ-CP: Việc thay thế NĐ 103/2006 đọc từ nguồn thứ cấp nhất quán (TVPL + báo Chính phủ); PDF ký là bản scan, chưa OCR được điều khoản thi hành.** — Xác minh với cơ quan ban hành hoặc Công báo.
- [ ] **93/2025/QH15: Chưa có trang văn bản riêng đã đối chiếu; đây là lần sửa đổi thứ tư của Luật SHTT theo VBHN 155 — ngoài ra luật này còn tác động lên các luật khác không ghi ở đây.** — Xác minh với cơ quan ban hành hoặc Công báo.

## Ưu tiên đối chiếu — theo số mã HS đang dẫn (hs-code-api) (6)

- [ ] **Đối chiếu hiệu lực 181/2025/NĐ-CP — 332 mã HS đang dẫn** — Sổ ghi CON_HIEU_LUC nhưng chưa đối chiếu nguồn A; 332 mã HS của hs-code-api dựa vào dòng này để báo căn cứ còn/hết hiệu lực. Mở điều khoản hiệu lực, ghi hieu_luc_da_doi_chieu: true kèm nguồn. Kẹt cứng thì ghi xac_minh.chan (xem docs/huong-dan-agent.md) thay vì săn lặp.
- [ ] **Đối chiếu hiệu lực 26/2026/NĐ-CP — 60 mã HS đang dẫn** — Sổ ghi CON_HIEU_LUC nhưng chưa đối chiếu nguồn A; 60 mã HS của hs-code-api dựa vào dòng này để báo căn cứ còn/hết hiệu lực. Mở điều khoản hiệu lực, ghi hieu_luc_da_doi_chieu: true kèm nguồn. Kẹt cứng thì ghi xac_minh.chan (xem docs/huong-dan-agent.md) thay vì săn lặp.
- [ ] **Đối chiếu hiệu lực 22/2018/TT-BTTTT — 31 mã HS đang dẫn** — Sổ ghi CON_HIEU_LUC nhưng chưa đối chiếu nguồn A; 31 mã HS của hs-code-api dựa vào dòng này để báo căn cứ còn/hết hiệu lực. Mở điều khoản hiệu lực, ghi hieu_luc_da_doi_chieu: true kèm nguồn. Kẹt cứng thì ghi xac_minh.chan (xem docs/huong-dan-agent.md) thay vì săn lặp.
- [ ] **Đối chiếu hiệu lực 11/2024/TT-BTTTT — 23 mã HS đang dẫn** — Sổ ghi CON_HIEU_LUC nhưng chưa đối chiếu nguồn A; 23 mã HS của hs-code-api dựa vào dòng này để báo căn cứ còn/hết hiệu lực. Mở điều khoản hiệu lực, ghi hieu_luc_da_doi_chieu: true kèm nguồn. Kẹt cứng thì ghi xac_minh.chan (xem docs/huong-dan-agent.md) thay vì săn lặp.
- [ ] **Đối chiếu hiệu lực 121/QĐ-BCT — 6 mã HS đang dẫn** — Sổ ghi CHUA_XAC_MINH nhưng chưa đối chiếu nguồn A; 6 mã HS của hs-code-api dựa vào dòng này để báo căn cứ còn/hết hiệu lực. Mở điều khoản hiệu lực, ghi hieu_luc_da_doi_chieu: true kèm nguồn. Kẹt cứng thì ghi xac_minh.chan (xem docs/huong-dan-agent.md) thay vì săn lặp.
- [ ] **Đối chiếu hiệu lực 228/QĐ-BCT — 2 mã HS đang dẫn** — Sổ ghi CON_HIEU_LUC nhưng chưa đối chiếu nguồn A; 2 mã HS của hs-code-api dựa vào dòng này để báo căn cứ còn/hết hiệu lực. Mở điều khoản hiệu lực, ghi hieu_luc_da_doi_chieu: true kèm nguồn. Kẹt cứng thì ghi xac_minh.chan (xem docs/huong-dan-agent.md) thay vì săn lặp.

## Mâu thuẫn hiệu lực (1)

- [ ] **43/2017/NĐ-CP còn ghi "còn hiệu lực" nhưng đã bị bãi bỏ bởi 37/2026/NĐ-CP** — Đối chiếu nguồn A rồi sửa tinh_trang/het_hieu_luc_tu trong registry/van-ban/43-2017-nd-cp.yaml, hoặc sửa quan hệ ở văn bản 37/2026/NĐ-CP nếu sai.

## Văn bản hướng dẫn mất gốc (1)

- [ ] **90/2020/TT-BTC hướng dẫn văn bản đã hết hiệu lực (128/2020/NĐ-CP)** — Kiểm tra văn bản này còn được áp dụng không (thường hết hiệu lực theo văn bản gốc), hoặc đã có văn bản hướng dẫn mới.

## Biểu thuế (hs-code-api) dẫn nhưng sổ chưa có (1)

- [ ] **Biểu thuế dẫn nhưng sổ chưa có: 33/2024/NĐ-CP (60 mã HS)** — 60 mã HS trong hs-code-api dẫn văn bản này ở cột chính sách. Thêm vào sổ: node tools/them-van-ban.mjs "33/2024/NĐ-CP"

## Chưa có nguồn chính thống (2091)

- [ ] **03/2019/TT-BCT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **03/2024/TT-BNNPTNT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **05/2014/TT-NHNN: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **05/2015/TT-BNNPTNT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **05/2022/TT-BYT: chưa có nguồn chính thống (đang dựa vào nguồn thứ cấp)** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **06/2019/NĐ-CP: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **09/2015/TT-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **09/VBHN-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **11/2018/TT-BCT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **11/2024/TT-BTTTT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **123/2020/NĐ-CP: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **13/2008/QH12: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **131/2013/NĐ-CP: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1357/QĐ-TCHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **15/2021/TT-BNNPTNT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **1536/QĐ-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **16/2015/TT-BTTTT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **176/2013/NĐ-CP: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **195/2013/NĐ-CP: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **20/2021/TT-BNNPTNT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2079/QĐ-TCHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2169/QĐ-CHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **219/2013/TT-BTC: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **22/2018/TT-BTTTT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **221/2013/TT-BTC: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2284/QĐ-BKHCN: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2393/QĐ-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **25/2018/NĐ-CP: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **2538/QĐ-TCHQ: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **26/2015/TT-BTC: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **29/2012/QH12: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **29/2020/TT-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **32/2020/TT-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **3366/CHQ-GSQL: chưa có nguồn chính thống (đang dựa vào nguồn thứ cấp)** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **34/2025/TT-BYT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **3445/QĐ-BNNMT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **3546/QĐ-BCT: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **36/2005/QH11: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **3830/QĐ-BKHCN: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- [ ] **43/2017/NĐ-CP: chưa có nguồn chính thống** — Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.
- … và 2051 điểm khác (xem bao-cao/diem-mu.json)

## Wiki nhắc văn bản chưa đăng ký (157)

- [ ] **Wiki nhắc 121/QĐ-TTg nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/cptpp.md, wiki/sources/127-qd-ttg-2026.md).
- [ ] **Wiki nhắc 35/2019/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/dong-vat-hoang-da-nguy-cap.md).
- [ ] **Wiki nhắc 31/2025/TT-BYT nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/duoc-lieu-theo-luat-duoc-2016.md, wiki/summary/luat-duoc-va-phan-loai-hs.md).
- [ ] **Wiki nhắc 1201/QĐ-TTg nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/evfta.md, wiki/sources/126-qd-ttg-2026.md).
- [ ] **Wiki nhắc 169/2016/TT-BTC nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/giay-phep-xuat-nhap-khau-mat-ma.md).
- [ ] **Wiki nhắc 105/2022/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/go-rung.md, wiki/sources/17-2023-tt-bnnptnt.md).
- [ ] **Wiki nhắc 18/2019/QĐ-TTg nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/hang-cu-cam-nhap-khau.md, wiki/sources/48-2026-tt-bct.md).
- [ ] **Wiki nhắc 09/2024/QĐ-TTg nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/hang-cu-cam-nhap-khau.md, wiki/sources/48-2026-tt-bct.md).
- [ ] **Wiki nhắc 14/2018/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/hang-hoa-bien-gioi.md, wiki/sources/33-2025-tt-bct.md, wiki/sources/38-2015-tt-btc.md).
- [ ] **Wiki nhắc 55/2024/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/ktcl-bca-2026.md, wiki/concepts/thiet-bi-pccc.md, wiki/sources/125-2026-tt-bca.md).
- [ ] **Wiki nhắc 6266/9981/QĐ-BCA nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/ktcl-bca-2026.md).
- [ ] **Wiki nhắc 05/2018/TT-BYT nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/ktcl-byt-attp-2024.md, wiki/concepts/phu-gia-thuc-pham-ins.md, wiki/sources/15-2024-tt-byt.md).
- [ ] **Wiki nhắc 4023/QĐ-TCHQ nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/phan-loai-ma-hs.md, wiki/sources/1628-qd-tchq.md, wiki/summary/khung-thu-tuc-hai-quan.md).
- [ ] **Wiki nhắc 13/NQ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/rcep.md, wiki/sources/328-qd-ttg-2022.md).
- [ ] **Wiki nhắc 01/QĐ-TTg nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/rcep.md, wiki/sources/328-qd-ttg-2022.md).
- [ ] **Wiki nhắc 21/2017/TT-BNNPTNT nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/thuoc-bvtv-nhap-khau.md).
- [ ] **Wiki nhắc 122/2024/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/xuat-xu-fta.md, wiki/sources/33-2025-tt-bct.md).
- [ ] **Wiki nhắc 33/2024/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/xuat-xu-fta.md).
- [ ] **Wiki nhắc 31/2020/TT-BCT nhưng sổ chưa có** — Thêm vào sổ (wiki/concepts/xuat-xu-fta.md).
- [ ] **Wiki nhắc 101/2016/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/log.md, wiki/sources/81-2019-tt-btc.md).
- [ ] **Wiki nhắc 14/2024/TT-BYT nhưng sổ chưa có** — Thêm vào sổ (wiki/readings/105-2016-qh13/03-chuong-iii-quan-ly-thuoc.md).
- [ ] **Wiki nhắc 12/2025/TT-BYT nhưng sổ chưa có** — Thêm vào sổ (wiki/readings/105-2016-qh13/03-chuong-iii-quan-ly-thuoc.md).
- [ ] **Wiki nhắc 15/2017/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/01-2022-tt-bnnptnt.md).
- [ ] **Wiki nhắc 25/2016/TT-BNNPTNT nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/01-2026-tt-bnnmt.md).
- [ ] **Wiki nhắc 42/2013/QH13 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/02-2011-qh13.md, wiki/sources/81-2025-qh15.md).
- [ ] **Wiki nhắc 09/1998/QH10 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/02-2011-qh13.md).
- [ ] **Wiki nhắc 26/2004/QH11 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/02-2011-qh13.md).
- [ ] **Wiki nhắc 58/2005/QH11 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/02-2011-qh13.md).
- [ ] **Wiki nhắc 138/2019/TT-BTC nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/06-2024-tt-btc.md).
- [ ] **Wiki nhắc 78/2019/QH14 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/06-2024-tt-btc.md).
- [ ] **Wiki nhắc 40/2025/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/07-2026-tt-bct.md, wiki/sources/33-2025-tt-bct.md).
- [ ] **Wiki nhắc 71/2007/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/09-2013-tt-btttt.md).
- [ ] **Wiki nhắc 108/2016/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/10-2022-tt-btttt.md).
- [ ] **Wiki nhắc 17/2017/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/10-2022-tt-btttt.md, wiki/sources/11-2024-tt-btttt.md).
- [ ] **Wiki nhắc 28/2023/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/10-2024-tt-bkhcn.md).
- [ ] **Wiki nhắc 08/2014/NĐ-CP nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/10-2024-tt-bkhcn.md).
- [ ] **Wiki nhắc 68/2006/QH11 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/10-2024-tt-bxd.md, wiki/sources/49-2026-tt-bxd.md).
- [ ] **Wiki nhắc 56/2024/QH15 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/108-2025-qh15.md, wiki/sources/38-2019-qh14.md).
- [ ] **Wiki nhắc 88/2015/QH13 nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/108-2025-qh15.md).
- [ ] **Wiki nhắc 06/2021/TT-BCT nhưng sổ chưa có** — Thêm vào sổ (wiki/sources/11-2017-tt-bct.md).
- … và 117 điểm khác (xem bao-cao/diem-mu.json)

## Mã HS trong bảng không có trong biểu thuế (123)

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
- … và 83 điểm khác (xem bao-cao/diem-mu.json)

## Biểu thuế XNK Tổng cục nêu nhưng sổ chưa có (hs-code-api skill bieu-thue-xnk) (29)

- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 34/2024/NĐ-CP** — văn bản hiện hành của biểu/danh mục — Danh mục hóa chất Bảng 1,2,3 / Danh mục hóa chất nhập khẩu phải khai báo trước khi thông quan qua cổng thông tin một cửa  / Danh mục hóa chất Hóa chất cấm đầu tư kinh doanh theo quy định của Luật Đầu tư. Thêm vào sổ: node tools/them-van-ban.mjs "34/2024/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 01/2022/TT-BNNPTNN** — văn bản hiện hành của biểu/danh mục — Động vật, sản phẩm động vật trên cạn thuộc diện phải kiểm dịch / Giống vật nuôi cấm xuất khẩu / Giống vật nuôi cần bảo tồn. Thêm vào sổ: node tools/them-van-ban.mjs "01/2022/TT-BNNPTNN"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 03/2022/QH15** — văn bản bị thay (theo biểu) — Thuế tiêu thụ đặc biệt. Thêm vào sổ: node tools/them-van-ban.mjs "03/2022/QH15"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 05/2018/TT-BYT** — văn bản bị thay (theo biểu) — DM thực phẩm, phụ gia thực phẩm, chất hỗ trợ chế biến thực phẩm và dụng cụ, vật liệu bao g. Thêm vào sổ: node tools/them-van-ban.mjs "05/2018/TT-BYT"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 05/2019/TT-BXD** — văn bản bị thay (theo biểu) — DM, quy cách và chỉ tiêu kỹ thuật khoáng sản làm vật liệu xây dựng XK. Thêm vào sổ: node tools/them-van-ban.mjs "05/2019/TT-BXD"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 07/2020/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt ASEAN - Hồng Kông, Trung Quốc giai đoạn 2022 - 2027. Thêm vào sổ: node tools/them-van-ban.mjs "07/2020/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 08/2019/TT-BCA** — văn bản bị thay (theo biểu) — SPHH có khả năng gây mất an toàn thuộc trách nhiệm quản lý của Bộ Công An. Thêm vào sổ: node tools/them-van-ban.mjs "08/2019/TT-BCA"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 111/2020/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt Việt Nam -Liên minh Châu Âu / Biểu thuế xuất khẩu ưu đãi EVFTA. Thêm vào sổ: node tools/them-van-ban.mjs "111/2020/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 127/2022/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt Việt Nam - Lào. Thêm vào sổ: node tools/them-van-ban.mjs "127/2022/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 149/2017/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt Việt Nam – Hàn Quốc giai đoạn 2022 - 2027. Thêm vào sổ: node tools/them-van-ban.mjs "149/2017/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 150/2017/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt Việt Nam - Liên minh Kinh tế Á-Âu và các quốc gia thàn. Thêm vào sổ: node tools/them-van-ban.mjs "150/2017/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 153/2017/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt ASEAN - Trung Quốc giai đoạn 2022 - 2027. Thêm vào sổ: node tools/them-van-ban.mjs "153/2017/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 154/2017/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt Việt Nam và Chi Lê giai đoạn 2022 - 2027. Thêm vào sổ: node tools/them-van-ban.mjs "154/2017/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 155/2017/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt Việt Nam - Nhật Bản giai đoạn 2022 – 2028. Thêm vào sổ: node tools/them-van-ban.mjs "155/2017/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 156/2017/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt ASEAN giai đoạn 2022 – 2027. Thêm vào sổ: node tools/them-van-ban.mjs "156/2017/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 157/2017/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt ASEAN - Hàn Quốc giai đoạn 2022 - 2017. Thêm vào sổ: node tools/them-van-ban.mjs "157/2017/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 158/2017/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt Khu vực Thương mại tự do ASEAN – Ốt-xtrây-lin – Niu Di. Thêm vào sổ: node tools/them-van-ban.mjs "158/2017/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 159/2017/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt ASEAN - Ấn Độ giai đoạn 2022 - 2027. Thêm vào sổ: node tools/them-van-ban.mjs "159/2017/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 160/2017/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt ASEAN - Nhật Bản giai đoạn 2022 - 2023 - 2024 - 2025 -. Thêm vào sổ: node tools/them-van-ban.mjs "160/2017/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 23/2021/TT-BCT** — văn bản bị thay (theo biểu) — Chủng loại và tiêu chuẩn khoáng sản XK. Thêm vào sổ: node tools/them-van-ban.mjs "23/2021/TT-BCT"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 32/2023/NĐ-CP** — văn bản bị thay (theo biểu) — DM sản phẩm mật mã dân sự XNK theo giấy phép. Thêm vào sổ: node tools/them-van-ban.mjs "32/2023/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 39/2020/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt Việt Nam - Cuba. Thêm vào sổ: node tools/them-van-ban.mjs "39/2020/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 41/2018/TT-BGTVT** — văn bản bị thay (theo biểu) — HHNK phải chứng nhận chất lượng an toàn kỹ thuật và bảo vệ môi trường trước khi thông quan / Sản phẩm, hàng hóa phải chứng nhận công bố hợp quy. Thêm vào sổ: node tools/them-van-ban.mjs "41/2018/TT-BGTVT"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 45/2017/QĐ-TTg** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu thông thường. Thêm vào sổ: node tools/them-van-ban.mjs "45/2017/QĐ-TTg"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 53/2021/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt Việt Nam - Liên hiệp Vương quốc Anh và Bắc Ai-len / Biểu thuế NK ưu đãi đặc biệt UKVFTA. Thêm vào sổ: node tools/them-van-ban.mjs "53/2021/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 57/2019/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi đặc biệt của Việt Nam để thực hiện Hiệp định Đối tác Toàn diện  / Biểu thuế xuất khẩu ưu đãi để thực hiện hiệp định CPTPP. Thêm vào sổ: node tools/them-van-ban.mjs "57/2019/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 57/2020/NĐ-CP** — văn bản bị thay (theo biểu) — Biểu thuế nhập khẩu ưu đãi / Biểu thuế xuất khẩu. Thêm vào sổ: node tools/them-van-ban.mjs "57/2020/NĐ-CP"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 65/2017/TT-BTC** — văn bản bị thay (theo biểu) — Danh mục hàng hóa XNK. Thêm vào sổ: node tools/them-van-ban.mjs "65/2017/TT-BTC"
- [ ] **Biểu thuế Tổng cục nêu nhưng sổ chưa có: 924/QĐ-BNN** — văn bản bị thay (theo biểu) — HH là mẫu vật động vật rừng nguy cấp, quý, hiếm và động vật thuộc các phụ lục CITES / HH là mẫu vật thực vật rừng nguy cấp, quý hiếm; thực vật thuộc các phụ lục CITES / Đồ trang sức làm bằng chất liệu thực vật rừng, động vật rừng nguy cấp, quý, hiếm và động v. Thêm vào sổ: node tools/them-van-ban.mjs "924/QĐ-BNN"

## Văn bản danh mục chưa trích bảng mã HS (27)

- [ ] **Chưa trích bảng mã HS: 4814/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/4814-qd-bca-2026.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 49-PL1/2026/TT-BXD** — Văn bản danh mục chưa có danh-muc/49-pl1-2026-tt-bxd.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 49-PL2/2026/TT-BXD** — Văn bản danh mục chưa có danh-muc/49-pl2-2026-tt-bxd.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 1182/QĐ-BCT** — Văn bản danh mục chưa có danh-muc/1182-qd-bct-2021.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 496 mã.
- [ ] **Chưa trích bảng mã HS: 1725/QĐ-BCT** — Văn bản danh mục chưa có danh-muc/1725-qd-bct-2024.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 61 mã.
- [ ] **Chưa trích bảng mã HS: 173/2018/TT-BQP** — Văn bản danh mục chưa có danh-muc/173-2018-tt-bqp.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 41 mã.
- [ ] **Chưa trích bảng mã HS: 41/2019/TT-BCT** — Văn bản danh mục chưa có danh-muc/41-2019-tt-bct.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 32 mã.
- [ ] **Chưa trích bảng mã HS: 22/2018/TT-BTTTT** — Văn bản danh mục chưa có danh-muc/22-2018-tt-btttt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 31 mã.
- [ ] **Chưa trích bảng mã HS: 11/2024/TT-BTTTT** — Văn bản danh mục chưa có danh-muc/11-2024-tt-btttt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 23 mã.
- [ ] **Chưa trích bảng mã HS: 6266/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/6266-qd-bca-2023.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 19 mã.
- [ ] **Chưa trích bảng mã HS: 45/2023/TT-BCT** — Văn bản danh mục chưa có danh-muc/45-2023-tt-bct.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 15 mã.
- [ ] **Chưa trích bảng mã HS: 9981/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/9981-qd-bca.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 12 mã.
- [ ] **Chưa trích bảng mã HS: 125/2021/TT-BCA** — Văn bản danh mục chưa có danh-muc/125-2021-tt-bca.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test. Biểu thuế đang dẫn 1 mã.
- [ ] **Chưa trích bảng mã HS: 02/2024/TT-BTTTT** — Văn bản danh mục chưa có danh-muc/02-2024-tt-btttt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 09/2013/TT-BTTTT** — Văn bản danh mục chưa có danh-muc/09-2013-tt-btttt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 11/2026/TT-BXD** — Văn bản danh mục chưa có danh-muc/11-2026-tt-bxd.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 13/2018/TT-BTTTT** — Văn bản danh mục chưa có danh-muc/13-2018-tt-btttt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 14/2024/TT-BNNPTNT** — Văn bản danh mục chưa có danh-muc/14-2024-tt-bnnptnt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 1536/QĐ-BYT** — Văn bản danh mục chưa có danh-muc/1536-qd-byt-2026.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 16/2021/TT-BNNPTNT** — Văn bản danh mục chưa có danh-muc/16-2021-tt-bnnptnt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 2393/QĐ-BYT** — Văn bản danh mục chưa có danh-muc/2393-qd-byt-2025.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 28/2021/TT-BYT** — Văn bản danh mục chưa có danh-muc/28-2021-tt-byt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 28/2026/NĐ-CP** — Văn bản danh mục chưa có danh-muc/28-2026-nd-cp.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 40/2017/TT-BQP** — Văn bản danh mục chưa có danh-muc/40-2017-tt-bqp.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 44/2026/TT-BNNMT** — Văn bản danh mục chưa có danh-muc/44-2026-tt-bnnmt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 7866/QĐ-BYT** — Văn bản danh mục chưa có danh-muc/7866-qd-byt.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.
- [ ] **Chưa trích bảng mã HS: 8378/QĐ-BCA** — Văn bản danh mục chưa có danh-muc/8378-qd-bca-2025.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.

## Mã HS có hàng thật chưa đối chiếu KTCN 2026 (hs-code-api /api/demand) (17)

- [ ] **Hàng thật mã 39191099 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 39191099 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Chưa bảng KTCN 2026 nào có dòng nhóm 3919 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 84134000 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 84134000 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Bảng KTCN 2026 có dòng cùng nhóm 8413: 125/2026/TT-BCA — mở bản gốc đối chiếu xem mã 84134000 có bị trích sót không. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 84248990 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 84248990 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Bảng KTCN 2026 có dòng cùng nhóm 8424: 125/2026/TT-BCA, 27/2026/TT-BNNMT — mở bản gốc đối chiếu xem mã 84248990 có bị trích sót không. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 85158090 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-12) mang mã 85158090 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Bảng KTCN 2026 có dòng cùng nhóm 8515: 36/2026/TT-BKHCN — mở bản gốc đối chiếu xem mã 85158090 có bị trích sót không. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 85366932 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 85366932 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 34/2025/TT-BCT, 42/2019/TT-BCT. Bảng KTCN 2026 có dòng cùng nhóm 8536: 33/2026/TT-BCT, 36/2026/TT-BKHCN — mở bản gốc đối chiếu xem mã 85366932 có bị trích sót không. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 85369099 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-12) mang mã 85369099 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 34/2025/TT-BCT, 42/2019/TT-BCT. Bảng KTCN 2026 có dòng cùng nhóm 8536: 33/2026/TT-BCT, 36/2026/TT-BKHCN — mở bản gốc đối chiếu xem mã 85369099 có bị trích sót không. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 94054110 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-12) mang mã 94054110 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 08/2023/TT-BCT, 1182/QĐ-BCT-PL1, 2711/QĐ-BKHCN. Bảng KTCN 2026 có dòng cùng nhóm 9405: 125/2026/TT-BCA, 36/2026/TT-BKHCN — mở bản gốc đối chiếu xem mã 94054110 có bị trích sót không. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 94054140 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-12) mang mã 94054140 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 08/2023/TT-BCT, 1182/QĐ-BCT-PL1, 2711/QĐ-BKHCN. Bảng KTCN 2026 có dòng cùng nhóm 9405: 125/2026/TT-BCA, 36/2026/TT-BKHCN — mở bản gốc đối chiếu xem mã 94054140 có bị trích sót không. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 76109099 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 76109099 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 42/2019/TT-BCT, 33/2025/TT-BCT. Chưa bảng KTCN 2026 nào có dòng nhóm 7610 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 76169990 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 76169990 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 42/2019/TT-BCT, 33/2025/TT-BCT. Chưa bảng KTCN 2026 nào có dòng nhóm 7616 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 84123100 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-12) mang mã 84123100 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Chưa bảng KTCN 2026 nào có dòng nhóm 8412 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 84198110 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 84198110 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 08/2023/TT-BCT. Chưa bảng KTCN 2026 nào có dòng nhóm 8419 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 84224000 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 84224000 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 08/2023/TT-BCT. Chưa bảng KTCN 2026 nào có dòng nhóm 8422 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 84388091 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 84388091 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Chưa bảng KTCN 2026 nào có dòng nhóm 8438 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 84561190 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-12) mang mã 84561190 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Chưa bảng KTCN 2026 nào có dòng nhóm 8456 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 84642010 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 84642010 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Chưa bảng KTCN 2026 nào có dòng nhóm 8464 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.
- [ ] **Hàng thật mã 94035000 chưa đối chiếu danh mục KTCN 2026** — Món hàng thật (OZ, gặp gần nhất 2026-10-19) mang mã 94035000 nhưng chưa bảng danh mục KTCN 2026 nào trong danh-muc/ phủ mã này. Biểu thuế đang dẫn: 01/2024/TT-BNNPTNT, 08/2023/TT-BCT, 34/2025/TT-BCT, 42/2019/TT-BCT, 17/2023/TT-BNNPTNT. Chưa bảng KTCN 2026 nào có dòng nhóm 9403 — nhiều khả năng không thuộc diện; xác nhận theo phạm vi các danh mục. Kết luận: thuộc diện → bổ sung dòng vào bảng (docs/luoc-do-danh-muc-hs.md); không thuộc diện → ghi 1 dòng vào doi-chieu/hang-that.csv (ma_hs,ket_luan,can_cu,ngay,ghi_chu) để việc tự đóng.

## Thư viện hs-code-api ghi khác sổ (14)

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
- [ ] **2105/QĐ-BCT: hs-code-api ghi ACTIVE, sổ ghi HET_HIEU_LUC** — Thư viện /api/legal-docs của hs-code-api (2105/QD-BCT-2025, 2105/QD-BCT) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên hs-code-api.
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

## Bảng dẫn chiếu mã HS sang văn bản chưa có bảng (6)

- [ ] **16/2024/TT-BYT dẫn mã HS sang 3 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 3. Thêm 3 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **16/2024/TT-BYT dẫn mã HS sang 4 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 4. Thêm 4 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **16/2024/TT-BYT dẫn mã HS sang 5 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 5. Thêm 5 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **16/2024/TT-BYT dẫn mã HS sang 6 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 6. Thêm 6 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **16/2024/TT-BYT dẫn mã HS sang 7 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 7. Thêm 7 vào sổ rồi trích bảng để mã HS của các dòng này tra được.
- [ ] **16/2024/TT-BYT dẫn mã HS sang 8 — chưa có trong sổ** — danh-muc/16-2024-tt-byt.csv có dòng không ghi mã mà dẫn chiếu 8. Thêm 8 vào sổ rồi trích bảng để mã HS của các dòng này tra được.

## Sắp có hiệu lực (≤60 ngày) (1)

- [ ] **142/2026/TT-BTC có hiệu lực ngày 2026-11-16** — Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.

## THIEU_VBHN (1)

- [ ] **99/2013/NĐ-CP đã bị sửa đổi 3 lần nhưng chưa có văn bản hợp nhất** — Tìm văn bản hợp nhất (VBHN) của 99/2013/NĐ-CP trên vanban.chinhphu.vn; nếu có, thêm vào sổ kèm quan_he.hop_nhat trỏ về 99/2013/NĐ-CP.

## Hiệu lực chưa đối chiếu nguồn A (2271)

- [ ] **2711/QĐ-BKHCN: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **01/2018/TT-BCT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **01/2022/TT-BNNPTNT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **02/2011/QH13: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **02/2024/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **03/2015/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **03/2019/TT-BCT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **03/2024/TT-BNNPTNT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **04/2023/TT-BCT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **05/2014/TT-NHNN: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **05/2015/TT-BNNPTNT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **05/2016/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **05/2022/TT-BYT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **06/2007/QH12: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **06/2011/TT-BYT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **06/2019/NĐ-CP: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **06/2021/TT-BTC: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **06/2026/TT-BTC: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **06/VBHN-BNNPTNT: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **07/2022/QH15: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **07/2023/NĐ-CP: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **08/2015/NĐ-CP: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **08/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/2013/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/2015/TT-BYT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/2018/NĐ-CP: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/2018/TT-BYT: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/2025/TT-BNV: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/2026/NQ-CP: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **09/VBHN-BYT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **10/2018/NĐ-CP: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **10/2019/TT-BCT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **10/2020/TT-BTTTT: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **10/2024/TT-BKHCN: tình trạng "HET_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **10/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **100/2026/VBHN-TT-BNNMT: tình trạng "CON_HIEU_LUC" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **100/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **100/TB-TCHQ/2021: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **1005/TB-TCHQ/2025: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- [ ] **101/TB-TCHQ/2020: tình trạng "CHUA_XAC_MINH" chưa đối chiếu nguồn A** — Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.
- … và 2231 điểm khác (xem bao-cao/diem-mu.json)

## Chưa có toàn văn (160)

- [ ] **07/2022/QH15: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "07/2022/QH15" --ghi
- [ ] **114/2025/QH15: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "114/2025/QH15" --ghi
- [ ] **13/2008/QH12: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "13/2008/QH12" --ghi
- [ ] **146/2025/QH15: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "146/2025/QH15" --ghi
- [ ] **15/2012/QH13: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "15/2012/QH13" --ghi
- [ ] **29/2012/QH12: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "29/2012/QH12" --ghi
- [ ] **35/2018/QH14: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "35/2018/QH14" --ghi
- [ ] **36/2005/QH11: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "36/2005/QH11" --ghi
- [ ] **36/2009/QH12: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "36/2009/QH12" --ghi
- [ ] **42/2019/QH14: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "42/2019/QH14" --ghi
- [ ] **43/2024/QH15: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "43/2024/QH15" --ghi
- [ ] **50/2005/QH11: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "50/2005/QH11" --ghi
- [ ] **69/2025/QH15: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "69/2025/QH15" --ghi
- [ ] **73/2021/QH14: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "73/2021/QH14" --ghi
- [ ] **78/2025/QH15: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "78/2025/QH15" --ghi
- [ ] **79/2015/QH13: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "79/2015/QH13" --ghi
- [ ] **93/2025/QH15: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "93/2025/QH15" --ghi
- [ ] **01/2018/TT-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "01/2018/TT-BCT" --ghi
- [ ] **01/2022/TT-BNNPTNT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "01/2022/TT-BNNPTNT" --ghi
- [ ] **02/2018/TT-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "02/2018/TT-BCT" --ghi
- [ ] **02/2024/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "02/2024/TT-BTTTT" --ghi
- [ ] **03/2015/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "03/2015/TT-BTTTT" --ghi
- [ ] **03/2024/TT-BNNPTNT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "03/2024/TT-BNNPTNT" --ghi
- [ ] **05/2014/TT-NHNN: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "05/2014/TT-NHNN" --ghi
- [ ] **05/2015/TT-BNNPTNT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "05/2015/TT-BNNPTNT" --ghi
- [ ] **05/2016/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "05/2016/TT-BTTTT" --ghi
- [ ] **05/2022/TT-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "05/2022/TT-BYT" --ghi
- [ ] **06/2011/TT-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "06/2011/TT-BYT" --ghi
- [ ] **06/2019/NĐ-CP: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "06/2019/NĐ-CP" --ghi
- [ ] **09/2013/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "09/2013/TT-BTTTT" --ghi
- [ ] **09/2015/TT-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "09/2015/TT-BYT" --ghi
- [ ] **09/2025/TT-BNV: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "09/2025/TT-BNV" --ghi
- [ ] **09/VBHN-BYT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "09/VBHN-BYT" --ghi
- [ ] **10/2020/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "10/2020/TT-BTTTT" --ghi
- [ ] **100/2026/VBHN-TT-BNNMT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "100/2026/VBHN-TT-BNNMT" --ghi
- [ ] **102/2020/NĐ-CP: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "102/2020/NĐ-CP" --ghi
- [ ] **102/2020/QH14: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "102/2020/QH14" --ghi
- [ ] **11/2022/TT-BNNPTNT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "11/2022/TT-BNNPTNT" --ghi
- [ ] **11/2024/TT-BTTTT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "11/2024/TT-BTTTT" --ghi
- [ ] **12/2019/TT-BCT: chưa có toàn văn trong raw/** — node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "12/2019/TT-BCT" --ghi
- … và 120 điểm khác (xem bao-cao/diem-mu.json)

## Văn bản của cơ quan đã sáp nhập (21)

- [ ] **01/2024/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **03/2024/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **05/2015/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **10/2022/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **11/2018/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **11/2022/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **11/2024/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **1357/QĐ-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **14/2024/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **15/2021/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **16/2015/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **17/2023/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **19/VBHN-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **20/2017/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **20/2021/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **2079/QĐ-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **22/2018/TT-BTTTT (Bộ Thông tin và Truyền thông) còn ghi hiệu lực — cơ quan đã sáp nhập vào BKHCN** — Kiểm tra BKHCN đã ban hành văn bản thay thế chưa.
- [ ] **2538/QĐ-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **33/2014/TT-BNNPTNT (Bộ Nông nghiệp và Phát triển nông thôn) còn ghi hiệu lực — cơ quan đã sáp nhập vào BNNMT** — Kiểm tra BNNMT đã ban hành văn bản thay thế chưa.
- [ ] **3366/CHQ-GSQL (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.
- [ ] **6735/TB-TCHQ (Tổng cục Hải quan) còn ghi hiệu lực — cơ quan đã sáp nhập vào CHQ** — Kiểm tra CHQ đã ban hành văn bản thay thế chưa.

## Biểu thuế Tổng cục còn coi là hiện hành nhưng sổ ghi hết/tạm ngưng — cần văn bản thay (13)

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
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 693/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục, cột chính sách mặt hàng (4 mã HS) — Áp dụng biện pháp chống lẩn tránh PVTM đối với Thép cuộn, thép dây (Nhiều nước). Sổ ghi HET_HIEU_LUC từ 2026-03-22 (đã đối chiếu nguồn A), không có văn bản thay/bãi trong sổ — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.
- [ ] **Biểu thuế bieu-thue@2026.04.05 còn dẫn 2491/QĐ-BCT nhưng sổ ghi HET_HIEU_LUC** — văn bản hiện hành của biểu/danh mục — Áp thuế chống bán phá giá đối với Một số sản phẩm ván sợi gỗ (TH, CN). Sổ ghi bị thay bởi 121/QĐ-BCT (đã đối chiếu nguồn A) — phần sổ đã xong; lệch còn lại nằm ở bản chụp biểu của Tổng cục, cầu nối hs-code-api báo khi sổ đổi.

## Chưa xếp vào cây (9)

- [ ] **06/2019/NĐ-CP: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **102/2020/NĐ-CP: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **113/2017/NĐ-CP: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **1175/QĐ-TTg: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **12/2018/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **15/2012/QH13: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **17/2023/TT-BNNPTNT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **211/2025/NĐ-CP: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.
- [ ] **45/2023/TT-BCT: chưa xếp vào cây** — Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.

## HS_API đã chặn săn — chờ nguồn A / số hiệu đúng (không săn lặp) (8)

- [ ] **Chờ mở chặn 2711/QĐ-BKHCN (THIEU_BAI_TUONG_MINH) — 263 mã HS** — Đã ghi xac_minh.chan: THIEU_BAI_TUONG_MINH (2026-10-04). Việc tiếp: Chờ QĐ/TT-BKHCN hoặc vbpl ghi rõ hết/còn 2711; không suy ra HET từ NĐ 37 hết khung 132/74 hay TT 36 danh mục rủi ro mới.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 6266/QĐ-BCA (THIEU_PDF_A) — 19 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-04). Việc tiếp: Chờ PDF A của 6266 hoặc của QĐ 8378/4814 (nguồn B nói 8378 thay 6266 rồi 4814 bãi 8378). Theo dõi bocongan.gov.vn/media.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 2284/QĐ-BKHCN (THIEU_PDF_A) — 19 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-04). Việc tiếp: Chờ PDF A trên datafiles/most/mst; chicuctdc chỉ tóm tắt (không bậc A).. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 9981/QĐ-BCA (THIEU_PDF_A) — 12 mã HS** — Đã ghi xac_minh.chan: THIEU_PDF_A (2026-10-09). Việc tiếp: customs Attachments/12857 đã 404; chờ bản ký số trên datafiles/bocongan. Không nạp từ TVXNK (C) để đánh true. Ngoài ra, 6266/QĐ-BCA (2023) thay TT 08/2019/TT-BCA, KHÔNG thay QĐ 9981. 125/2026/TT-BCA Điều 5 quy định chuyển tiếp nhưng không ghi rõ thay 9981 — cần đối chiếu thêm khi có nguồn A.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 2105/QĐ-BCT (THIEU_DIEU_THI_HANH_A) — 6 mã HS** — Đã ghi xac_minh.chan: THIEU_DIEU_THI_HANH_A (2026-10-04). Việc tiếp: Chờ PDF A của chính 2105 trên moit/pvtm (Điều 3 thi hành). Hết HL theo 1309 chỉ chốt được khi đã có cả hai vế trên A.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 3546/QĐ-BCT (CHO_CONG_BO_A) — 6 mã HS** — Đã ghi xac_minh.chan: CHO_CONG_BO_A (2026-10-04). Việc tiếp: Theo dõi pvtm/moit đăng PDF kết quả AR02.AD10; trav AD10 chưa có file 3546 (đến 04-10-2026).. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 366/QĐ-BKHCN (THIEU_BAI_TUONG_MINH) — 6 mã HS** — Đã ghi xac_minh.chan: THIEU_BAI_TUONG_MINH (2026-10-04). Việc tiếp: Cùng khung 2711 — chờ bãi tường minh; xem canh_bao/chan của 2711/QĐ-BKHCN.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
- [ ] **Chờ mở chặn 45/2024/TT-BCT (SO_HIEU_LECH) — 1 mã HS** — Đã ghi xac_minh.chan: SO_HIEU_LECH (2026-10-04). Việc tiếp: Đối chiếu mã HS bên hs-code-api — Công báo không có 45/2024/TT-BCT (có 45/2024/TT-BTC, 45/2025/TT-BCT). Mở issue hs-code-api nếu lệch số hiệu.. Không săn lại cùng URL chết — chạy node tools/san-hieu-luc.mjs để xem hàng đợi còn làm được.
