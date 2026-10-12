---
id: kiem-tra-chuyen-nganh
title: "Kiểm tra chuyên ngành (KTCL) — khung 3 mức rủi ro từ 01/7/2026"
type: concept
created: 2026-10-12
updated: 2026-10-12
key_sources:
  - 37-2026-nd-cp
  - 19-2024-tt-byt
  - 24-2026-tt-byt
  - 27-2026-tt-byt
  - 28-2026-tt-byt
  - 1725-qd-bct
related_concepts:
  - ktcl-byt-attp-2024
  - ktcl-bnnmt-2026
  - ktcl-bct-2026
  - ktcl-bkhcn-2026
  - ktcl-bnv-2026
  - ktcl-bca-2026
  - ktcl-bxd-vlxd-2026
  - muc-do-rui-ro-hang-hoa
confidence: high
tags: [ktcl, kiem-tra-chuyen-nganh, nhom-hang, rui-ro, an-toan-thuc-pham, attp, vat-tu-y-te, thuoc-bvtv, hoa-chat, khoi-luong-thai]
---

## Định nghĩa

**Kiểm tra chuyên ngành (KTCL)** là thủ tục nhà nước kiểm tra chất lượng, an toàn thực phẩm, kiểm dịch động thực vật, kiểm dịch y tế... đối với hàng hóa XNK, do các bộ quản lý ngành thực hiện (không phải hải quan).

Từ **01/7/2026**, khung 3 mức rủi ro theo **NĐ 37/2026/NĐ-CP** thay thế cho cơ chế "tất cả đều phải KTCL" trước đó:
- **Mức 1 (thấp)**: miễn kiểm tra
- **Mức 2 (vừa)**: kiểm tra giảm (giám sát)
- **Mức 3 (cao)**: kiểm tra chặt (lấy mẫu, thử nghiệm)

Mỗi bộ có danh mục hàng riêng kèm mã HS (gọi là "danh mục KTCL" hay "danh mục thiết bị y tế", v.v.).

## Bộ quản lý chuyên ngành (8 bộ)

| Bộ | Mảng | VB chính | Ký hiệu nhanh |
|---|---|---|---|
| **BYT** | Thực phẩm, mỹ phẩm, dược phẩm, thiết bị y tế, vắc xin | 15/2024, 19/2024, 24/2026, 27/2026, 28/2026 | `kiem-tra-chuyen-nganh/byt` |
| **BCT** | Hiệu suất năng lượng, dán nhãn, hàng cắt giảm KTCL | 1725/QĐ, 765/QĐ | `kiem-tra-chuyen-nganh/bct` |
| **BKHCN** | Sản phẩm nhóm 2 (chất lượng) | 2711/QĐ | `kiem-tra-chuyen-nganh/bkhcn` |
| **BNNMT** | Kiểm dịch động thực vật, ATVSTP nông sản, thuốc BVTV | 01/2024, 04/2025, 1182/QĐ | `kiem-tra-chuyen-nganh/bnnmt` |
| **BCA** | Pháo hoa, chất nổ, vũ khí, vật liệu nổ | 125/2021/TT-BCA | `kiem-tra-chuyen-nganh/bca` |
| **BVHTTDL** | Hàng văn hóa, di sản, tạp chí | (riêng) | `kiem-tra-chuyen-nganh/bvhttdl` |
| **BNV** | Thiết bị giám sát hành chính | (riêng) | `kiem-tra-chuyen-nganh/bnv` |
| **BXD** | Vật liệu xây dựng | (riêng) | `kiem-tra-chuyen-nganh/bxd` |

## Quy trình chung (theo NĐ 37/2026)

### Bước 1: Kiểm tra mã HS có trong DM KTCL không
- Mỗi bộ công bố DM riêng (kèm mã HS 8 số).
- Mã HS trong DM = bắt buộc KTCL; ngoài DM = miễn (mức 1).

