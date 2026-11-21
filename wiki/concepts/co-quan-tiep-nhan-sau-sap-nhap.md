---
id: co-quan-tiep-nhan-sau-sap-nhap
title: "Cơ quan tiếp nhận và ban hành văn bản sau sáp nhập (2025–2026)"
type: concept
created: 2026-11-21
updated: 2026-11-21
key_sources: []
related_concepts: []
confidence: high
tags: [bo-may, sap-nhap, co-quan, hai-quan, kiem-tra-chuyen-nganh, 2025, 2026]
---

## Definition

Trong giai đoạn sắp xếp lại tổ chức bộ máy nhà nước (2025–2026), nhiều bộ và cơ quan đầu mối tiếp nhận thủ tục kiểm tra chuyên ngành, cấp phép và thủ tục hải quan đã hợp nhất hoặc chuyển giao chức năng sang cơ quan mới. Sổ đăng ký cơ quan (`registry/co-quan.yaml`) giữ lại ký hiệu cơ quan cũ ở trạng thái `DA_SAP_NHAP` hoặc `DA_SAP_XEP` để đọc văn bản lịch sử, đồng thời gắn trường `sap_nhap_vao` trỏ tới cơ quan kế thừa đang `HOAT_DONG`. Khi tra cứu văn bản mới từ 2025–2026 hoặc xác định nơi nộp hồ sơ hiện hành, cần tra theo ký hiệu cơ quan kế thừa thay vì ký hiệu cũ.

## Variants

Bảng ánh xạ 5 nhóm cơ quan sau sáp nhập theo `registry/co-quan.yaml` và các văn bản đã đối chiếu trong `registry/van-ban/`:

| Ký hiệu cũ (`co-quan.yaml`) | Tên cơ quan cũ | Tình trạng (`co-quan.yaml`) | Ký hiệu kế thừa (`sap_nhap_vao`) | Cơ quan kế thừa (`HOAT_DONG`) | Căn cứ bộ máy & văn bản nghiệp vụ tiêu biểu trong sổ |
|---|---|---|---|---|---|
| `BNNPTNT` / `BTNMT` | Bộ Nông nghiệp và Phát triển nông thôn / Bộ Tài nguyên và Môi trường | `DA_SAP_NHAP` | `BNNMT` | Bộ Nông nghiệp và Môi trường (`https://mae.gov.vn`) | `35/2025/NĐ-CP` (hiệu lực `2025-03-01`, thay thế `105/2022/NĐ-CP` đã hết hiệu lực); danh mục KTCN `27/2026/TT-BNNMT`; phân cấp ATTP `22/2026/TT-BNNMT`; kiểm dịch động vật `01/2026/TT-BNNMT`; hồ sơ kiểm dịch thực vật `99/2026/VBHN-TT-BNNMT` |
| `BTTTT` | Bộ Thông tin và Truyền thông | `DA_SAP_NHAP` | `BKHCN` | Bộ Khoa học và Công nghệ (`https://most.gov.vn`) | `28/2023/NĐ-CP` (nghị định chức năng BKHCN cũ đã hết hiệu lực `HET_HIEU_LUC` từ `2025-03-01` khi hợp nhất Bộ KH&CN và Bộ TT&TT); danh mục KTCN `36/2026/TT-BKHCN` thay `29/2025/TT-BKHCN`, `30/2011/TT-BTTTT`, `15/2018/TT-BTTTT`, `10/2020/TT-BTTTT` |
| `BGTVT` | Bộ Giao thông vận tải | `DA_SAP_NHAP` | `BXD` | Bộ Xây dựng (`https://moc.gov.vn`) | `33/2025/NĐ-CP` (hiệu lực `2025-03-01`) và `354/2026/NĐ-CP` (hiệu lực `2026-09-15`); danh mục KTCN GTVT `49/2026/TT-BXD` bãi bỏ `12/2022/TT-BGTVT`, `62/2024/TT-BGTVT` |
| `BLDTBXH` (`BLĐTBXH`) | Bộ Lao động - Thương binh và Xã hội | `DA_SAP_NHAP` | `BNV` | Bộ Nội vụ (`https://moha.gov.vn`) | `276/2026/NĐ-CP` (hiệu lực `2026-07-08`) giao Bộ Nội vụ quản lý an toàn, vệ sinh lao động sau khi Bộ LĐ-TB&XH giải thể; danh mục KTCN `16/2026/TT-BNV` thay `01/2021/TT-BLĐTBXH`, `26/2018/TT-BLĐTBXH`, `13/2024/TT-BLĐTBXH` |
| `TCHQ` | Tổng cục Hải quan | `DA_SAP_XEP` | `CHQ` | Cục Hải quan (thuộc Bộ Tài chính, `https://customs.gov.vn`) | Văn bản phân loại và quy trình năm 2025–2026 mang ký hiệu `CHQ` (`117/QĐ-CHQ`, `2169/QĐ-CHQ`, `2123/QĐ-CHQ`, `1813/2026/QĐ-CHQ`). **Mốc chuyển đổi và nghị định/văn bản căn cứ của việc chuyển `TCHQ` → `CHQ`: CHƯA XÁC MINH văn bản gốc theo `registry/co-quan.yaml`** |

