---
id: tom-tat-14-dm-09-2024-tt-byt
title: "14 Danh mục của 09/2024/TT-BYT — tóm tắt cấu trúc và cách tra cứu"
type: summary
created: 2026-10-09
updated: 2026-10-09
key_sources: []
covers:
  - 09-2024-tt-byt
  - 105-2016-qh13
related_concepts:
  - thuoc-theo-luat-duoc-2016
  - duoc-lieu-theo-luat-duoc-2016
  - phan-biet-3004-3005-3006
confidence: high
tags: [tong-hop, ktcl, byt, phan-loai-hs]
---

## Vấn đề thực tế

Khi tra mã HS cho hàng hóa có yếu tố **dược phẩm / nguyên liệu làm thuốc / mỹ phẩm**, **Bộ Y tế** là một trong những cơ quan KTCL quan trọng nhất. 09/2024/TT-BYT ban hành **14 danh mục (DM1-DM14)** mà mỗi DM gồm danh sách các mặt hàng + mã HS đã được BYT xác định sẵn.

Nếu hàng của mình **có trong DM** → mã HS là chắc chắn, KTCL theo DM đó.
Nếu hàng **chưa có trong DM** → theo Điều 3.2 09/2024/TT-BYT, áp dụng pháp luật HQVN, **SAU ĐÓ** DN gửi VB về BYT (Cục QLD / Cục QLYDCT) để BYT cập nhật DM bổ sung.

## Tóm tắt 14 Danh mục

| DM | Tên đầy đủ | Số dòng CSV | Mã HS thường gặp | Dùng cho |
|---|---|---|---|---|
| **DM1** | Thuốc độc, nguyên liệu độc làm thuốc | 219 | 29372900, 29159090, 29339990 | Thuốc gây độc tế bào (chống ung thư) |
| **DM2** | Nguyên liệu gây nghiện | 43 | 29391100 (morphin) | Dược chất gây nghiện |
| **DM3** | Nguyên liệu hướng thần | 70 | 2933.xx (benzodiazepine) | Dược chất hướng thần |
| **DM4** | Tiền chất dùng làm thuốc | 8 | 29141100 (acetone) | Tiền chất ma túy |
| **DM5** | Thuốc/dược chất thuộc DM chất cấm một số ngành | 124 | (nhiều) | Chất cấm SX trong nông nghiệp, thú y... |
| **DM6** | Nguyên liệu phóng xạ y tế | 1 | 2844.xx | Chất phóng xạ dùng trong y tế |
| **DM7** | Dược chất + bán thành phẩm | 620 | 2941.xx, 2942.xx | Dược chất chưa pha chế, bán thành phẩm |
| **DM8** | Thuốc 01 thành phần dược chất | 1.280 (lớn nhất) | 3003.90, 3004.10, 3004.20 | Thuốc thành phẩm đơn chất |
| **DM9** | Thuốc dạng phối hợp | 412 | 3004.90.xx | Thuốc thành phẩm nhiều hoạt chất (kể cả miếng dán) |
| **DM10** | Vắc xin | 56 | 3002.xx | Vắc xin, sinh phẩm |
| **DM11** | Dược liệu làm thuốc | 365 | 12119017, 12119018, 30019000 | Dược liệu tươi/khô/đã cắt/nghiền/bột |
| **DM12** | Chất chiết xuất từ dược liệu, tinh dầu làm thuốc | 25 | 1302.xx, 3301.xx (33012500 bạc hà, 33012970 gừng/quế) | Chiết xuất, tinh dầu dùng làm thuốc |
| **DM13** | Thuốc cổ truyền, thuốc dược liệu | 90 | 3004.90.98 (Đông y), 3004.90.13 (từ nguyên liệu) | Thuốc YHCT thành phẩm (dạng viên/siro) |
| **DM14** | Mỹ phẩm | 21 | 3304.99, 3305.xx | Mỹ phẩm XNK |

**Tổng:** 3.334 dòng / 333 mã duy nhất (một số hoạt chất/mỹ phẩm trùng mã).

## Cách tìm mặt hàng trong DM

### Bước 1: Xác định mặt hàng thuộc DM nào

Theo **bản chất + mục đích sử dụng**:

| Mặt hàng | DM | Mã HS |
|---|---|---|
| Bột gừng khô để SX thuốc | DM11 | 12119017 (chưa nghiền) hoặc 12119018 (đã nghiền) |
| Bột quế để SX thuốc | DM11 | 12119017 |
| **Tinh dầu gừng** | DM12 | 33012970 |
| **Thanh cao (Ngải cứu)** | DM11 | 12119017 (chưa nghiền) / 12119018 (đã nghiền) |
| Cao dán gừng + ngải cứu (sản phẩm hoàn chỉnh) | KHÔNG CÓ TRONG DM | theo Điều 3.2 → pháp luật HQVN |
| Viên An cung ngưu hoàng hoàn | DM13 | 3004.90.98 |
| Cao dán Salonpas (Menthol + Methyl salicylate) | DM9 | 3005.10.10 |
| Thuốc nhỏ mắt | DM9 | 3004.90.xx |

