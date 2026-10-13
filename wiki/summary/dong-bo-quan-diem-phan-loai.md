---
id: dong-bo-quan-diem-phan-loai
title: "Đồng bộ quan điểm phân loại hàng: biểu thuế ↔ văn bản luật ↔ tiền lệ TB-TCHQ"
type: summary
created: 2026-10-13
updated: 2026-10-13
covers:
  - phan-loai-ma-hs
  - muc-do-rui-ro-hang-hoa
tags: [phan-loai-hs, bieu-thue, tien-le, tb-tchq, hs-index-theo-ma]
confidence: high
---

## Overview

Trả lời một ca nhập hàng cần **bốn tầng quan điểm phân loại đứng chung một nhịp**. Trang này chốt xem mỗi tầng lấy căn cứ ở đâu trong kho, đã khớp tới đâu, và khi chúng lệch nhau thì xử lý theo quy tắc nào. Sản phẩm kỹ thuật: `dist/hs-index-theo-ma.json` (từ 1.2.0) — bản đảo chiều **mã HS → văn bản áp** kèm cảnh báo lệch và mật độ tiền lệ; và `danh-muc/chu-giai-chuong.json` — **chú giải 97 chương + GIR** của Danh mục TT 31/2022 (nguồn A, Công báo 07/2022).

## Bốn tầng quan điểm

| Tầng | Căn cứ pháp lý | Kho đang có | Trạng thái |
|---|---|---|---|
| 1. Quy tắc phân loại | **TT 85/2026/TT-BTC** (thay 14/2015 + 17/2021 từ 15/9/2026): Điều 4 ghi nhận 5 nguyên tắc tuân thủ gồm 6 GRI WCO; Điều 6.1 liệt kê 4 tài liệu tra cứu (chú giải chi tiết HS WCO, tuyển tập ý kiến WCO, chú giải bổ sung AHTN, CSDL VN) — nguyên văn **không quy định thứ tự ưu tiên** | Sổ + [[concepts/phan-loai-ma-hs]], nguồn A đã đối chiếu | ✅ |
| 2. Biểu thuế | Mô tả dòng mã 8 số của biểu thuế XNK; **chú giải chương/mục/phân nhóm là bộ phận của biểu thuế** (Danh mục TT 31/2022/TT-BTC, AHTN 2022) | Bản chụp 11.871 mã (`nhu-cau/bieu-thue.json`) + **chú giải 97 chương + chú giải phân nhóm + 6 quy tắc tổng quát (GIR)** trích từ Công báo gốc (`danh-muc/chu-giai-chuong.json`, tra bằng `npm run chu-giai <chương\|mã>`) | ✅ đã nạp chú giải |
| 3. Văn bản danh mục (KTCN, giấy phép…) | Danh mục kèm mã HS — mã chỉ là **khóa dẫn diện áp**, văn bản không định nghĩa lại mã | 27 bảng CSV → `dist/hs-index-theo-ma.json`: 5.305 nhóm mã (443 nhóm 4 số, 611 nhóm 6 số, 4.251 mã 8 số), 9.900 cạnh sau gộp trùng | ✅ |
| 4. Tiền lệ thực tiễn | TB-TCHQ/TB-CHQ — **văn bản cá biệt**, chỉ tham khảo | `tien_le_tb_tchq` trong hs-index-theo-ma (721 mã 8 số theo customs.gov.vn + 397 nhóm 4 số theo tracuuhs); tra chi tiết `npm run tien-le` | ✅ (bậc C) |

## Khi quan điểm lệch nhau — số liệu thật

- **114/5.305 nhóm mã** trong các bảng danh mục **không có trong biểu thuế 2026** (`canh_bao_ma`). Nguyên nhân điển hình: văn bản ban hành theo AHTN cũ, biểu thuế đã bỏ mã. Ví dụ cụ thể đã đối chiếu ([danh-muc/kiem-tra-ma-hs-2026.md](../danh-muc/kiem-tra-ma-hs-2026.md)): 09/2024/TT-BYT dùng AHTN 2017 — 8/316 mã (2,5%) như `28389000` (Sennosides), `30343290`… không còn trong biểu thuế 2026.
- Hệ quả pháp lý: tra `28389000` vẫn ra diện 09/2024/TT-BYT, nhưng **mã đó không khai báo được trên biểu thuế hiện hành** → phải xác định lại mã theo tầng 1–2 rồi mới bàn diện áp. `hs-index-theo-ma` trả các khoá này kèm cờ trong `canh_bao_ma` để bên đọc dừng đúng chỗ.
- Cạnh "trùng" trong bảng (cùng văn bản + loại tác động + điều kiện): 3.643/13.543 cạnh là trích đôi — đã gộp; ~1.300 cạnh còn lại khác mức rủi ro/phụ lục → giữ vì mang nghĩa (vd cùng mã xuất hiện ở Phần A cao và Phần B trung bình của hai văn bản khác nhau).

## Quy tắc đồng bộ khi trả lời ca nhập hàng

1. **Định mã trước, nói diện sau**: mã HS xác định theo GRI (TT 85/2026 Điều 4 — nguyên văn 6 quy tắc tra `npm run chu-giai -- --quy-tac`) + chú giải chương/phân nhóm (tra `npm run chu-giai <chương|mã>`, ví dụ `8708.22` → chương 87). Chưa chắc mã thì mọi kết luận diện áp chỉ là giả định.
2. **Tra diện áp theo `hs-index-theo-ma`** (khớp tiền tố 4/6/8); đọc kèm `dieu_kien` — "trừ loại…" là trừ diện, ký hiệu "ex" là diện hẹp.
3. **Kiểm `canh_bao_ma`**: khoá tra ra nằm trong cảnh báo → không kết luận; ghi điểm mù để đối chiếu lại văn bản gốc theo mã mới.
4. **Tiền lệ chỉ là điểm tựa tranh luận**: nêu `tien_le_tb_tchq`/`npm run tien-le` khi cần lập luận quan điểm, luôn kèm độ tin cậy bậc C và số hiệu thông báo để người đọc tự mở gốc.

## Open questions

- **Chú giải bổ sung (SEN) của AHTN 2022**: văn bản TT 31/2022 chỉ dẫn *tham khảo* ấn phẩm SEN — nội dung SEN không in trong Công báo; muốn đủ tầng chú giải AHTN cần nguồn ASEAN/WCO riêng.
- 5 mã "khớp 6 số đầu" của 09/2024/TT-BYT (kiểm-tra-ma-hs-2026.md) cần chốt mã 8 số thực tế.
- 65/2017/TT-BTC + 09/2019/TT-BTC (bị TT 31/2022 thay, đã ghi quan hệ) chưa có tệp sổ — việc `he-thong-hoa` trong báo cáo điểm mù.

## Key concepts

- [[concepts/phan-loai-ma-hs]]
- [[concepts/muc-do-rui-ro-hang-hoa]]

## Sources covered

- [85/2026/TT-BTC](../sources/85-2026-tt-btc.md) (nguồn A, đã đối chiếu)
- TT 31/2022/TT-BTC — 18 phần Công báo 523–558 trong `raw/download/congbaocdn.chinhphu.vn/tt-31-2022-cb-*.pdf`; bản trích chú giải `danh-muc/chu-giai-chuong.json` (dựng bằng `npm run trich-chu-giai`, tra bằng `npm run chu-giai`)
- [docs/tien-le-tb-tchq.md](../docs/tien-le-tb-tchq.md)
- `dist/hs-index-theo-ma.json` (lược đồ ≥ 1.2.0) · `docs/tich-hop.md`
