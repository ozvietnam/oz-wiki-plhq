# 3 loại TB-TCHQ — phân biệt & parse

TB-TCHQ có 3 dạng heading chính. Mỗi loại cần anchor riêng, dễ nhầm nếu chỉ tìm "Kết quả..." (lowercase) — heading in hoa là duy nhất đáng tin.

## 1. KET_QUA_PHAN_LOAI — "VỀ KẾT QUẢ PHÂN LOẠI"

- Anchor: dòng `Kết quả phân loại: <mô tả>. thuộc nhóm X.YY "nguyên tắc" ...`
- Tách tại `\.?\s*thuộc\s+nhóm\s+` → phần trước = description, phần sau = reason
- Bỏ prefix `Tên gọi theo cấu tạo, công dụng:` ở description
- Ví dụ:
  ```
  Kết quả phân loại: chế phẩm có chứa triethanolamine, oxiran và phụ gia, dạng lỏng. thuộc nhóm 38.24 "Chất gắn đã điều chế..."
  ```
  → desc = "chế phẩm có chứa triethanolamine, oxiran và phụ gia, dạng lỏng."
  → reason = "thuộc nhóm 38.24 \"Chất gắn đã điều chế...\""

## 2. XAC_DINH_TRUOC — "VỀ KẾT QUẢ XÁC ĐỊNH TRƯỚC"

- Có **2 lần** liệt kê "Tên thương mại" / "Tên gọi theo cấu tạo":
  - Lần 1: trong "Hàng hóa đề nghị xác định trước mã số do tổ chức, cá nhân cung cấp:" — doanh nghiệp tự khai
  - Lần 2: trong "Kết quả xác định trước mã số:" — hải quan phân loại
- **LẤY LẦN 2** (sau anchor "Kết quả xác định trước mã số:")
- Format description: `"TM: <tên TM lần 2> | Tên gọi: <tên gọi lần 2>"`
- Cắt mỗi phần ~100–200 ký tự để tránh tràn
- Ví dụ:
  ```
  Kết quả xác định trước mã số:
  Tên thương mại: CARRYALL 500 (ELECTRICAL UTILITY VEHICLE)
  Tên gọi theo cấu tạo, công dụng: Xe chở hàng 4 bánh hiệu Club Car...
  ```
  → desc = "TM: CARRYALL 500 (ELECTRICAL UTILITY VEHICLE) | Tên gọi: Xe chở hàng 4 bánh hiệu Club Car..."

## 3. DINH_CHINH — "VỀ SỬA ĐỔI, THAY THẾ THÔNG BÁO"

- Anchor: dòng `Sửa đổi Thông báo ... số <OLD>/TB-TCHQ ...` (TB cũ bị thay thế)
- Body chính nằm ở "Kết quả xác định trước mã số:" (giống XAC_DINH_TRUOC)
- **Quy ước**: đổi `so_hieu` thành số hiệu TB MỚI (xuất hiện trong "Số:") để tool đóng gói match được
- `confusedWith` = list các TB cũ bị thay thế
- Ví dụ thực: 4967/TB-TCHQ/2026 trong manifest, nhưng body thực chất là TB-CHQ 23956/2025 sửa TB-TCHQ 4967/2024
  - `so_hieu` → "23956/TB-CHQ/2025"
  - `confusedWith` → ["4967/TB-TCHQ/2024"]
  - `loai` → "DINH_CHINH"

## Pitfall: anchor lowercase "kết quả..."

- Một trang TB-TCHQ có thể chứa "kết quả" lowercase **3–5 lần**: tiêu đề trang, footer link sang TB khác, tóm tắt phụ lục
- Chỉ dùng heading **IN HOA** (`VỀ KẾT QUẢ ...`) làm anchor body
- Cũng không dùng `Kết quả phân loại` (lowercase K) — đó là caption trang, không phải body
- Dấu hai chấm `Kết quả phân loại:` (có `:`) là anchor ổn định nhất ở bên trong body sau khi đã cắt bằng heading
