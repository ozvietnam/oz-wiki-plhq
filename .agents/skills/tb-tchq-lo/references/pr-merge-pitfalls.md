# PR merge pitfalls — các bug phát hiện ở session 2026-10-15

Tài liệu này ghi lại số liệu cụ thể Sếp cần review khi merge PR lô TB-TCHQ vào kho precedents.json. Không phải checklist lặp lại từ SKILL.md mà là dữ liệu thực tế đã phát hiện.

## Trùng lặp TB trong kho (24%)

- **Tổng TB unique trong kho**: 3.357
- **TB có 2+ versions**: 805 (24%)
- Mỗi TB có thể tới 4 versions từ 4 contributors khác nhau (legal-customs, lvn-2020, tracuuhs-2026-10-13, thợ-Cào, hermes-tracuuhs).

### VD cụ thể cần review
| TB | Versions | Cùng HS? |
|---|---|---|
| 2614/TB-TCHQ | 4 (legal-customs, hermes-tracuuhs, toan-van, thợ-Cào) | 1 (38249970) |
| 1811/TB-TCHQ/2020 | 2 (legal-customs=32082090, lvn-2020=32089090) | KHÁC HS |
| 1428/TB-TCHQ/2020 | 3 (8433, 8436, 8422) | KHÁC HS |
| 5417, 5418/TB-TCHQ/2022 | 2 mỗi cái | KHÁC HS (32151900 vs 32151110) |

### Khi nào dedup KHÔNG hoạt động
Tool `merge-community.mjs` dùng key `hs::ref::desc(40 chars)`. Nếu 2 version có mô tả khác nhau (legal-customs ghi theo style "Sub4salt F3000 - Theo hồ sơ..." còn thợ-Cào ghi theo "Sub4salt F3000 - thuộc nhóm 38.24...") → key khác nhau → KHÔNG dedup.

## Conflict phân loại (34 TB)

34 TB có cùng số hiệu nhưng các version gán mã HS khác nhau. Đây là data thực - có thể do:
- TB đính chính (legal-customs thêm 1 version, lvn-2020 thêm version khác)
- Nhiều TB cùng số hiệu khác năm (1428/TCHQ-TXNK/2017, 1428/TCHQ-TXNK/2018, ...)
- Agent khác nhau crawl ở thời điểm khác nhau, tool phân loại khác nhau

### Top TB conflict cần review ưu tiên
```
1811/TB-TCHQ/2020: 32082090 vs 32089090
1428/TB-TCHQ/2020: 8433 vs 8436 vs 8422
5417/TB-TCHQ/2022: 32151900 vs 32151110
5418/TB-TCHQ/2022: 32151900 vs 32151110
3566/TB-TCHQ/2022: 35061000 vs 35069100
3568/TB-TCHQ/2022: 35061000 vs 35069100
5126/TB-TCHQ/2022: 39201011 vs 39206290
```

## Records thin (chưa đủ dữ kiện)

266/4220 records (6.3%) có `technicalSpec < 150 chars`. Đây là data kém chất lượng - cần Sếp review lại hoặc tìm bản đầy đủ hơn.

### VD records thin
- `658/TB-TCHQ → 11071000`: "Thuộc nhóm 11.07 \"Malt, rang hoặc chưa rang\", mã số 1107.10.00 \"- Chưa rang\" tạ"
- `2414/TB-TCHQ → 18063100`: "Sô cô la kem sữa hạnh nhân Hershey's kisses." (chỉ 38 chars)

## DINH_CHINH cần review thủ công

15 records trong file detail có `loai: DINH_CHINH` nhưng file lô chỉ ghi `loaiTB: XAC_DINH_TRUOC` (SAI - tool đóng gói detect sai). Sau khi merge, kho KHÔNG phân biệt được DINH_CHINH vs XAC_DINH_TRUOC.

### Records DINH_CHINH bị mất
```
goi-075: 1713, 1172, 1173, 209 (4 records)
goi-086: 101 (1 record)
goi-088: 1927, 3424 (2 records)
goi-090: 1133, 1329 (2 records)
goi-097: 7626, 7627, 5341, 5342, 1979 (5 records)
goi-101: 23956 (1 record - 4967/TB-TCHQ/2026)
```

## Merge tool format inconsistency

- Main merge tool chỉ giữ `loaiTB` + `legacyHs` (boolean).
- File lô em có thêm: `nguyen_tac_phan_loai`, `nhom_hs`, `hs_code_goc`, `loai_hang_ma`, `hs_in_tax_2022`, `legacy_hs`.
- Sau merge: 0/4220 records giữ các field này.
- **Hệ quả nghiêm trọng**: Sếp dạy "nguyên tắc phân loại là giá trị cốt lõi" nhưng data này bị mất khi merge.

## Contributor format

- Main: `{'name': 'thợ-Cào', 'model': 'Hermes-Sonnet-4.5'}`
- File lô em: `{'name': 'thợ-Cào-NNN', 'github': 'ozvietnam'}` - 25 file khác nhau
- Tool đóng gói mặc định dùng `name: <user>-<gói>` → cần sửa thành `thợ-Cào` chuẩn.

## 20 records format cũ (chưa migrate)

20/4220 records vẫn còn field cũ `hsCode`, `description`, `source` thay vì `tbTchqNumber`, `productName`, `sourceFile`. Tất cả ở Ch.38 (38012000-38123900), từ commit cũ (PR #196, #200).

## Path leak (security)

25/25 file lô em push có `note` chứa đường dẫn tuyệt đối `<repo-root>/...` của máy cá nhân. Cần fix script đóng gói để thay path bằng `<repo-root>` hoặc đường dẫn tương đối.