**Lưu ý khi tra cứu và nộp hồ sơ:**

- Văn bản cũ của các bộ/tổng cục đã sáp nhập có thể vẫn còn hiệu lực một phần hoặc toàn bộ nếu chưa bị thay thế/bãi bỏ (ví dụ `33/2014/TT-BNNPTNT` về trình tự kiểm dịch thực vật đang ở trạng thái `HET_HIEU_LUC_MOT_PHAN` và phải đọc kèm các văn bản sửa đổi, hợp nhất như `99/2026/VBHN-TT-BNNMT`, `22/2026/TT-BNNMT`).
- Khi tìm thông tư/quyết định ban hành từ năm 2025–2026 trở đi, tra theo ký hiệu cơ quan kế thừa (`TT-BNNMT`, `TT-BKHCN`, `TT-BXD`, `TT-BNV`, `QĐ-CHQ`) và kiểm tra phân cấp tiếp nhận tại địa phương (ví dụ UBND cấp tỉnh, Sở chuyên ngành theo `22/2026/TT-BNNMT`, `16/2026/TT-BNV`, `36/2026/TT-BKHCN`).

## Key sources

- `registry/co-quan.yaml` — danh mục chuẩn hóa ký hiệu cơ quan, trạng thái `HOAT_DONG` / `DA_SAP_NHAP` / `DA_SAP_XEP` và quan hệ `sap_nhap_vao`.
- `registry/van-ban/35-2025-nd-cp.yaml` (`35/2025/NĐ-CP`, `NGUON_A`), `registry/van-ban/33-2025-nd-cp.yaml` (`33/2025/NĐ-CP`, `NGUON_A`), `registry/van-ban/354-2026-nd-cp.yaml` (`354/2026/NĐ-CP`, `NGUON_A`), `registry/van-ban/276-2026-nd-cp.yaml` (`276/2026/NĐ-CP`, `NGUON_A`), `registry/van-ban/28-2023-nd-cp.yaml` (`28/2023/NĐ-CP`, đã hết hiệu lực `HET_HIEU_LUC`, `NGUON_A`).
- `registry/van-ban/27-2026-tt-bnnmt.yaml`, `registry/van-ban/36-2026-tt-bkhcn.yaml`, `registry/van-ban/49-2026-tt-bxd.yaml`, `registry/van-ban/16-2026-tt-bnv.yaml`, `registry/van-ban/117-qd-chq-2026.yaml`, `registry/van-ban/2123-qd-chq-2025.yaml`, `registry/van-ban/2169-qd-chq-2025.yaml`.

## Related concepts

- (Xem tổng hợp ngữ cảnh thủ tục hải quan và các khái niệm liên quan tại [[summary/khung-thu-tuc-hai-quan]].)

## Mentioned in

- [[summary/khung-thu-tuc-hai-quan]]

## Notes

- Không suy đoán hoặc tự điền ngày/văn bản căn cứ cho mốc chuyển `TCHQ` → `CHQ` cho tới khi văn bản gốc quy định chức năng, nhiệm vụ của Cục Hải quan được nạp và đối chiếu nguồn bậc A vào sổ (việc của luồng Truy vết nguồn).
- Đối với ký hiệu trong `registry/co-quan.yaml`, không dấu dùng `BLDTBXH`, trong số hiệu văn bản thực tế viết `BLĐTBXH` (ví dụ `01/2021/TT-BLĐTBXH`, `26/2018/TT-BLĐTBXH`, `13/2024/TT-BLĐTBXH` — đều đã hết hiệu lực `HET_HIEU_LUC`).