### Bước 2: Xác định mức rủi ro
- NĐ 37/2026 quy định tiêu chí: nguồn gốc xuất xứ, lịch sử tuân thủ của DN, loại sản phẩm.
- Mức 1: miễn kiểm tra (chỉ giám sát HQ).
- Mức 2: kiểm tra giảm (giám sát + tự công bố).
- Mức 3: kiểm tra chặt (lấy mẫu, thử nghiệm, chờ kết quả).

### Bước 3: Chuẩn bị hồ sơ
- Hợp đồng mua bán + invoice + packing list
- Giấy chứng nhận chất lượng (CQ) của NSX
- Kết quả thử nghiệm (mẫu đại diện)
- MSDS (cho hóa chất), nhãn gốc

### Bước 4: Nộp hồ sơ + chờ kết quả
- Online: Cổng thông tin một cửa quốc gia (NĐ 33/2018).
- Thời gian: 3-7 ngày làm việc (mức 2), 7-15 ngày (mức 3).

### Bước 5: Thông quan
- HQ cho thông quan khi có "Giấy chứng nhận KTCL" hoặc "Thông báo miễn kiểm" từ bộ quản lý.

## Thay đổi từ 01/7/2026 (NĐ 37/2026)

| Trước 01/7/2026 | Từ 01/7/2026 |
|---|---|
| Một danh mục KTCL duy nhất (gộp tất cả hàng) | Mỗi bộ có DM riêng theo mảng |
| KTCL 100% hàng hóa trong DM | KTCL theo mức rủi ro (1-3) |
| Hồ sơ giấy, thủ tục kéo dài | Online qua Cổng một cửa quốc gia |
| 1 VB DM cho tất cả | ~8 DM riêng, mỗi DM ~1-2 trăm mã HS |

## Key sources

- [[sources/37-2026-nd-cp]] — Khung KTCL 2026
- [[sources/19-2024-tt-byt]] — DM thiết bị y tế BYT
- [[sources/15-2024-tt-byt]] — DM ATTP BYT
- [[sources/24-2026-tt-byt]] — Mức rủi ro TBT y tế
- [[sources/27-2026-tt-byt]] — DM thực phẩm, dụng cụ BYT
- [[sources/28-2026-tt-byt]] — DM thuốc, vắc xin, sinh phẩm BYT
- [[sources/1725-qd-bct]] — DM hiệu suất năng lượng BCT
- **125/2021/TT-BCA** — DM pháo hoa, vật liệu nổ BCA (chưa có wiki source)

## Related concepts

- [[concepts/ktcl-byt-attp-2024]] — ATTP BYT (TT 15/2024)
- [[concepts/ktcl-bnnmt-2026]] — Kiểm dịch BNNMT
- [[concepts/ktcl-bct-2026]] — Cắt giảm KTCL BCT
- [[concepts/ktcl-bkhcn-2026]] — Nhóm 2 BKHCN
- [[concepts/ktcl-bnv-2026]] — Thiết bị giám sát BNV
- [[concepts/ktcl-bca-2026]] — Pháo hoa BCA
- [[concepts/ktcl-bxd-vlxd-2026]] — Vật liệu xây dựng BXD
- [[concepts/muc-do-rui-ro-hang-hoa]] — Mức rủi ro theo NĐ 37/2026

## Notes

- KTCL khác với **kiểm dịch** (Bộ NNMT) và **kiểm tra chất lượng hàng hóa** (Bộ KHCN). Mỗi bộ có quy trình riêng.
- Mã HS là yếu tố quyết định: nếu mã HS có trong DM của bất kỳ bộ nào → KTCL bắt buộc.
- Cần check **TẤT CẢ 8 bộ** trước khi xác định mức rủi ro (một sản phẩm có thể nằm trong DM của nhiều bộ).
- Từ 01/7/2026, KTCL "thông thoáng" hơn (nhiều mặt hàng miễn) nhưng thủ tục online phức tạp hơn (cần tài khoản Cổng một cửa quốc gia).
- Tranh chấp: kiện lên Bộ quản lý ngành → Thủ tướng Chính phủ.
