# Phân tích văn bản nền tảng Hải quan & Luồng nạp wiki

**Ngày:** 2026-10-09
**Tác giả:** Hermes
**Repo:** oz-wiki-plhq (registry/van-ban)

---

## 1. Tổng quan sổ đăng ký

- **Tổng văn bản:** 213
- **Theo loại:** 106 Thông tư, 51 Quyết định, 36 Nghị định, 15 Luật, 3 Nghị quyết, 2 khác
- **Theo cơ quan:** 55 BCT, 38 CP, 16 BYT, 16 QH, 15 BTTTT, 15 BTC, 9 BKHCN, 9 TTg, 8 BNNPTNT...
- **Theo trạng thái:** 113 còn hiệu lực, 37 hết hiệu lực, 51 chưa xác minh, 7 hết 1 phần, 4 chưa có hiệu lực, 1 tạm ngưng
- **Theo năm:** 42 (2026), 27 (2018), 25 (2025), 14 (2024), 13 (2023), 13 (2021), 10 (2022)...
- **Văn bản Hải quan (có gắn nhãn `hai-quan/*`):** **20 / 213** (9.4%)

---

## 2. Trục "Luật Hải quan" - văn bản nền tảng

### 2.1. Đã có (20 VB)

| # | Số hiệu | Tên | Năm | Trạng thái | Nhánh |
|---|---|---|---|---|---|
| 1 | 54/2014/QH13 | Luật Hải quan (gốc) | 2014 | Còn HL | hai-quan/luat-khung |
| 2 | 54/VBHN-VPQH 2026 | VBHN Luật Hải quan | 2026 | Còn HL | hai-quan/luat-khung |
| 3 | 11/2026/QH16 | Luật sửa đổi, bổ sung LHQ | 2026 | Chưa HL | hai-quan/luat-khung |
| 4 | 08/2015/NĐ-CP | Hướng dẫn LHQ (TT, KT) | 2015 | Còn HL | hai-quan/luat-khung + kiem-tra-giam-sat |
| 5 | 59/2018/NĐ-CP | Sửa 08/2015 | 2018 | Còn HL | hai-quan/luat-khung |
| 6 | 85/2019/NĐ-CP | Cơ chế một cửa | 2019 | Còn HL | hai-quan/mot-cua |
| 7 | 336/2026/NĐ-CP | Một cửa 2026 | 2026 | Chưa HL | hai-quan/mot-cua |
| 8 | 38/2015/TT-BTC | Thủ tục HQ, KT, GS | 2015 | Còn HL | hai-quan/thu-tuc |
| 9 | 39/2018/TT-BTC | Sửa 38/2015 | 2018 | Còn HL | hai-quan/thu-tuc |
| 10 | 121/2025/TT-BTC | Sửa (chưa rõ) | 2025 | Còn HL | hai-quan/thu-tuc |
| 11 | 142/2026/TT-BTC | Sửa các TT thủ tục | 2026 | Chưa HL | hai-quan/thu-tuc |
| 12 | 39/2015/TT-BTC | Trị giá HQ | 2015 | Còn HL | hai-quan/tri-gia |
| 13 | 60/2019/TT-BTC | Sửa 39/2015 | 2019 | Còn HL | hai-quan/tri-gia |
| 14 | 06/2026/TT-BTC | Sửa 13/2015 (KT) | 2026 | Còn HL | hai-quan/kiem-tra-giam-sat |
| 15 | 128/2026/TT-BTC | KT, GS, QL HQ | 2026 | Chưa HL | hai-quan/kiem-tra-giam-sat |
| 16 | 13/2015/TT-BTC | Kiểm tra, giám sát | 2015 | ? | (chưa gắn nhãn `hai-quan`) |
| 17 | 1921/QĐ-TCHQ | Quy trình phân loại, áp thuế | 2018 | Chưa XMINH | hai-quan/so-tay-nghiep-vu |
| 18 | 1357/QĐ-TCHQ | Bảng mã loại hình XNK | 2021 | Còn HL | hai-quan/loai-hinh |
| 19 | 23/2019/QĐ-TTg | DS NK thủ tục HQ | 2019 | HẾT HL | hai-quan/thu-tuc |
| 20 | 31/2026/QĐ-TTg | DS NK thủ tục HQ (mới) | 2026 | Còn HL | hai-quan/thu-tuc |

### 2.2. Khoảng trống cốt lõi cần nạp ngay

**Ưu tiên P0 (CỐT LÕI - ảnh hưởng trực tiếp đến thủ tục):**

1. ✅ **13/2015/TT-BTC** - Kiểm tra, giám sát HQ (TT gốc) - **ĐÃ CÓ** nhưng gắn nhãn `chua-phan-loai`
2. ✅ **14/2015/TT-BTC** - Phân loại hàng, phân tích - **ĐÃ CÓ** gắn nhãn `phan-loai-hs`
3. ❌ **05/2015/TT-BTC** - Phân loại HS, áp mức thuế (CORE) - **THIẾU**
4. ❌ **17/2015/TT-BTC** - Phân luồng tờ khai (CORE) - **THIẾU** (số hiệu chưa xác minh)
5. ❌ **100/2014/QĐ-TTg** - Quy chế phân loại hàng - **THIẾU**

**Ưu tiên P1 (CẦN THIẾT):**

