# BÁO CÁO KIỂM CHỨNG CỘT CS TRONG BIỂU THUẾ

Ngày: 2026-10-15  
Nguồn: `hs-code-api/data/tax.json` (cột `cs`) + `oz-wiki-plhq/dist/hs-index-theo-ma.json`  
Người kiểm: Hermes (Sếp Thắng)  

## 1. Tổng quan

| Hạng mục | Giá trị |
|---|---|
| Tổng mã HS trong tax.json | 11.871 |
| Tổng mã HS có cột `cs` (chính sách) | 7.928 (66.8%) |
| Số VB nhắc trong cột `cs` | 26 |
| Tổng cạnh trong oz-wiki | 9.900 |
| Số VB có cạnh trong oz-wiki | 24 |

## 2. Top 10 VB nhắc nhiều trong cột cs (theo số mã HS)

| Văn bản | Số mã HS |
|---|---|
| 42/2019/TT-BCT | 3779 |
| 08/2023/TT-BCT | 3583 |
| 12/2022/TT-BGTVT | 2183 |
| 33/2025/TT-BCT | 2015 |
| 01/2024/TT-BNNPTNT | 2006 |
| 34/2025/TT-BCT | 1764 |
| 62/2024/TT-BGTVT | 1315 |
| 09/2024/TT-BYT | 510 |
| 17/2023/TT-BNNPTNT | 340 |
| 15/2024/TT-BYT | 186 |

## 3. So sánh giữa 2 nguồn (tax.cs vs cạnh oz-wiki)

| Văn bản | tax.cs | cạnh | Chung | Chỉ tax | Chỉ cạnh |
|---|---|---|---|---|---|
| 42/2019/TT-BCT | 3316 | 0 | 0 | 3316 | 0 |
| 01/2024/TT-BNNPTNT | 1468 | 2102 | 1312 | 156 | 790 |
| 08/2023/TT-BCT | 1964 | 314 | 146 | 1818 | 168 |
| 33/2025/TT-BCT | 2015 | 0 | 0 | 2015 | 0 |
| 34/2025/TT-BCT | 1764 | 79 | 29 | 1735 | 50 |
| 765/QĐ-BCT | 0 | 1374 | 0 | 0 | 1374 |
| 12/2022/TT-BGTVT | 1315 | 0 | 0 | 1315 | 0 |
| 62/2024/TT-BGTVT | 1315 | 0 | 0 | 1315 | 0 |
| 33/2026/TT-BCT | 0 | 920 | 0 | 0 | 920 |
| 23/2019/QĐ-TTg | 749 | 0 | 0 | 749 | 0 |
| 113/2017/NĐ-CP | 667 | 0 | 0 | 667 | 0 |
| 09/2024/TT-BYT | 384 | 333 | 303 | 81 | 30 |
| 28/2026/TT-BCT | 0 | 378 | 0 | 0 | 378 |
| 17/2023/TT-BNNPTNT | 340 | 18 | 18 | 322 | 0 |
| 27/2026/TT-BNNMT | 0 | 340 | 0 | 0 | 340 |
| 82/2022/NĐ-CP | 258 | 0 | 0 | 258 | 0 |
| 36/2026/TT-BKHCN | 0 | 253 | 0 | 0 | 253 |
| 11/2018/TT-BTTTT | 186 | 39 | 26 | 160 | 13 |
| 15/2024/TT-BYT | 186 | 188 | 186 | 0 | 2 |
| 01/2021/TT-BLĐTBXH | 123 | 0 | 0 | 123 | 0 |

## 4. Tổng kết mã 8 số

| Loại | Số lượng |
|---|---|
| Mã 8 số unique trong tax.cs | 7375 |
| Mã 8 số unique trong cạnh | 4251 |
| Chung | 3413 |
| **Chỉ có trong tax (thiếu trong wiki)** | **3962** |
| Chỉ có trong cạnh (có thể là mã nhóm 4/6 số) | 838 |

## 5. Bug phát hiện

### Bug 1: VB chỉ có trong tax.cs, KHÔNG có cạnh trong oz-wiki (6 VB)

Đây là các văn bản được nhắc trong cột `cs` của biểu thuế nhưng chưa được trích vào oz-wiki:

