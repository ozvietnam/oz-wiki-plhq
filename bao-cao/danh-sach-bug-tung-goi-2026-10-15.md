# BÁO CÁO RÀ BUG TỪNG GÓI TB-TCHQ
## Danh sách cần sửa

**Ngày rà:** 2026-10-15  
**Phương pháp:** Script tự động + đối chiếu văn bản gốc  
**Nguồn:** `data/community/tb-tchq/*.json` (130 file, 4.592 records)  
**Tác giả:** Hermes (Sếp Thắng)  

## 1. TỔNG QUAN
| Hạng mục | Giá trị |
|---|---|
| Tổng file | 130 |
| File có bug | 6 |
| Tổng records trong file có bug | 2.124 |
| **Tổng bug** | **48** |

## 2. CÁC LOẠI BUG
| Loại | Số | Mức |
|---|---|---|
| `DESC_NGAN` (description < 40 char) | 20 | THẤP |
| `REASON_RONG` (reasonVi rỗng) | 28 | TRUNG BÌNH |

## 3. CHI TIẾT TỪNG GÓI

### 3.1. `toan-van.json`

- **Records:** 312
- **Tổng bug:** 22

- **DESC_NGAN** (3): Description < 40 ký tự

  - #36: `Khung điện thoại (dạng bán thành phẩm)`
  - #123: `Kính thư giãn PSiO`
  - #258: `Trái cây nghiền Byba - táo chuối`

- **REASON_RONG** (19): reasonVi rỗng

  - #61
  - #102
  - #103
  - #105
  - #109
  - #167
  - #202
  - #203
  - #231
  - #240
  - #241
  - #270
  - #271
  - #272
  - #276
  - #301
  - #303
  - #304
  - #305


### 3.2. `lvn-cu-1.json`

- **Records:** 377
- **Tổng bug:** 12

- **DESC_NGAN** (5): Description < 40 ký tự

  - #21: `Chất hóa dẻo PVC Tri- o — Trio`
  - #90: `Chất kết dính BC-FF — Dicumyl peroxide`
  - #111: `Hợp chất Ethyl cyanoacrylate`
  - #279: `Cát nghiền từ đá cát kết`
  - #282: `Lò xo của khe cắm thẻ nhớ`

- **REASON_RONG** (7): reasonVi rỗng

  - #244
  - #287
  - #295
  - #310
  - #311
  - #312
  - #340


### 3.3. `lvn-cu-2.json`

- **Records:** 413
- **Tổng bug:** 7

- **DESC_NGAN** (5): Description < 40 ký tự

  - #2: `Dung dịch nhôm dihydrogen phosphat`
  - #60: `Theo phụ lục đính kèm`
  - #184: `Acetaminophen (nguyên liệu sx thuốc)`
  - #235: `Levosulpiride (nguyên liệu sx thuốc)`
  - #369: `Bột da dùng để sản xuất vải không dệt`

- **REASON_RONG** (2): reasonVi rỗng

  - #139
  - #212


### 3.4. `lvn-2020.json`

- **Records:** 462
- **Tổng bug:** 3

- **DESC_NGAN** (3): Description < 40 ký tự

  - #183: `Bột oxit silic được phủ hợp chất silane`
  - #265: `Bisphenol-A (Bisphenol-A) — Bisphenol A`
  - #450: `Hesperidin`


### 3.5. `lvn-cu-3.json`

- **Records:** 321
- **Tổng bug:** 2

- **DESC_NGAN** (2): Description < 40 ký tự

  - #75: `NCT#&Nhãn chống trộm bằng nhựa`
  - #271: `4,4-Methylenedianiline`


### 3.6. `lvn-2019.json`

- **Records:** 239
- **Tổng bug:** 2

- **DESC_NGAN** (2): Description < 40 ký tự

  - #97: `3,5-Dimethylphenol`
  - #237: `Bột từ thịt lợn, đã sấy khô`


## 4. HƯỚNG XỬ LÝ ĐỀ XUẤT

### 4.1. REASON_RONG (28 records)
- Ưu tiên: TRUNG BÌNH
- Cách sửa: Bổ sung `reasonVi` từ `description` + `productName` từ precedents
- Rule: `reasonVi` phải có nội dung chuẩn hóa ≥ 150 ký tự

### 4.2. DESC_NGAN (20 records)
- Ưu tiên: THẤP
- Cách sửa: Bổ sung từ khóa kỹ thuật (cấu trúc, công dụng, thông số) từ precedents
- Rule: `description` ≥ 40 ký tự + tên hàng thực tế + đặc tính quyết định phân loại

## 5. KẾT LUẬN
- 130 file community TB-TCHQ: 124 file PASS hoàn toàn
- 6 file cần sửa: 48 bug
- Loại bug chính: REASON_RONG (28) + DESC_NGAN (20)
- Thời gian sửa dự kiến: 30-60 phút (script tự động)