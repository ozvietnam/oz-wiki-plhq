---
id: 27-2026-tt-bnnmt
title: "TT 27/2026/TT-BNNMT: KTCL Bộ Nông nghiệp & Môi trường"
type: source
created: 2026-10-09
updated: 2026-10-09
authors:
  - BNNMT
year: 2026
source_type: phap-ly
importance: 5
provenance: replayable
confidence: high
tags:
  - bnnmt
  - kiem-tra-chuyen-nganh
  - rui-ro-cao
  - rui-ro-trung-binh
  - thuoc-bvtv
  - phan-bon
  - thuc-an-chan-nuoi
  - giong-cay-trong
raw_paths:
  - raw/download/congbaocdn.chinhphu.vn/27-2026-tt-bnnmt.pdf
related_concepts:
  - ktcl-bnnmt-2026
  - rui-ro-cao-vs-trung-binh
---

## Summary

**Thông tư 27/2026/TT-BNNMT** ngày 30/6/2026, hiệu lực từ **01/7/2026** - Ban hành Danh mục sản phẩm, hàng hóa có **mức độ rủi ro trung bình, cao** thuộc trách nhiệm quản lý của **Bộ Nông nghiệp và Môi trường (BNNMT)**.

**Cấu trúc:** 8 Điều + 2 Phụ lục + **487 mã HS** (đã có CSV chi tiết).

## Key claims

### Phụ lục I - Rủi ro TRUNG BÌNH (466 mã - công bố hợp quy)

**8 nhóm chính:**
1. **Giống cây trồng** (lúa, ngô, đậu...) - 2 mã
2. **Phân bón** (Ch.31: N, P, K, NPK, hữu cơ) - 33 mã
3. **Thức ăn chăn nuôi** (Ch.23: lợn, gia cầm, thú cưng) - 230+ mã
4. **Thuốc thú y** (Ch.30) - 54 mã
5. **Hóa chất, chế phẩm sinh học** (Ch.29, 38) - ~50 mã
6. **Thức ăn thủy sản + sản phẩm xử lý môi trường nuôi trồng thủy sản** - ~100 mã
7. **Keo dán gỗ** - 1-2 mã
8. **Máy, thiết bị nông nghiệp** (Ch.84) - 5 mã

### Phụ lục II - Rủi ro CAO (21 mã - kiểm tra 100% + GCNCL)

**Toàn bộ Ch.38.08 - THUỐC BẢO VỆ THỰC VẬT (BVTV):**
- 3808.91 - Thuốc trừ sâu
- 3808.92 - Thuốc diệt nấm
- 3808.93 - Thuốc diệt cỏ
- 3808.94 - Thuốc khử trùng
- 3808.99 - Thuốc khác

## Evidence

- **PDF Công báo số 411/Ngày 18-7-2026** (đã đọc toàn văn)
- `danh-muc/27-2026-tt-bnnmt.csv` (487 mã HS với cột `muc_rui_ro`, `nhom`, `phu_luc`)
- Căn cứ: **NĐ 37/2026/NĐ-CP**, **Luật Chất lượng SP/HH**, **Luật Trồng trọt**, **Luật Chăn nuôi**, **Luật BVTV 2018**

## Cầu nối hs-code-api

```bash
curl 'https://hs-kb.uythacnhapkhau.com/api/dataset?resource=ktcn_regime'
# → lists[27/2026/TT-BNNMT]:
#   - scopeVi: "Giống, phân bón, thức ăn chăn nuôi, thuốc BVTV (Ch.38.08)"
#   - replaces: ["03/2024/TT-BNNPTNT", "01/2024/TT-BNNPTNT"]
```

**Chồng lấn với:**
- **TT 36/2026/TT-BKHCN** - Pin Lithium, thiết bị điện tử
- **NĐ 26/2026/NĐ-CP** - Hóa chất nguy hiểm (Ch.29)

## Related concepts

- [[concepts/ktcl-bnnmt-2026]] — tổng quan
- [[concepts/thuoc-bvtv-nhap-khau]] — thuốc BVTV (PL II)
- [[concepts/phan-bon-nhap-khau]] — phân bón (PL I)

## Related sources

- **TT 03/2024/TT-BNNPTNT** - VB bị thay (bãi 1 phần)
- **TT 01/2024/TT-BNNPTNT** - VB bị thay (bãi 1 phần)
- [[sources/27-2026-tt-bnnmt-pl2]] - PL II (rủi ro cao - thuốc BVTV)
- [[sources/27-2026-tt-bnnmt-pl1]] - PL I (rủi ro trung bình)

## Notes

- **VB cực kỳ quan trọng** cho DN XNK nông sản, thuốc BVTV, phân bón
- 21 mã PL II (thuốc BVTV) = **phải có GCNCL BNNMT trước thông quan**
- 466 mã PL I = công bố hợp quy
- Chưa bao gồm kiểm dịch thực vật (theo ghi chú trong YAML)
- Cơ quan: Cục Bảo vệ thực vật (BVTV), Cục Trồng trọt, Cục Chăn nuôi