| Văn bản | Số mã trong tax | Loại VB |
|---|---|---|
| 42/2019/TT-BCT | 3316 | Sửa đổi, bổ sung (về báo cáo) — không phải DM hàng |
| 33/2025/TT-BCT | 2015 | Sửa đổi 01/2018/TT-BCT — DM HH cửa khẩu phụ, lối mở biên giới |
| 12/2022/TT-BGTVT | 1315 | DM hàng hóa có khả năng gây mất an toàn (Bộ GTVT) |
| 62/2024/TT-BGTVT | 1315 | Sửa đổi 12/2022/TT-BGTVT |
| 23/2019/QĐ-TTg | 749 | QĐ Thủ tướng — DM phế liệu NK |
| 01/2021/TT-BLĐTBXH | 123 | DM hàng hóa cấm XK và ĐK XK |

### Bug 2: VB có trong cả tax và wiki nhưng lệch lớn

| Văn bản | tax.cs | cạnh | Chỉ tax (thiếu) | Ghi chú |
|---|---|---|---|---|
| 08/2023/TT-BCT | 1964 | 314 | 1818 | DM gạo XK — wiki chỉ có 314/1964 mã (16%) |
| 34/2025/TT-BCT | 1764 | 79 | 1735 | Sửa đổi — wiki chỉ có 79/1764 mã (4.5%) |
| 17/2023/TT-BNNPTNT | 340 | 18 | 322 | DM CITES — wiki chỉ có 18/340 mã (5%) |
| 11/2018/TT-BTTTT | 186 | 39 | 160 | DM thiết bị viễn thông — wiki chỉ có 39/186 (21%) |
| 01/2024/TT-BNNPTNT | 1468 | 2102 | 156 | Mới hơn (2026-10) thêm 156 mã 8 số, wiki CSV cũ chưa cập nhật |

### Bug 3: VB có cạnh nhưng KHÔNG có trong tax.cs

Các văn bản mới (ban hành 2026) chưa được cập nhật vào tax.json:

| Văn bản | Cạnh | Ghi chú |
|---|---|---|
| 765/QĐ-BCT | 1374 | QĐ-BCT — QĐ không phải TT, regex tax không match |
| 33/2026/TT-BCT | 920 | VB mới 2026, chưa cập nhật tax.cs |
| 28/2026/TT-BCT | 378 | VB mới 2026 |
| 27/2026/TT-BNNMT | 340 | VB mới 2026 |
| 36/2026/TT-BKHCN | 253 | VB mới 2026 |
| 19/2024/TT-BYT | 112 | VB mới 2024 |
| 41/2026/TT-BXD | 79 | VB mới 2026 |
| 49/2026/TT-BXD | 64 | VB mới 2026 |

## 6. Nguyên nhân gốc

1. **Nghị định (NĐ-CP) chưa được trích**: 113/2017/NĐ-CP (444 mã), 82/2022/NĐ-CP (170 mã), 69/2018/NĐ-CP (16 mã) — đây là các NĐ về KTCL hóa chất, kiểm dịch, chưa có cạnh trong oz-wiki.
2. **VB sửa đổi (TT-BCT, TT-BGTVT) chưa cập nhật**: 12/2022 → 62/2024 (BGTVT), 01/2018 → 33/2025/TT-BCT, 42/2019/TT-BCT.
3. **CSV/wiki dùng biểu thuế cũ**: 01/2024/TT-BNNPTNT thiếu 156 mã 8 số mới trong EN2022.
4. **VB mới 2026 chưa cập nhật tax.cs**: 28/2026, 27/2026, 33/2026, 19/2024, 41/2026, 49/2026.
5. **Format QĐ không match**: 765/QĐ-BCT có 1374 cạnh nhưng tax.cs regex chỉ match `TT-XXX`.

## 7. Khuyến nghị xử lý

- **Ưu tiên 1**: Trích 6 VB thiếu (12/2022/TT-BGTVT, 33/2025/TT-BCT, 23/2019/QĐ-TTg, 113/2017/NĐ-CP, 82/2022/NĐ-CP) → dựng cạnh từ PDF/DM.
- **Ưu tiên 2**: Cập nhật 01/2024/TT-BNNPTNT CSV với 156 mã mới (EN2022).
- **Ưu tiên 3**: Cập nhật tax.cs cho các VB mới 2026.
- **Ưu tiên 4**: Sửa regex tax.cs để nhận diện QĐ-XXX (không chỉ TT-XXX).