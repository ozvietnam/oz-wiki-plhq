# Tra tiền lệ phân loại TB-TCHQ

**Tiền lệ** = kết luận phân loại mà Tổng cục Hải quan đã công bố cho các lô hàng cụ thể (Thông báo
TB-TCHQ / TB-CHQ). Trả lời câu hỏi nghề: *"Nhóm hàng này Tổng cục từng kết luận mã gì?"*

## Dùng

```bash
node tools/tien-le.mjs 8708          # theo nhóm HS 4/6/8 số (chấp nhận "87.08")
node tools/tien-le.mjs 503/TB-TCHQ   # theo đầu số hiệu thông báo
```

## Dữ liệu

| Tệp trong `data/customs/processed/` | Nguồn | Vai trò |
|---|---|---|
| `tracuuhs-ket-qua-phan-loai-*.json` | tracuuhs.com/ket-qua-phan-loai (bậc C) | 2.304 thông báo: số hiệu ↔ nhóm HS + tả hàng |
| `all-1990-2026.csv` | customs.gov.vn (cổng chính thức) | 17.911 thông báo 1990–2026: ngày ban hành + link PDF gốc |
| `tracuuhs-detail-*.json`, `BAO-CAO-*.md` | tracuuhs.com | Chi tiết + báo cáo crawl |

Tool ghép hai nguồn theo số hiệu (customs.gov.vn ghi không kèm năm). Không gọi mạng khi tra.

## Độ tin cậy — đọc như luật sư

- TB-TCHQ là **văn bản cá biệt** áp cho từng lô hàng/từng doanh nghiệp: **tham khảo**, không căn cứ
  pháp lý cho khai báo. Căn cứ phân loại là Luật Hải quan, TT 85/2026/TT-BTC và GRI — xem
  [wiki/concepts/phan-loai-ma-hs.md](../wiki/concepts/phan-loai-ma-hs.md).
- Dữ liệu tracuuhs là nguồn bậc C (đầu mối). Khi đưa vào tư vấn cho người khai, mở PDF gốc trên
  customs.gov.vn (link do tool trả) để đối chiếu.
- Kho dữ liệu tĩnh theo ngày crawl — cập nhật bằng đợt crawl mới (xem `BAO-CAO-*.md` trong cùng thư mục).
