# Dữ liệu TB-TCHQ từ tracuuhs.com/ket-qua-phan-loai
**Ngày crawl:** 2026-10-10
**Nguồn:** https://tracuuhs.com/ket-qua-phan-loai (HSTC - Công cụ tra cứu HS Code)
**Người crawl:** Hermes
**Loại dữ liệu:** TB-TCHQ kết quả phân loại (đã phân nhóm theo nhóm HS)

## 1. Tổng quan
- Tổng: **2.304 TB-TCHQ** (unique)
- 405 nhóm HS (Ch.02-Ch.96, mỗi nhóm có 1-314 TB)
- Trang web gốc hiển thị 2.466 records (số hiện tại có thể đã thay đổi)

## 2. Phân bổ theo năm ban hành
| Năm | Số TB |
|-----|-------|
| 2018 | 800 |
| 2019 | 507 |
| 2020 | 289 |
| 2021 | 51 |
| 2022 | 192 |
| 2023 | 191 |
| 2024 | 218 |
| 2025 | 49 |
| 2026 | 7 |

## 3. Top 10 chương có nhiều TB nhất
| Chương | Số TB |
|--------|-------|
| Ch.72 | 172 |
| Ch.29 | 161 |
| Ch.85 | 155 |
| Ch.39 | 142 |
| Ch.38 | 70 |
| Ch.21 | 61 |
| Ch.28 | 55 |
| Ch.33 | 53 |
| Ch.32 | 47 |
| Ch.84 | 46 |

## 4. Top 15 nhóm HS có nhiều TB nhất
| Nhóm | Số TB |
|------|-------|
| 38.24 | 314 |
| 21.06 | 92 |
| 34.02 | 54 |
| 30.04 | 53 |
| 22.02 | 44 |
| 85.44 | 39 |
| 19.01 | 37 |
| 27.10 | 34 |
| 39.26 | 34 |
| 54.07 | 34 |
| 32.08 | 31 |
| 85.17 | 31 |
| 39.20 | 29 |
| 72.10 | 27 |
| 19.05 | 24 |

## 5. Schema mỗi record
```json
{
  "so_hieu": "503/TB-TCHQ/2018",
  "nhom_hs": "02.06",
  "ten_nhom": "Phụ phẩm ăn được sau giết mổ của lợn...",
  "mo_ta_chung": "Phụ phẩm ăn được sau giết mổ của lợn...",
  "ten_hang_rieng": "mặt hàng frozen pork softbone"
}
```

## 6. So sánh với kho TB-TCHQ hs-code-api
- Kho hs-code-api: 2.266 unique số hiệu
- tracuuhs.com: 2.035 unique số hiệu (unique theo `XXX/TB-TCHQ`, không phân biệt năm)
- **Overlap (cả 2 cùng có): 1.408 (69.2%)**
- **tracuuhs CHƯA có trong kho: 627 (30.8%)**
- **Kho có mà tracuuhs KHÔNG có: 858** (kho có nguồn khác như customs.gov.vn, TVPL, caselaw.vn)

### Phân bổ 627 TB chưa có theo năm
| Năm | Số |
|-----|-----|
| 2024 | 208 |
| 2023 | 161 |
| 2018 | 152 |
| 2022 | 100 |
| 2019 | 65 |
| 2020 | 24 |
| 2025 | 19 |
| 2021 | 8 |
| 2026 | 3 |

### Top chương có nhiều TB chưa có
| Chương | Số |
|--------|-----|
| Ch.85 (Máy điện, thiết bị điện) | 124 |
| Ch.38 (Chế phẩm hóa chất) | 89 |
| Ch.39 (Plastic) | 67 |
| Ch.72 (Sắt thép) | 40 |
| Ch.30 (Dược phẩm) | 39 |
| Ch.21 (Chế phẩm ăn được) | 37 |

## 7. Ưu điểm của nguồn tracuuhs.com
1. **Đã phân nhóm sẵn** theo Chương HS (97 chương) → dễ truy xuất
2. **Có 405 nhóm HS** với tên đầy đủ tiếng Việt
3. **URL pattern đơn giản**: `/tin-tuc/tchq-{so}/{nam}` (vd `/tin-tuc/tchq-7116-2018`)
4. **Nội dung trang chi tiết** có: số TB, năm, loại VB, mã HS, toàn văn
5. **Crawl từ React SPA** - 1 lần load được full text, không cần nhiều request

## 8. Hạn chế
1. **Chỉ có số hiệu + mô tả chung** - KHÔNG có mã HS 8 số kết luận
2. **Cần mở từng trang chi tiết** để lấy mã HS, ngày BH, nội dung đầy đủ
3. **Không có PDF gốc** - chỉ HTML

## 9. Khuyến nghị
1. Đối chiếu với kho hs-code-api → tìm TB mới cần crawl
2. Crawl trang chi tiết (`/tin-tuc/tchq-{so}/{nam}`) cho mỗi TB chưa có trong kho
3. Lưu vào file `tracuuhs-ket-qua-phan-loai-2026-10-10.json` cùng format với các file TB-TCHQ khác