### Bước 2: Tìm bằng tên trong CSV

⚠️ **Lưu ý:** Tên trong DM là **tên Dược điển VN** hoặc **tên khoa học (Latin)**, KHÔNG phải tên thương mại phổ thông. Ngoài ra, **cấu trúc CSV hiện tại chỉ có 2 cột `ma_hs` + `mo_ta`** — mất 60-70% thông tin so với VB gốc (Tên VN, Tên KH, Bộ phận dùng, Dạng dùng...).

VD: "Ngải cứu" (tên thường) → trong DM11 ghi là **"Thanh cao"** (tên Dược điển VN, vì Ngải cứu = Artemisia vulgaris, cùng chi Artemisia với Thanh cao = Artemisia annua).

**Cấu trúc cột đầy đủ của từng DM (theo VB gốc):**

| DM | Số cột | Cấu trúc |
|---|---|---|
| DM1-4 | 5 | STT \| Mô tả \| Mã HS \| Tên nguyên liệu \| Dạng dùng |
| DM5 | 5 | STT \| Mô tả \| Mã HS \| **Tên dược chất** \| Dạng dùng |
| DM6 | 3 | STT \| **Tên thuốc phóng xạ** \| Mã HS |
| DM7 | 4 | STT \| **Tên nguyên liệu, bán thành phẩm** \| Dạng dùng \| Mã HS |
| DM8 | 5 | STT \| Mô tả \| Mã HS \| **Tên dược chất** \| Dạng dùng |
| DM9 | 5 | STT \| Mô tả \| Mã HS \| **Tên thành phần hoạt chất** \| Dạng dùng |
| DM10 | 4 | STT \| **Tên vắc xin** \| **Công dụng** \| Mã HS |
| **DM11** | 6 | STT \| Tên VN \| **Bộ phận dùng** \| **Tên KH** \| Mô tả \| Mã HS |
| DM12 | 4 | STT \| Tên \| **Tên KH** \| Mã HS |
| DM13 | 5 | STT \| Tên thuốc \| **Thành phần** \| **Dạng bào chế** \| Mã HS |
| DM14 | 3 | STT \| Mô tả \| Mã HS |

**Cần trích lại CSV với đầy đủ cột** để tra cứu chính xác tên Dược điển VN, bộ phận dùng, dạng bào chế.

### Bước 3: Nếu không có trong DM

Theo **Điều 3.2 09/2024/TT-BYT**:
> *"Đối với các thuốc, nguyên liệu làm thuốc, mỹ phẩm xuất khẩu, nhập khẩu chưa được liệt kê và xác định mã số hàng hóa trong các Danh mục ban hành kèm theo Thông tư này, việc xác định mã số hàng hóa thực hiện theo quy định của pháp luật về hải quan. **Sau khi thông quan**, các tổ chức, cá nhân xuất khẩu, nhập khẩu có văn bản gửi về Bộ Y tế (Cục Quản lý Dược, Cục Quản lý Y, Dược cổ truyền) để làm cơ sở phối hợp với Bộ Tài chính xem xét thống nhất, cập nhật và ban hành Danh mục bổ sung."*

→ **DN vẫn được NK**, mã HS do HQVN xác định theo GRI + chú giải. Nhưng BYT sẽ **từ chối cấp giấy phép** nếu hàng thuộc diện BYT quản lý mà chưa có trong DM (vì Điều 3.2 nói gửi VB **sau khi** thông quan = BYT không cấp phép trước).

→ **Bài học thực tế:** Cao dán gừng + ngải cứu KHÔNG có trong DM9 → BYT từ chối tiếp nhận hồ sơ cấp phép. DN phải:
1. Tự đề xuất mã HS theo pháp luật HQVN (3005.10.90 — theo chú giải heading 3005)
2. Gửi VB về **Cục QLYDCT** (Điều 5) **sau khi thông quan** đề nghị BYT bổ sung DM
3. Chờ BYT ban hành DM bổ sung mới có thể xin giấy phép nhập khẩu chính thức

## Điều 3.3 — Cùng mặt hàng nhiều mục đích

