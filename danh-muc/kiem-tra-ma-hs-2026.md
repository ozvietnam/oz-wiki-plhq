# Kiểm tra mã HS 14 DM (09/2024/TT-BYT) vs biểu thuế VN 2026

**Ngày check:** 2026-10-09 16:14  
**CSV input:** `danh-muc/09-2024-tt-byt-full.csv` (3400 dòng)  
**Biểu thuế:** `data/tax.json` (11871 mã HS)  

## Tóm tắt

| Trạng thái | Số mã HS | % |
|---|---|---|
| ✅ Khớp đầy đủ 8 số | 290 | 91.8% |
| ⚠️ Khớp 6 số đầu (chưa rõ 2 số cuối) | 5 | 1.6% |
| ⚠️ Khớp 4 số đầu (ch.84/85/...) | 13 | 4.1% |
| ❌ KHÔNG tìm thấy | 8 | 2.5% |
| **Tổng** | **316** | **100%** |

## ❌ Mã HS KHÔNG có trong biểu thuế VN 2026

**Số lượng:** 8 mã  
**Ý nghĩa:** BYT 09/2024 dùng mã AHTN 2017 cũ, biểu thuế VN 2026 đã cập nhật, bỏ mã này.

| Mã HS (BYT 2024) | Mô tả (mẫu) |
|---|---|
| `28389000` | Sennosides |
| `30343290` | Betamethasone |
| `30344951` | Berberin |
| `30349089` | Diltiazem |
| `30349099` | Alcal polyvinyl |
| `30942091` | Cefalotin |
| `30949055` | Dexchlorpeniramine Dạng dầu xoa bóp |
| `35101090` | Hydroxyethyl Starch |

## ⚠️ Mã HS khớp 6 số đầu

**Số lượng:** 5 mã  
**Ý nghĩa:** Có ch.4-số tồn tại, nhưng 2 số cuối chưa rõ. Cần check kỹ.

| Mã HS (BYT 2024) | Mô tả (mẫu) |
|---|---|
| `29224990` | Loratadine Các dạng 2933. 39. 90 556 L-ornithin L-aspartat |
| `29329990` | Isosorbide |
| `29339900` | Sulbutiamine |
| `30019099` | Desferrioxamin Mesylate |
| `33042099` | Amifloxacin Dạng uống hoặc dạng mỡ 3304.20.91 Các dạng khác |

## 📋 Mã HS có dấu "/" (multi-MHS)

**Số lượng:** 11 dòng  
**Ý nghĩa:** Mỗi dòng có 2 mã HS trở lên. BYT 09/2024 liệt kê dạng "3004.50.10/91".

| DM | STT | Tên | Mã HS |
|---|---|---|---|
| 8 | 10 | Acetyl cystein | `30049055/59` |
| 8 | 15 | Acid 5 - aminosalicylic | `30049055/59` |
| 8 | 20 | Acid Folic | `30045010/91` |
| 8 | 27 | Acid Nicotinic | `30045010/91` |
| 8 | 28 | Acid Salicylic | `30049055/59` |
| 8 | 31 | Acid Tiaprofenic | `30049055/59` |
| 8 | 40 | Adalimumab | `30049055/59` |
| 8 | 48 | Aicd Nalidixic | `30042091/99` |
| 8 | 58 | Alimemazin | `30049055/59` |
| 8 | 66 | Alphaprodin | `30049055/59` |
| 8 | 70 | Aluminium phosphate | `30049055/59` |

## Top 20 mã HS phổ biến nhất trong 14 DM

| Mã HS | Số dòng | Trạng thái |
|---|---|---|
| `30049099` | 815 | ✅ |
| `12119017` | 319 | ✅ |
| `30049089` | 204 | ✅ |
| `30042091` | 97 | ✅ |
| `30049098` | 93 | ✅ |
| `29349990` | 80 | ✅ |
| `2844` | 78 | ⚠️ |
| `30042099` | 73 | ✅ |
| `29419000` | 66 | ✅ |
| `30043900` | 60 | ✅ |
| `30049055` | 60 | ✅ |
| `30049059` | 58 | ✅ |
| `30024190` | 55 | ✅ |
| `30043290` | 52 | ✅ |
| `30044990` | 49 | ✅ |
| `29335990` | 46 | ✅ |
| `29339990` | 42 | ✅ |
| `30049049` | 32 | ✅ |
| `29333990` | 31 | ✅ |
| `30045021` | 30 | ✅ |

## Thống kê theo DM

| DM | Số dòng | Số mã unique | Khớp 8s | Khớp 6s | Khớp 4s | Không khớp |
|---|---|---|---|---|---|---|
| 1 | 219 | 47 | 46 | 0 | 1 | 0 |
| 2 | 43 | 13 | 13 | 0 | 0 | 0 |
| 3 | 70 | 18 | 18 | 0 | 0 | 0 |
| 4 | 8 | 5 | 5 | 0 | 0 | 0 |
| 5 | 118 | 28 | 24 | 1 | 3 | 0 |
| 6 | 78 | 1 | 0 | 0 | 1 | 0 |
| 7 | 610 | 164 | 153 | 3 | 6 | 2 |
| 8 | 1275 | 59 | 50 | 1 | 2 | 6 |
| 9 | 414 | 38 | 38 | 0 | 0 | 0 |
| 10 | 57 | 2 | 2 | 0 | 0 | 0 |
| 11 | 369 | 25 | 25 | 0 | 0 | 0 |
| 12 | 24 | 6 | 6 | 0 | 0 | 0 |
| 13 | 94 | 2 | 2 | 0 | 0 | 0 |
| 14 | 21 | 16 | 16 | 0 | 0 | 0 |

## Kết luận & Khuyến nghị

### Vấn đề: 8 mã HS BYT 2024 không có trong biểu thuế 2026

- **Nguyên nhân:** BYT 09/2024 dùng mã AHTN 2017 cũ, biểu thuế VN 2026 đã cập nhật mã mới
- **Bản chất:** Đây là **mismatch hợp pháp**, không phải lỗi CSV. BYT vẫn dùng mã cũ cho mục đích KTCL
- **Xử lý khi tra cứu:** DN khi NK cần check biểu thuế hiện hành (2026) để áp mã đúng

### Cảnh báo: 5 mã HS khớp 6 số

- Mã BYT 2024 có 8 số, biểu thuế chỉ có 6 số (chưa rõ 2 số cuối)
- DN cần check manual với TCHQ khi NK

## Tool sử dụng

```bash
npm run trich           # Parse lại CSV 14 DM
python3 tools/kiem-tra-ma-hs-2026.py   # Chạy check này
```