6. ❌ **19/2019/TT-BTC** - Quy định NSW (Cổng thông tin một cửa) - **THIẾU**
7. ❌ **33/2018/NĐ-CP** - Cơ chế một cửa quốc gia - **THIẾU**
8. ❌ **06/2019/QĐ-TCHQ** - Mẫu chứng từ VNACCS - **THIẾU**
9. ✅ **15/2018/NĐ-CP** (?) - KTCL an toàn thực phẩm - **ĐÃ CÓ** (nhưng nhánh `an-toan-thuc-pham` không phải HQ)
10. ❌ **11/2021/QĐ-TTg** (?) - Kiểm tra, giám sát chuyên ngành - **THIẾU**
11. ❌ **31/2018/NĐ-CP** (?) - Quy định C/O - **THIẾU**

**Ưu tiên P2 (BỔ SUNG):**

12. ❌ **04/2017/TT-BTC** - Kho ngoại quan - **THIẾU**
13. ❌ **47/2017/NĐ-CP** - Kho bãi HQ - **THIẾU**
14. ❌ **78/2014/NĐ-CP** - Vận chuyển hàng hóa - **THIẾU**
15. ❌ **125/2014/NĐ-CP** - Đại lý HQ - **THIẾU**
16. ❌ **35/2017/NĐ-CP** - Khu chế xuất - **THIẾU**
17. ✅ **02/2018/TT-BCT** - C/O form E (ACFTA) - **ĐÃ CÓ** (nhưng gắn `chua-phan-loai`)
18. ❌ **09/2018/NĐ-CP** - Quy định chi tiết về KD XNK - **THIẾU**
19. ✅ **69/2018/NĐ-CP** - KD XNK qua biên giới - **ĐÃ CÓ** (nhánh `quan-ly-ngoai-thuong/luat-khung`)

---

## 3. Đề xuất luồng nạp wiki

### 3.1. Nguyên tắc

> **Đi từ "Luật khung" → "Nghị định hướng dẫn" → "Thông tư chuyên ngành" → "Quyết định cụ thể"**
>
> Mỗi VB khi nạp phải xác minh **NGUON_A** (vanban.chinhphu.vn) + đọc toàn văn + gắn `quan_he.{huong_dan, sua_doi, thay_the}`.

### 3.2. Luồng 4 bước (theo skill `lumi-ingest`)

```
Bước 1: NẠP YAML (registry/van-ban/{so-hieu}.yaml)
   ↓
Bước 2: TẠO SOURCE (wiki/sources/{so-hieu}.md) - schema LuminaWiki
   ↓
Bước 3: LIÊN KẾT CHÉO (edges/{so-hieu}.yaml + wikilink [[path|text]])
   ↓
Bước 4: TỔNG HỢP (wiki/summary/...) - cập nhật các summary liên quan
```

### 3.3. Thứ tự nạp đề xuất (4 PR)

**PR #1: "Core LHQ 2026" (P0)**
- Gắn nhãn `hai-quan/kiem-tra-giam-sat` cho 13/2015/TT-BTC
- Nạp 05/2015/TT-BTC (phân loại HS, áp thuế) ← CORE THIẾU
- Nạp 17/2015/TT-BTC (phân luồng tờ khai) ← CORE THIẾU
- Nạp 100/2014/QĐ-TTg (quy chế phân loại) ← THIẾU
- Liên kết 4 VB này với 54/VBHN-VPQH + 11/2026/QH16 + 06/2026/TT-BTC

**PR #2: "Một cửa quốc gia 2026" (P1)**
- Nạp 19/2019/TT-BTC (NSW) ← THIẾU
- Nạp 33/2018/NĐ-CP (cơ chế một cửa) ← THIẾU
- Liên kết với 85/2019/NĐ-CP + 336/2026/NĐ-CP

**PR #3: "Chứng từ & Tờ khai VNACCS" (P1)**
- Nạp 06/2019/QĐ-TCHQ (mẫu chứng từ VNACCS) ← THIẾU
- Cập nhật `wiki/summary/thu-tuc-hai-quan-day-du.md` (nếu có)

**PR #4: "Kho bãi + Vận chuyển + Khu chế xuất" (P2)**
- 04/2017/TT-BTC, 47/2017/NĐ-CP, 78/2014/NĐ-CP, 125/2014/NĐ-CP, 35/2017/NĐ-CP
- 09/2018/NĐ-CP (quy định KD XNK)
- Gắn lại nhãn 02/2018/TT-BCT (`xuat-xu-fta` thay vì `chua-phan-loai`)

### 3.4. Công cụ hỗ trợ

- `tools/kiem-tra.mjs` - validate sổ
- `tools/them-van-ban.mjs` - thêm VB mới
- `tools/san-hieu-luc.mjs` - check hiệu lực
- `_lumina/scripts/lint.mjs` - validate wiki
- Skill `lumi-ingest` (5 bước: tạo source → tạo concept → tạo summary → tạo reading-note → liên kết chéo)

---

## 4. Hành động tiếp

- [ ] Xác minh 13/2015/TT-BTC đã có trong sổ chưa (grep registry)
- [ ] Mở 5 issues mới cho 5 VB P0/P1 trên GitHub
- [ ] Tạo PR #1: Core LHQ 2026
- [ ] Tạo PR #2: Một cửa quốc gia 2026
- [ ] Cập nhật báo cáo điểm mù
