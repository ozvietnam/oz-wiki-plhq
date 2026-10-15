# BÁO CÁO RÀ BUG CÁC GÓI TB-TCHQ
## data/community/tb-tchq/ (86 file)

**Ngày rà:** 2026-10-15  
**Phương pháp:** Validate schema + 5 tiêu chí nghiêm  
**Nguồn:** `hs-code-api/data/community/tb-tchq/*.json`  
**Schema:** `schemas/community-contribution.schema.json`  
**Tác giả:** Hermes (Sếp Thắng)  

## 1. TỔNG QUAN
| Hạng mục | Giá trị |
|---|---|
| Tổng file community | 86 |
| Tổng record | ~6.500 |
| **Tổng bug phát hiện** | **949** |

## 2. PHÂN LOẠI BUG
| Loại bug | Số lượng | Mức độ |
|---|---|---|
| `DUPLICATE_HS_TRONG_FILE` | 626 | TRUNG BÌNH |
| `REASON_NGAN` (< 150 ký tự) | 247 | THẤP |
| `DUPLICATE_TB_TRONG_FILE` | 60 | TRUNG BÌNH |
| `DESC_CHUA_TK` (chứa 'tờ khai') | 16 | CAO |

## 3. CHI TIẾT TỪNG LOẠI

### 3.1. DUPLICATE_HS_TRONG_FILE (626 records)
**Mô tả:** Nhiều record trong cùng 1 file có cùng `hsCode`

**Nguyên nhân có thể:**
- Cùng 1 mã HS có nhiều TB-TCHQ khác nhau (hợp lý - mỗi TB là 1 quyết định riêng)
- Hoặc do merge lỗi từ các gói trước

**Top 10 file có nhiều duplicate nhất:**
| File | Số mã trùng | Tổng duplicate |
|---|---|---|
| `tracuuhs-2026-10-10-lot-01.json` | 50+ | 200+ |
| `ch85b.json` | 50+ | 100+ |
| `tracuuhs-2026-10-13-goi-006.json` | 20+ | 50+ |
| `tracuuhs-2026-10-13-goi-010.json` | 30+ | 50+ |
| `tracuuhs-2026-10-14-goi-084.json` | 20+ | 50+ |
| `tracuuhs-2026-10-15-goi-085.json` | 20+ | 50+ |
| `lvn-cu-3.json` | 30+ | 50+ |
| `lvn-cu-2.json` | 20+ | 30+ |

**Vấn đề thực tế:**
- Trùng `hsCode` không phải lỗi nếu mỗi record có `source.reference` (TB-TCHQ) khác nhau
- Nhưng nếu cùng hsCode + cùng TB-TCHQ → lỗi merge

### 3.2. REASON_NGAN (247 records)
**Mô tả:** Record TB-TCHQ có `reasonVi` < 150 ký tự

**Quy tắc:** TB-TCHQ yêu cầu reasonVi ≥ 150 ký tự (CEO quy định)

**Mẫu vi phạm:**
| File | idx | Length |
|---|---|---|
| `tracuuhs-2026-10-10-lot-01.json` | #0 | 130 |
| `lvn-cu-3.json` | #1 | 101 |
| `tracuuhs-2026-10-15-goi-093.json` | #0 | 124 |

### 3.3. DUPLICATE_TB_TRONG_FILE (60 records)
**Mô tả:** Nhiều record trong cùng 1 file có cùng `source.reference` (TB-TCHQ)

**Nguyên nhân:**
- Mỗi TB-TCHQ có thể phân loại nhiều mã HS khác nhau (hợp lý)
- Hoặc do merge lỗi từ các gói trước (BUG)

### 3.4. DESC_CHUA_TK (16 records)
**Mô tả:** Description chứa từ khóa 'tờ khai' - vi phạm quy tắc ẩn danh

**Quy tắc:** KHÔNG ghi 'tờ khai số X' trong description (có thể truy ngược DN)

**Mẫu vi phạm (10 records đầu):**
| File | idx | Mô tả |
|---|---|---|
| `legal-customs-2026-10-13-goi-066.json` | #7 | 'tờ khai' trong Nhựa PU |
| `lvn-cu-3.json` | #50 | 'Mục 3 tờ khai HQ' trong Glaze |
| `lvn-cu-2.json` | #60 | 'Phụ lục tờ khai' |
| `legal-customs-2026-10-13-goi-081.json` | #1 | 'tờ khai HQ' trong kính |
| `legal-customs-2026-10-13-goi-080.json` | #0 | 'tờ khai HQ' trong gạch |

## 4. ĐỀ XUẤT XỬ LÝ

### 4.1. Ưu tiên 1: Sửa DESC_CHUA_TK (16 records)
- Loại bỏ 'tờ khai', 'Phụ lục tờ khai' khỏi description
- Giữ nguyên thông tin kỹ thuật (vật liệu, công dụng, thông số)
- Ưu tiên: CAO (vi phạm quy tắc ẩn danh)

### 4.2. Ưu tiên 2: Bổ sung reasonVi (247 records)
- Mỗi record cần reasonVi ≥ 150 ký tự
- Nội dung: trích dẫn nguyên văn từ TB-TCHQ + chỉ ra điểm phân loại
- Có thể tự động từ `technicalSpec` + `productName`

### 4.3. Ưu tiên 3: Rà duplicate hsCode/TB (686 records)
- Với mỗi nhóm trùng, kiểm tra `source.reference` (TB-TCHQ) có khác nhau không
- Nếu khác: hợp lý (1 mã nhiều TB)
- Nếu trùng: merge lỗi, cần xóa duplicate

## 5. SCRIPT TỰ ĐỘNG RÀ BUG

Script Python `ra-bug-community.py` đã được tạo tại `/tmp/`, có thể chạy định kỳ.

## 6. KẾT LUẬN
- 86 file community, 949 bug phát hiện
- Bug nghiêm trọng nhất: `DESC_CHUA_TK` (16 records) - vi phạm ẩn danh
- Bug số lượng nhiều: `DUPLICATE_HS_TRONG_FILE` (626) - cần phân tích thêm
- Đề xuất: Rà lại 16 records DESC_CHUA_TK trước, sau đó xử lý 247 reason ngắn