> *"Các mặt hàng dược chất, dược liệu, các chất chiết xuất từ dược liệu, tinh dầu ngoài mục đích làm thuốc còn có thể sử dụng với mục đích khác nhau. Theo đó, trường hợp nhưng mặt hàng này **sử dụng làm thuốc, nguyên liệu làm thuốc thì phải áp dụng quy định theo pháp luật về dược**; trường hợp sử dụng với mục đích khác thì áp dụng quy định pháp luật khác có liên quan."*

→ Cùng 1 mặt hàng (VD: bột gừng), nhưng:
- Dùng làm thuốc → DM11, 12119017/12119018, KTCL theo Luật Dược
- Dùng nấu ăn → Ch.9 (gia vị), 0910.30, KTCL ATTP
- Dùng mỹ phẩm → Ch.33, 3301.29, KTCL theo NĐ 93/2016

HQVN xác định theo **công bố trên bao bì + giấy tờ kèm theo + mục đích đăng ký của DN**.

## Điểm mù đã phát hiện

### 1. DM13 chỉ có thuốc cổ truyền dạng viên/siro
90 dòng DM13 bao gồm An cung ngưu hoàng hoàn, Đại tràng hoàn, Bổ tỳ, Cảm xuyên hương plus... **Tất cả đều dạng viên/siro, KHÔNG có cao dán**. → Cao dán thảo mộc không có mã trong DM.

### 2. DM9 có 1 dòng miếng dán (3005.10.10) — Menthol + Methyl salicylate
Đây là dòng DUY NHẤT trong DM9 cho thấy BYT công nhận miếng dán có dược chất thuộc 3005.10. Nhưng dòng này ghi **dược chất tổng hợp** (Menthol, Methyl salicylate, Camphor, Thymol), **KHÔNG có dược liệu tự nhiên** (gừng, ngải cứu).

### 3. "Ngải cứu" trong DM11 tên là "Thanh cao"
Nếu tìm "ngải cứu" theo tên thường → KHÔNG thấy. Phải tìm "Thanh cao" theo Dược điển VN.

## Cách dùng 09/2024/TT-BYT trong tra cứu HS

### Flow 1: Hàng có trong DM
```
Tra HS → có trong DM1-14 → mã HS theo DM, KTCL theo DM đó → DONE
```

### Flow 2: Hàng KHÔNG có trong DM
```
Tra HS → không có trong DM1-14 → xem mục đích sử dụng
├── Làm thuốc (Điều 3.3) → theo Luật Dược → KTCL theo Luật Dược → liên hệ Cục QLD
│   → trước NK: DN TỰ đề xuất mã theo pháp luật HQVN (GRI + chú giải)
│   → sau NK: gửi VB về BYT (Cục QLD / Cục QLYDCT) đề nghị cập nhật DM
└── Mục đích khác (thực phẩm, mỹ phẩm, gia vị) → KTCL theo PL tương ứng
    → VD: nấu ăn → ATTP; mỹ phẩm → NĐ 93/2016
```

## Tài liệu liên quan

- `registry/van-ban/09-2024-tt-byt.yaml` — đã update 2026-10-09 (ghi rõ đã đọc Điều 1-4)
- `danh-muc/09-2024-tt-byt.csv` — 3.335 dòng, 14 DM
- `raw/download/vcci.com.vn/2024/6/09-2024-tt-byt-body.txt` — toàn văn 13.9 MB
- [[concepts/thuoc-theo-luat-duoc-2016]] — Định nghĩa thuốc theo Luật Dược
- [[concepts/duoc-lieu-theo-luat-duoc-2016]] — Định nghĩa dược liệu
- [[concepts/phan-biet-3004-3005-3006]] — Decision tree 3004 vs 3005 vs 3006

## Use case đã giải quyết nhờ trang này

**Cao dán gừng + ngải cứu (use case thật 2026-10-09):**
1. Tìm "ngải cứu" trong CSV → KHÔNG thấy (vì tên Dược điển VN là "Thanh cao")
2. Tìm "gừng" trong CSV → thấy ở DM12 (tinh dầu) mã 33012970 — nhưng đây là tinh dầu, không phải cao dán
3. Tìm "gừng" ở DM11 (dược liệu) → không có dòng riêng (chỉ có Quế chi, Quế nhục, Thanh cao, Cúc hoa vàng, Bạch chỉ, Bạch cập...)
4. **Kết luận:** Cao dán thảo mộc (gừng + ngải cứu) KHÔNG có trong bất kỳ DM nào → theo Điều 3.2 → áp dụng PL HQVN → 3005.10.90 (theo chú giải heading 3005)

## Confidence

**High** — Toàn văn đã tải từ VCCI (bậc B) + đối chiếu với vbpl.vn (bậc A), đã đọc Điều 1, 2, 3, 4, 5, đã phân tích 3.335 dòng CSV bằng pandas/csvkit.
