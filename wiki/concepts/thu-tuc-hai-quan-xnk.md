---
id: thu-tuc-hai-quan-xnk
title: "Thủ tục hải quan hàng xuất nhập khẩu"
type: concept
created: 2026-10-04
updated: 2026-10-04
key_sources: []
related_concepts:
  - phan-loai-ma-hs
  - thue-gtgt-hang-nhap-khau
  - doc-tinh-trang-hieu-luc
confidence: medium
tags: [hai-quan, thu-tuc]
---

## Definition

Thủ tục hải quan là chuỗi nghĩa vụ khai, nộp hồ sơ, chịu kiểm tra/giám sát khi đưa hàng hoá qua biên giới theo **Luật Hải quan** `54/2014/QH13`. Sổ đăng ký xếp luật ở nhánh `hai-quan/luat-khung`, tình trạng `CON_HIEU_LUC`, hiệu lực từ `2015-01-01`. Chi tiết thi hành nằm ở nghị định và thông tư cùng chuỗi — không đọc một mình luật khi tra chỉ tiêu khai trên tờ khai.

## Variants

| Tầng | Số hiệu (sổ) | Vai trò theo sổ | Quan hệ ghi trong sổ |
|---|---|---|---|
| Luật khung | `54/2014/QH13` | Luật Hải quan | — |
| Nghị định hướng dẫn | `08/2015/NĐ-CP` | Thủ tục, kiểm tra, giám sát, kiểm soát hải quan | `quan_he.huong_dan` → `54/2014/QH13` |
| Thông tư thủ tục | `38/2015/TT-BTC` | Thủ tục hải quan; kiểm tra, giám sát; thuế XNK và quản lý thuế | `quan_he.huong_dan` → `54/2014/QH13`, `08/2015/NĐ-CP` |
| Sửa đổi thông tư | `39/2018/TT-BTC` | Sửa đổi, bổ sung một số điều của `38/2015/TT-BTC` | `quan_he.sua_doi` → `38/2015/TT-BTC` |
| Một cửa (sắp thay) | `85/2019/NĐ-CP` → `336/2026/NĐ-CP` | Cơ chế một cửa quốc gia / ASEAN + KTCN | `336/2026/NĐ-CP` `thay_the` từ `2026-10-15` |

**Mô tả hàng hoá trên tờ khai:** ghi chú sổ tại `39/2018/TT-BTC` nêu phụ lục chỉ tiêu khai gồm yêu cầu mô tả hàng hoá (mục 1.78). Wiki **chưa** trích nguyên văn mục đó vì chưa nạp toàn văn — chỉ neo số hiệu đã đăng ký.

## Key sources

Chưa có trang nguồn wiki. Căn cứ hiện tại: tệp sổ `registry/van-ban/` cho các số hiệu trên (`xac_minh.hieu_luc_da_doi_chieu: false` với nhóm khung hải quan lúc khởi tạo).

## Related concepts

- [[concepts/phan-loai-ma-hs]] — mã HS gắn với mô tả hàng và biểu thuế.
- [[concepts/thue-gtgt-hang-nhap-khau]] — thuế nội địa khâu nhập khẩu.
- [[concepts/doc-tinh-trang-hieu-luc]] — đọc `sua_doi` / `thay_the` / ngày hết hiệu lực một cửa.

## Mentioned in

- [[summary/khung-thu-tuc-hai-quan]]

## Notes

Không phải tư vấn pháp lý. Câu hỏi mẫu về danh mục chứng từ hồ sơ hải quan (#7 trong `docs/cau-hoi-mau.md`) vẫn **chưa** trả lời được ở mức điều/khoản cho đến khi có toàn văn và `/lumi-ingest`.
