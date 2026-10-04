# Dùng sổ đăng ký trong ứng dụng khác

Kho này xuất `dist/registry.json` (dựng bằng `npm run dung`, tự cập nhật mỗi thứ Hai). Ứng dụng khác chỉ
**đọc** tệp này; muốn sửa dữ liệu thì mở PR vào `registry/` — không sửa bản chụp ở phía ứng dụng.

URL ổn định: `https://raw.githubusercontent.com/ozvietnam/oz-wiki-plhq/main/dist/registry.json`
Giấy phép CC BY 4.0 — ghi nguồn "oz-wiki-plhq".

## Cấu trúc

```json
{
  "phien_ban": "2026-10-04",
  "tong": 136,
  "van_ban": [{
    "so_hieu": "12/2022/TT-BGTVT",
    "so_hieu_khac": [],
    "tinh_trang": "HET_HIEU_LUC",
    "het_hieu_luc_tu": "2026-07-01",
    "quan_he_nguoc": { "bi_thay_the_boi": [{ "tu": "49/2026/TT-BXD", "quan_he": "thay_the" }] },
    "xac_minh": { "muc": "NGUON_A", "hieu_luc_da_doi_chieu": false },
    "bac_nguon_cao_nhat": "A",
    "slug": "12-2022-tt-bgtvt"
  }]
}
```

## Quy tắc khi dùng

1. **So khớp số hiệu** bằng khoá chuẩn: viết hoa, `Đ` → `D`, bỏ khoảng trắng (xem `khoa()` trong
   `tools/lib/registry.mjs`); nạp cả `so_hieu_khac` vào chỉ mục.
2. **Tôn trọng mức xác minh:** `xac_minh.hieu_luc_da_doi_chieu: false` nghĩa là tình trạng hiệu lực chưa
   được đối chiếu nguồn A — hiển thị như cảnh báo cần kiểm lại, không như kết luận.
3. **Không tự suy hiệu lực từ ngày**: dùng `tinh_trang` + `het_hieu_luc_tu`; quan hệ có `pham_vi` là tác
   động một phần.
4. Thấy sai → mở issue mẫu "Sai hiệu lực" ở kho này.

## Ứng dụng đang dùng

- **[hs-code-api](https://github.com/ozvietnam/hs-code-api)** — `scripts/sync-plhq.mjs` chụp tệp này vào
  `data/plhq-registry.json`; `/api/tax` trả `legalBasisRegistry` (hiệu lực từng văn bản mà cột chính sách
  của mã HS dẫn) và đưa văn bản hết hiệu lực/tạm ngưng vào `policyBasisReview`. `scripts/bench-plhq.mjs` đo
  độ phủ trên toàn biểu thuế và in danh sách văn bản cần kho này đối chiếu trước (theo số mã HS chịu ảnh hưởng).
